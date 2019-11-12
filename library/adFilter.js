'use strict';

const httpClientURL = chrome.runtime.getURL("./utilities/httpClient.js");
const linkSlicerURL = chrome.runtime.getURL("./utilities/linkSlicer.js");
/**
 * Filters possible advertisement iframes which has been located by adReplacer functions.
 * @param {Array} frameList 
 * @returns {Array} array of filtered frames.
 */
async function filterFrames  (frameList){
    
    console.log("FILTERING STARTS FOR IFRAMES");
    
    const httpCall = await import(httpClientURL);
    const slicer = await import(linkSlicerURL);
    let jsonFile = await httpCall.xhrGetFileLocal("/resources/hosts.json");
    let jsonOBJ = JSON.parse(jsonFile);
    let filteredFrames = [];
    let innerDoc;
    let slicedLink = "";

    frameList.forEach(frameElement => {
        
        innerDoc = frameElement.contentDocument;

        if(innerDoc != undefined )
        {
            console.log("inner doc found for src "+frameElement.src+" id "+frameElement.id);       
            if(innerDoc.body.getElementsByTagName("iframe").length == 0 && innerDoc.images.length == 0)
            {console.log("Misunderstood,this frame has no ad!");}
            else{
                console.log("ad found in frame, src "+frameElement.src+" id "+frameElement.id);  
                filteredFrames.push(frameElement);
            }
        }
        /*else if (frameElement.className.toString().indexOf("lazy") > -1 )
        {
            console.log("FOUND A AD IN FRAME AND IT IS LAZY LOAD !\n Blasphemy !\n ");
            filteredFrames.push(frameElement);
        }*/
        else if (frameElement.hasAttribute("src") ) 
        {
            console.log("Frame has no inner doc,but has source\n");
            slicedLink = slicer.linkSlicer(frameElement.src.toString())

            if(jsonOBJ.advertisementLinks.includes(slicedLink))
            {
                console.log("SOURCE HAS BEEN FOUND IN LINKS");
                filteredFrames.push(frameElement);
            }
            else
            {console.log("Source has not found in host links !\n");}
            slicedLink = "";    
        }
        else
        {console.log("This frame"+ frameElement.id +" has no inner doc and has no source\n");}

        
    });
    return filteredFrames
}


/**
 * Filters possible advertisement division which has been located by adReplacer functions.
 * It also searches child nodes of divisions.If a child has a tag "img" or "a" with source/href to ads, it is criminal!
 * 
 * No lazy load implementation atm.GET THAT ASAP!
 *  
 * @param {Array} divList array of divisions
 * @returns {Array} filtered composition of divisions/"div" , images/"img" and links/"a" in an array.
 */
async function filterDivisions (divList){

    console.log("FILTERING STARTS FOR DIVISIONS");

    const httpCall = await import(httpClientURL);
    let jsonFile = await httpCall.xhrGetFileLocal("/resources/hosts.json");
    let jsonOBJ = JSON.parse(jsonFile);
    let jsonFileIDS = await httpCall.xhrGetFileLocal("/resources/advertisementID.json");
    let jsonObjIDS= JSON.parse(jsonFileIDS);
    let filteredDivs = [];
    let linkElements = [];
    let imgElements = [];
    let slicedLink = "";
    let tempArray = [];

    //filteredDivs = filteredDivs.concat(framelessDivAds(divList,jsonObjIDS));

    //It looks already decided divisions again, make framelessDivAds() remove decided elements from "divList"
    divList.forEach(divElement => {
        
        slicedLink = "";  
        if(divElement.hasAttribute("src"))
        {
            console.log("Div has source ");
            slicedLink = slicer.linkSlicer(divElement.src.toString());

            if(jsonOBJ.advertisementLinks.includes(slicedLink))
            {
                console.log("FOUND A AD IN DIV ");
                filteredDivs.push(divElement);
            }
            else
            {console.log("Source has not found in host links !\n");}    
        }
        /*else if (divElement.className.toString().indexOf("lazy") > -1  )
        {
            console.log("FOUND A AD IN DIV AND IT IS LAZY LOAD !\n Blasphemy !\n ");
            filteredDivs.push(divElement);
        }*/
        else if (divElement.hasChildNodes())
        {  
        
            //After getting the possible ad div, search for ad tags such as link ( a ) and image ( img )
            linkElements = divElement.getElementsByTagName("a");
            tempArray = filterHrefAndSource(linkElements,jsonOBJ);
            filteredDivs = filteredDivs.concat(tempArray);
            tempArray = [];

            imgElements = divElement.getElementsByTagName("img");
            tempArray = filterHrefAndSource(imgElements,jsonOBJ);
            filteredDivs = filteredDivs.concat(tempArray);
            tempArray = [];
        }
    });
    return filteredDivs;
}
/**
 * [ASYNC]
 * Takes array of tags and filters them for ads.
 * It filters via predefined advertisement links from file hosts.json 
 * @param {Array} tagArray array of tags with child nodes
 * @param {Object} jsonOBJ a parsed json object
 * @returns {Array} tags which has ads.
 */
async function filterHrefAndSource (tagArray,jsonOBJ) 
{   
    const slicer = await import(linkSlicerURL);
    console.log("FILTERING FOR IMG/A STARTS");
    let filteredTags = [];
    let slicedLink = "";

    for (let index = 0; index < tagArray.length; index++) 
    {
        const element = tagArray[index];
        slicedLink = "";
        if(element.hasAttribute("href"))
        {  
            slicedLink = slicer.linkSlicer(element.href.toString());
            if(jsonOBJ.advertisementLinks.includes(slicedLink))
            {
                console.log("FOUND A AD IN DIV WITH CHILD 'A' VIA HREF");
                filteredTags.push(element);
            }
            else
            {console.log("Source has not found in host links !\n");}  
        }
        else if (element.hasAttribute("src"))
        {
            slicedLink = slicer.linkSlicer(element.src.toString());
            if(jsonOBJ.advertisementLinks.includes(slicedLink))
            {
                console.log("FOUND A AD IN DIV WITH CHILD 'A' VIA SRC");
                filteredTags.push(element);
            }
            else
            {console.log("Source has not found in host links !\n");}
        } 
    }
    return filteredTags;
}
function framelessDivAds (tagArray,jsonOBJ){
    console.log("FILTERING FOR AD-DIVS STARTS");
    let filteredTags = [];

    for (let index = 0; index < tagArray.length; index++) {
        const item = tagArray[index];
        
        console.log("filtering for id = "+item.id+" class = "+item.className );
        
        jsonOBJ.advertisementIDs.forEach(element => {

            console.log("include num "+item.className.indexOf(element));
            
            if(item.className.indexOf(element) > -1)
            {console.log(element+" ==> Found ad division via class name");filteredTags.push(item);}
            else if(item.id.indexOf(element) > -1)
            {console.log(element+" ==> Found ad division via id");filteredTags.push(item)}
        });
    }
    console.log(filteredTags);
    return filteredTags;
}

export {filterFrames,  filterDivisions};