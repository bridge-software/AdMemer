'use strict';

const adFilterURL = chrome.runtime.getURL("./library/adFilter.js");
const imageScalerURL = chrome.runtime.getURL("./library/imageScaler.js");

/**
 * Locates advertisement and then replaces it with memes
 * 
 * Memes must be in a reachable extension store or they must be passed from main
 * @param {Array} memeArray holds links of meme's
 */
const replaceAds = async (memeArray) =>{

    const adFilter = await import(adFilterURL);
    const imageScaler = await import(imageScalerURL);

    let frameList = locateAdsFrame();
    let divList = locateAdsDiv();
    let filteredFrameList = [];
    let filteredDivList = [];
    let scaledImgList = [];
    let index = 0;

    console.log("IFRAME REPLACEMENT STARTS");
 
    if (frameList != undefined)
    {
        console.log(frameList);
        filteredFrameList = await adFilter.filterFrames(frameList);
        scaledImgList = await imageScaler.scaleImages(filteredFrameList);

        console.log(filteredFrameList);
        console.log(scaledImgList);
        
        //this loop is for test
        filteredFrameList.forEach(frameElement => {
            
            let newImgTag = document.createElement("img");
            let newWidth = scaledImgList[index].style.width;
            let newHeight = scaledImgList[index].style.height;
            
            //console.log("MEME ARRAY ");
            //console.log(scaledImgList);
            //console.log("img at index "+scaledImgList[index]);

            //newImgTag.src = "https://raw.githubusercontent.com/bridge-software/AdMemer/master/resources/placeholders/adnoneplaceholder.jpg"
            //let randomNum = Math.round(Math.random() * 10)
            //newImgTag.src = memeArray[randomNum];
            newImgTag.src = scaledImgList[index].src;
            newImgTag.setAttribute("style", "width:" + newWidth + ";height:" + newHeight+";"  )

            frameElement.parentNode.replaceChild(newImgTag, frameElement);
            index++;     
        });
        index = 0;
        
        //real iteration is like tihs
        //filteredFrameList = await adFilter.filterFrames(frameList);
        //scaledImgList = await imageScaler.scaleImages(filteredFrameList);
        //then createNewDomElements (scaledMemeArray,adTagArray)
        //then replace all via loop
    }
    else
    {console.log("Frame List Empty !");}
    
    divList = locateAdsDiv();
    console.log("DIVISION REPLACEMENT STARTS");
    if (divList != undefined) 
    {

        let tempArr = await adFilter.filterDivisions(divList);
        filteredDivList = filteredDivList.concat(tempArr);
        scaledImgList = await imageScaler.scaleImages(filteredDivList);

        console.log(filteredDivList);
        console.log(scaledImgList);
        //this loop is for test
        filteredDivList.forEach (divElement =>  {
            
            
            let newImgTag = document.createElement("img");
            let newWidth = scaledImgList[index].style.width;
            let newHeight = scaledImgList[index].style.height;

            console.log("img at index "+scaledImgList[index]);
            //newImgTag.src = "https://raw.githubusercontent.com/bridge-software/AdMemer/master/resources/placeholders/adnoneplaceholder.jpg"
            //let randomNum = Math.round(Math.random() * 10)
            //newImgTag.src = memeArray[randomNum];
            
            
            newImgTag.src = scaledImgList[index].src;
            newImgTag.setAttribute("style", "width:" + newWidth + ";height:" + newHeight+";"  )
            
            if(divElement.tagName == "A" && divElement.parentNode != undefined)
            {
                console.log("THIS IS TAG A, REPLACING IT");
                divElement.parentNode.replaceChild(newImgTag, divElement); 
            }
            else if (divElement.tagName == "img" && divElement.parentNode != undefined)
            {
                console.log("THIS IS TAG IMG, REPLACING IT");
                divElement.parentNode.replaceChild(newImgTag, divElement); 
            }
            else if(divElement.parentNode != undefined)
            {
                console.log("replacing a div "+divElement.id);
                divElement.parentNode.replaceChild(newImgTag, divElement);    
            }
            index++;
        });
        index = 0;
    } 
    else {console.log("Division List Empty !");}

    console.log("\n\n REPLACEMENT IS OVER \n\n")
    
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
    const htmlDivList = document.body.getElementsByTagName('div');
    let divList = Array.from(htmlDivList);
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
 * @returns {Array} array that holds possible ad tags
 */
function locateAdsFrame (){
    const htmlFrameList = document.getElementsByTagName('iframe');
    let frameList = Array.from(htmlFrameList);
    let possibleAdFrames = [];
    console.log("frames ");
    console.log(frameList);

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

