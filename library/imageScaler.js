//gets images from extension storage and also gets filtered ads locations from adReplacer then scales them as ad image size


/**
 *      NOTE TO BBQ MASTER
 *        Example usage of scaleImages in AdReplacer is shown below :
 * 
 *          const imageScalerURL = chrome.runtime.getURL("./library/imageScaler.js");
                .
                .
                .
            const replaceAds = async (memeArray) =>{

            console.log("document.readyState atm =  "+document.readyState);
            const adFilter = await import(adFilterURL);
            const imageScaler = await import(imageScalerURL);  <---------
                .
                .
                .
             //this loop is for test
            filteredFrameList.forEach(frameElement => {
            let newImgTag = document.createElement("img");
                .
                .
                .
             newImgTag.src = memeArray[randomNum];
            
             //!!! WARNING !!!
             //setting attributes for the new Image must be done in AdReplacer since the new image object is created there.

            let newWidth = frameElement.style.width;
            let newHeight = frameElement.style.height;

            newImgTag.setAttribute("style", "width:" + newWidth + ";height:" + newHeight+";"  )

            frameElement.parentNode.replaceChild(newImgTag, frameElement);     


 * 
 * 
 */

const memePromise = new Promise(function (resolve){
    chrome.storage.sync.get(['memes'], function(result) {
        console.log('got memes from storage : ' + result.memes);
        resolve(result.memes)
    });
})

const memeWidthPromise = new Promise(function (resolve){
    chrome.storage.sync.get(['memeWidths'], function(result) {
        console.log('got meme widths from storage : ' + result.memeWidths);
        resolve(result.memeWidths)
    });
})

const memeHeightPromise = new Promise(function (resolve){
    chrome.storage.sync.get(['memeHeights'], function(result) {
        console.log('got meme heights from storage : ' + result.memeHeights);
        resolve(result.memeHeights)
    });
})





/**
 *  This function is the main function for image scaling.
 *  Makes preperations for the ad finding algorithm to execute then scales the result of it after that returns the final product.
 * 
 *  p.s. Currently scaling dimensions are fixed because of testing purposes
 * @param {Berqai's frames or divs} adLocations 
 */
async function scaleImages (adLocations) {
    
    let memes = await memePromise;
    let memeHeights = await memeHeightPromise;
    let memeWidths = await memeWidthPromise;
    
    console.log("MEME HEIGHTS ARE " + memeHeights);
    console.log("MEMES ARE  " + memes);
    
    return new Promise(function (resolve){
        let newElements = []
        let memesIndex = 0;
        adLocations.forEach(element => {
            console.log("NEW ELEMENT FROM BERKAI " + element)
            let result = getStylishElements(element,memesIndex,memes,memeWidths[memesIndex],memeHeights[memesIndex])
            result.src = memes[memesIndex];
            Object.assign(result.style,{
                width  : "300px",
                height : "300px"
            })
            

            console.log("result is : " + result.style.width + "with src" + memes[memesIndex])
            newElements.push(result)
            memesIndex++;
            
        });
        console.log("finished rescaling..." + newElements)
        resolve(newElements)
    })
    
    
}

//                                                  !!!!! WARNING !!!!!  ADNONE !!!!! WARNING !!!!!
//  image scaler is not setting the height and weight of the upper elements !
//  Intendent or forgotten ?

/**
 * 
 * @param {HTMLElement} currentLocation first element which is passed
 * @param {Number} memesIndex 
 * @param {Array} memes 
 * @param {Number} memeWidth 
 * @param {Number} memeHeight 
 */
