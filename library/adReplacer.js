'use strict';

/**
 * Locates advertisement and then replaces it with memes
 * 
 * Memes must be in a reachable extension store or they must be passed from main
 * 
 */
const replaceAds = () =>{

    console.log("document.readyState atm =  "+document.readyState);
    let frameList = locateAdsFrame();
    let divList = locateAdsDiv();
    let newImgTag = document.createElement("img");

    newImgTag.src = "https://raw.githubusercontent.com/bridge-software/AdMemer/master/resources/placeholders/adnoneplaceholder.jpg" 
    
    if (frameList != undefined)
    {
        frameList.forEach(frameElement => {
            //start adFilter (adfilter must filter possible advertisement tags which has been located by functions )
            //start imageScaler (gets images from extension storage and also gets filtered ads locations from adReplacer then scales them as ad image size)
            //call both with await
            //then createNewDomElement
            //then replace
            frameElement.parentNode.replaceChild(newImgTag, frameElement);
        });
    }
    else
    {console.log("Frame List Empty !");}

    if (divList != undefined) {
        
        /*divList.forEach(divElement => {
            //start adFilter (adfilter must filter possible advertisement tags which has been located by functions )
            //start imageScaler (gets images from extension storage then scales them as ad image size)
            //call both with await
            //then createNewDomElement
            //then replace
            divElement.parentNode.replaceChild(newImgTag, divElement);
        });*/
    } 
    else {console.log("Division List Empty !");}

};

/**
 * It will create new dom img 
 */
function createNewDomElement (){

  let newImg = document.createElement("img"); 
  newImg.src = "https://raw.githubusercontent.com/bridge-software/AdMemer/master/resources/placeholders/adnoneplaceholder.jpg"

  // add the newly created element and its content into the DOM 
  let currentDiv = document.getElementById("div1"); 
  document.body.insertBefore(newDiv, currentDiv); 
} 


/**
 * Locate ads in division tags,
 * searches pre-defined names for id's ,classes and links.
 * @returns {Array} array that holds possible ad tags
 */
function locateAdsDiv (){
    let divList = document.body.getElementsByTagName('div');
    //under construct
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
                    " src ==> "+frameList[frameIndex].src+
                    " parent "+frameList[frameIndex].parentNode.tagName);
                    //" child "+ frameList[frameIndex].childNode.tagName);
        
        let innerDoc = frameList[frameIndex].contentDocument //|| frameList[frameIndex].contentWindow.document;
        if(innerDoc != undefined)
        {
            console.log("\n SOURCE OF FRAME "+frameList[frameIndex].src + "\n");
            possibleAdFrames.push(frameList[frameIndex]);

        } 
    }

    return possibleAdFrames;
} 

export { replaceAds };

