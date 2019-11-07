'use strict';

const httpClientURL = chrome.runtime.getURL("./utilities/httpClient.js");

/**
 * Filters possible advertisement iframes which has been located by adReplacer functions.
 * @param {Array} frameList 
 * @returns {Array} array of filtered frames.
 */
async function filterFrames  (frameList){
    
    console.log("FILTERING STARTS");
    
    const httpCall = await import(httpClientURL);
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
            else{filteredFrames.push(frameElement);}
            
        }
        else if (frameElement.hasAttribute("src") ) 
        {
            console.log("Frame has no inner doc,but has source\n");
            slicedLink = linkSlicer(frameElement.src.toString())

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
        {console.log("Frame has no inner doc and has no source\n");}
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

    const httpCall = await import(httpClientURL);
    let jsonFile = await httpCall.xhrGetFileLocal("/resources/hosts.json");
    let jsonOBJ = JSON.parse(jsonFile);
    let filteredDivs = [];
    let linkElements = [];
    let imgElements = [];
    let slicedLink = "";
    let tempArray = [];

    divList.forEach(divElement => {
        
        slicedLink = "";  
        if(divElement.hasAttribute("src"))
        {
            console.log("Div has source ");
            slicedLink = linkSlicer(divElement.src.toString());

            if(jsonOBJ.advertisementLinks.includes(slicedLink))
            {
                console.log("FOUND A AD IN DIV ");
                filteredDivs.push(divElement);
            }
            else
            {console.log("Source has not found in host links !\n");}    
        }
        else if (divElement.hasChildNodes())
        {  
            //MAYBE MAKE THESE AS FUNC?
            
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
 * Takes array of tags and filters them for ads.
 * It filters via predefined advertisement links from file hosts.json 
 * @param {Array} tagArray array of tags with child nodes
 * @param {Object} jsonOBJ a parsed json object
 * @returns {Array} tags which has ads.
 */
function filterHrefAndSource (tagArray,jsonOBJ) 
{   
    console.log("FILTERING FOR IMG/A STARTS");
    let filteredTags = [];
    let slicedLink = "";

    for (let index = 0; index < tagArray.length; index++) 
    {
        const element = tagArray[index];
        slicedLink = "";
        if(element.hasAttribute("href"))
        {  
            slicedLink = linkSlicer(element.href.toString());
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
            slicedLink = linkSlicer(element.src.toString());
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

/**
 * Slices the links via "https://",".com" and "/"
 * @param {String} link 
 * @returns {String} sliced link
 */
const linkSlicer = (link) =>{
    let tempSTR = "";
    let tempStartIndex = 0; 
    let tempEndIndex = 0; 
    let tempSTR_holder = "";

    tempStartIndex = link.indexOf("https://") + 8;//!!!!! WARNING !!!!! we also need http
    tempEndIndex = link.indexOf(".com") + 4;
    if(tempEndIndex < 5)
    {
        tempSTR_holder = link.slice(tempStartIndex);
        console.log("tempSTR_holder "+tempSTR_holder);
        
        tempEndIndex = link.indexOf("/") + tempStartIndex;
        console.log("tempEndIndex "+tempEndIndex);
        
    }
    tempSTR = link.slice(tempStartIndex,tempEndIndex);
    console.log("\nlink = "+link+"  sliced link "+tempSTR);

    return tempSTR;
}

export {filterFrames,  filterDivisions};