function getStylishElements(currentLocation,memesIndex,memes,memeWidth,memeHeight){
    //                                                  !!!!! WARNING !!!!!  ADNONE !!!!! WARNING !!!!!     
    //sometimes a elemets comes with a promise pending on it and fucks this func, make this fail safe.
    let hasWidth = false, hasHeight = false; 
    let tempLocation = currentLocation;
    while((!hasWidth || !hasHeight) && tempLocation != undefined){
        console.log("NEW METHOD : " + tempLocation )
        if(tempLocation.getAttribute("style")){
            let currentStyleAttribute = tempLocation.getAttribute("style");
            
            
            if(currentStyleAttribute.includes("width")){
                hasWidth = true;
            }
            if(currentStyleAttribute.includes("height")){
                hasHeight = true;
            }
            
            if(hasHeight && hasWidth){
                Object.assign(tempLocation.style,{
                    width  : "100px",
                    height : "100px"
                })
                console.log("the element : " + tempLocation + "has style object" + " new width is : " + tempLocation.style.width );
                return tempLocation;
            }
        }
        if(tempLocation.parentElement == undefined){
            Object.assign(currentLocation.style,{
                width  : "100px",
                height : "100px"
            })
            return currentLocation;
        }
        tempLocation = tempLocation.parentElement
        
    }
    
    return tempLocation;

    //TODO: I will clean the below unreachable code later because I have implemented some image scaling algorithms down below. DOKANMA!!!!
    //      p.s. sorry for the mess, lol
    if(currentStyleAttribute.includes("width")){
        hasWidth = true;
    }
    if(currentStyleAttribute.includes("height")){
        hasHeight = true;
    }
    
    if(currentLocation == null || currentLocation == undefined)
    return;
    if(currentLocation.getAttribute("style")){
        
        
        let currentStyleAttribute = currentLocation.getAttribute("style");
        console.log("current Attribute for this element is : " + currentStyleAttribute)
        
        let hasWidth = false, hasHeight = false;
        
        if(currentStyleAttribute.includes("width")){
            hasWidth = true;
        }
        if(currentStyleAttribute.includes("height")){
            hasHeight = true;
        }
        
        if(!hasHeight || !hasWidth){
            if(currentLocation.parentElement != undefined)
            return getStylishElements(currentLocation.parentElement) 
            
        }
        
        let newWidth = 0, newHeight = 0;
        
        
        //let tempMemeImage = new Image()
        //tempMemeImage.src = memes[memesIndex];
        console.log('CURRENT MEME : ' + memes[memesIndex])
        //tempMemeImage.onload = function() { alert("Height: " + this.height); }
        console.log("TEMP MEME IMAGE DIMENSIONS : {" + memeWidth + " , " +memeHeight + "}" )
        
        
        
        // if(currentStyleAttribute.includes("width") && currentStyleAttribute.includes("height")){
        //     console.log("this element has width")
        
        //     //The ad is a horizontal banner
        //     if(currentLocation.style.width > currentLocation.style.height * 2){
        //         newWidth = (memeWidth + currentLocation.style.width) / 3
        //         newHeight = memeHeight /2;
        //     }
        
        //     //The ad is a vertical banner
        //     else if(currentLocation.style.height > currentLocation.style.width * 2){
        //         newHeight = (memeHeight + currentLocation.style.height) / 2
        //         newWidth = memeWidth;
        //     }   
        
        //     //The ad is a box-shaped banner
        //     else{
        //         newHeight = (memeHeight + currentLocation.style.height) /2
        //         newWidth = (memeWidth + currentLocation.style.width) /2
        //     }
        
        //     //     width = memes[memesIndex].style.width + currentLocation.style
        // }else{
        //     newHeight = (memeHeight / 2)
        //     newWidth = (memeWidth / 2)
        // }
        
        // let tempWidthVal = newWidth;
        // let tempHeightVal = newHeight;
        
        // let newWidthStr = "'" + newWidth + "px'"
        // let newHeightStr = "'" + newHeight + "px'"
        // console.log("new dimensions are : " + newWidth + " " + newHeight) 
        
        // if(tempWidthVal != 0 && tempHeightVal != 0){
        //     console.log("ADNAN : " + 1)
        //     Object.assign(currentLocation.style,{
        //         width  : newWidthStr,
        //         height : newHeightStr
        //     })
        // }
        
        // else if(tempWidthVal == 0 && tempHeightVal != 0){
        //     console.log("ADNAN : " + 2)
        
        //     Object.assign(currentLocation.style,{
        //         height : newHeightStr
        //     })  
        // }
        
        // else if(tempWidthVal != 0 && tempHeightVal == 0){
        //     console.log("ADNAN : " + 3)
        
        //     Object.assign(currentLocation.style,{
        //         width  : newWidthStr,
        //     })        
        // }
        
        // else{
        //     console.log("ADNAN : " + 4)
        
        //     Object.assign(currentLocation.style,{
        //         width  : "500px",
        //         height : "500px"
        //     })              
        // }
        //currentLocation.style.width = "100px";
        // if(currentStyleAttribute.includes("width")){
        //     console.log("this element has width")
        //     width = 100;
        // }
        // if(currentStyleAttribute.includes("height")){
        //     console.log("this element has height")
        // }
        
        Object.assign(currentLocation.style,{
            width  : "400px",
            height : "400px"
        })
        console.log("the element : " + currentLocation + "has style object" + " new width is : " + currentLocation.style.width );
        return currentLocation;
    }
    else{
        console.log("the element does not have style going to parent");
        return getStylishElements(currentLocation.parentElement)
    }
}


export {scaleImages}


//p.s. Please contribute to this project! We are dying out here.