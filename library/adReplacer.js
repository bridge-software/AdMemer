'use strict';

/**
 * Locates advertisement and then replaces it with memes
 * 
 * Memes must be in a reachable extension store or they must be passed from main
 * 
 */
const replaceAds = () =>{

    let frameList = document.body.getElementsByTagName('iframe');
    console.log("document.readyState atm =  "+document.readyState);
     
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
            let newImg = document.createElement("img"); 
            newImg.src = "https://raw.githubusercontent.com/bridge-software/AdMemer/master/resources/placeholders/adnoneplaceholder.jpg"
            frameList[frameIndex].parentNode.replaceChild(newImg, frameList[frameIndex]); 
            
            //start adFilter (adfilter must filter advertisement images from website images so only ad images gets banned)
            //start imageScaler (gets images from extension storage then scales them as ad image size)
            //call both with await

        } 
    }
};


function createNewDomElement (){

  let newImg = document.createElement("img"); 
  newImg.src = "https://raw.githubusercontent.com/bridge-software/AdMemer/master/resources/placeholders/adnoneplaceholder.jpg"

  // add the newly created element and its content into the DOM 
  let currentDiv = document.getElementById("div1"); 
  document.body.insertBefore(newDiv, currentDiv); 
} 

export { replaceAds };

