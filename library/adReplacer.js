'use strict';

const adFilterURL = chrome.runtime.getURL("./library/adFilter.js");
/**
 * Locates advertisement and then replaces it with memes
 * 
 * Memes must be in a reachable extension store or they must be passed from main
 * @param {Array} memeArray holds links of meme's
 */
const replaceAds = async (memeArray) =>{

    console.log("document.readyState atm =  "+document.readyState);
    const adFilter = await import(adFilterURL);
    let frameList = locateAdsFrame();
    let divList = locateAdsDiv();
    let filteredFrameList = [];
    let filteredDivList = [];
    
    if (frameList != undefined)
    {
        filteredFrameList = await adFilter.filterFrames(frameList);
        console.log(filteredFrameList);
        
        //this loop is for test
        filteredFrameList.forEach(frameElement => {
            
            let newImgTag = document.createElement("img");
            newImgTag.src = "https://raw.githubusercontent.com/bridge-software/AdMemer/master/resources/placeholders/adnoneplaceholder.jpg"
            
            //let randomNum = Math.round(Math.random() * 10)
            //newImgTag.src = memeArray[randomNum];
            frameElement.parentNode.replaceChild(newImgTag, frameElement);     
        });
        
        //real iteration is like tihs
        //filteredFrameList = await adFilter.filterFrames(frameList);
        //start imageScaler (gets images from extension storage and also gets filtered ads locations from adReplacer then scales them as ad image size)
        //call both with await
        //then createNewDomElements (scaledMemeArray,adTagArray)
        //then replace all via loop
    }
    else
    {console.log("Frame List Empty !");}

    if (divList != undefined) 
    {
        filteredDivList = await adFilter.filterDivisions(divList);
        //this loop is for test
        filteredDivList.forEach (divElement =>  {
            
            console.log(filteredDivList);
            
            let newImgTag = document.createElement("img");
            newImgTag.src = "https://raw.githubusercontent.com/bridge-software/AdMemer/master/resources/placeholders/adnoneplaceholder.jpg"
            
            //let randomNum = Math.round(Math.random() * 10)
            //newImgTag.src = memeArray[randomNum];
            if(divElement.tagName == "A" && divElement.parentNode != undefined)
            {
                console.log("THIS IS TAG A");
                divElement.parentNode.replaceChild(newImgTag, divElement); 
            }
            else if (divElement.tagName == "img" && divElement.parentNode != undefined)
            {
                console.log("THIS IS TAG IMG");
                divElement.parentNode.replaceChild(newImgTag, divElement); 
            }
            else
            {
                console.log("replacing a div "+divElement.id);
                divElement.parentNode.replaceChild(newImgTag, divElement);    
            }
             
        });
    } 
    else {console.log("Division List Empty !");}

};

/**
 * It will create new dom img with a random picture from meme array
 * 
 * ! Meme array and tag array must be in matching order !
 * 
 * @param {Array} scaledMemeArray holds scaled memes
 * @param {Array} adTagArray holds filtered tags for ad replacement
 * @returns {HTMLElement} html img element
 */
function createNewDomElements (scaledMemeArray,adTagArray){

    let imgTagArray = []
    for (let index = 0; index < adTagArray.length; index++) 
    {
        let newImg = document.createElement("img");
        newImg.id  = "MemeIMG_"+index.toString();
        newImg.src = scaledMemeArray[index];
        imgTagArray.push(newImg)
    }
  console.log("imgTagArray "+imgTagArray);
  
  return imgTagArray;
} 


/**
 * Locate ads in division tags,
 * searches pre-defined names for id's ,classes and links.
 * @returns {Array} array that holds possible ad tags
 */
function locateAdsDiv (){
    let divList = document.body.getElementsByTagName('div');
    let childNum = 0;
    let possibleAdDivisions = [];
    for(let divIndex = 0; divIndex < divList.length; divIndex++)
    {
        if(divList[divIndex].hasChildNodes())
            {possibleAdDivisions.push(divList[divIndex]);}
    }
    return possibleAdDivisions;
}

/**
 * Locate ads in iframe tags.
 * 
 * it takes all of the iframes and if it has a inner document, selects it as a possible advertisement tag.
 * @returns {Array} array that holds possible ad tags
 */
function locateAdsFrame (){
    let frameList = document.body.getElementsByTagName('iframe');
    let possibleAdFrames = [];
    for(let frameIndex = 0; frameIndex < frameList.length; frameIndex++)
    {
        console.log("\niframe "+ frameIndex +
                    " id ==> "+ frameList[frameIndex].id+
                    " src ==> "+frameList[frameIndex].src);
        console.log("\n SOURCE OF FRAME "+frameList[frameIndex].src + "\n");
        possibleAdFrames.push(frameList[frameIndex]);
    }
    return possibleAdFrames;
} 

export { replaceAds };

