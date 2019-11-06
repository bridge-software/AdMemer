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
    let tempSTR = "";
    let tempStartIndex = 0; 
    let tempEndIndex = 0; 
    frameList.forEach(frameElement => {
        
        innerDoc = frameElement.contentDocument;

        if(innerDoc != undefined )
        {
            console.log("inner doc found ");
            if(innerDoc.getElementsByTagName("iframe") == undefined || innerDoc.getElementsByTagName("img") == undefined)
            {console.log("Misunderstood,this frame has no ad!");}
            else{filteredFrames.push(frameElement);}
            
        }
        else if (frameElement.hasAttribute("src") ) 
        {
            console.log("\nFrame has no inner doc,but has source\n");
            tempStartIndex = frameElement.src.indexOf("https://") + 8;
            tempEndIndex = frameElement.src.indexOf(".com") + 4;
            tempSTR = frameElement.src.slice(tempStartIndex,tempEndIndex);
            console.log("\r!!frameElement.src = "+frameElement.src+"sliced src "+tempSTR);
            if(jsonOBJ.advertisementLinks.includes(tempSTR))
            {
                console.log("SOURCE HAS BEEN FOUND IN LINKS");
                filteredFrames.push(frameElement);
            }
            else
            {console.log("\nSource has not found in host links !\n");}    
        }
        else
        {console.log("\nFrame has no inner doc and has no source\n");}
    });
    return filteredFrames
}

async function filterDivisions (){

}


export {filterFrames,  filterDivisions};