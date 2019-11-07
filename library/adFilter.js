'use strict';
//adfilter must 
//they passes a array of tags
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

async function filterDivisions (divList){

    const httpCall = await import(httpClientURL);
    let jsonFile = await httpCall.xhrGetFileLocal("/resources/hosts.json");
    let jsonOBJ = JSON.parse(jsonFile);
    let filteredDivs = [];
    let linkElements = [];
    let slicedLink = "";

    divList.forEach(divElement => {

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
            slicedLink = "";
        }
        else if (divElement.hasChildNodes())
        {
            linkElements = divElement.getElementsByTagName("a");
           for (let index = 0; index < linkElements.length; index++) {
               const element = linkElements[index];
               if(element.hasAttribute("href"))
               {  
                    slicedLink = linkSlicer(element.href.toString());
                    if(jsonOBJ.advertisementLinks.includes(slicedLink))
                    {
                        console.log("FOUND A AD IN DIV WITH CHILD 'A' VIA HREF");
                        filteredDivs.push(element);
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
                        filteredDivs.push(element);
                    }
                    else
                    {console.log("Source has not found in host links !\n");}
                    slicedLink = "";    
               } 
           } 
        } 
    });

    return filteredDivs;

}

const linkSlicer = (link) =>{
    let tempSTR = "";
    let tempStartIndex = 0; 
    let tempEndIndex = 0; 

    tempStartIndex = link.indexOf("https://") + 8;//!!!!! WARNING !!!!! we also need http
    tempEndIndex = link.indexOf(".com") + 4;
    tempSTR = link.slice(tempStartIndex,tempEndIndex);
    console.log("\nlink = "+link+"sliced link "+tempSTR);
    return tempSTR;

}

export {filterFrames,  filterDivisions};