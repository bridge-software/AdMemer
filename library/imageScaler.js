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
                    let memeDimensions = {
                        "height" : parseInt(memeHeights[memesIndex]),
                        "width" : parseInt(memeWidths[memesIndex])
                    }
                    let result = getStylishElements(element,memesIndex,memes,memeDimensions)
                    result.src = memes[memesIndex];
                    // Object.assign(result.style,{
                    //     width  : "300px",
                    //     height : "300px"
                    // })
                    
                    if(result == undefined)
                        console.log("ADNAN memeIndex : "  + memesIndex + " element : " + element + " is undefined")
                    
                    //console.log("result is : " + result.style.width + "with src" + memes[memesIndex])
                    newElements.push(result)
                    memesIndex++;
                    
                });
                console.log("finished rescaling..." + newElements)
                resolve(newElements)
            })
            
            
        }
        
        //   !!!!! WARNING !!!!!  ADDNONE !!!!! WARNING !!!!!
        //  image scaler is not setting the height and weight of the upper elements !
        //  Intendent or forgotten ?
        
        
        function getApproximateDimensions(currentDimensions, memeDimensions ){
            console.log("ADNAN MEME Width : " + memeDimensions.width)
            let newWidth = (currentDimensions.width + (memeDimensions.width)) /2
            let newHeight = (currentDimensions.height + memeDimensions.height )/2
            
            console.log("ADNAN : newWidth : " + newWidth + " newHeight : " + newHeight)
            
            return {
                "width" : newWidth + "px",
                "height" : newHeight + "px"
            }
            
        }
        
        
        /**
        * 
        * @param {HTMLElement} currentLocation first element which is passed
        * @param {Number} memesIndex 
        * @param {Array} memes 
        * @param {"height" : Number, "width" : Number} memeDimensions 
        */
        function getStylishElements(currentLocation,memesIndex,memes,memeDimensions){
            //                                                  !!!!! WARNING !!!!!  ADNONE !!!!! WARNING !!!!!     
            //sometimes a elemets comes with a promise pending on it and fucks this func, make this fail safe.
            let hasWidth = false, hasHeight = false; 
            let tempLocation = currentLocation;
            
            while((!hasWidth || !hasHeight) && tempLocation != undefined){
                console.log("ADNAN memIndex : " + memesIndex + " Object : " + tempLocation)
                if(tempLocation == undefined || tempLocation == null){
                    console.log("ADNAN tempLocation undefined oldu")
                    return tempLocation
                    
                }
                console.log("NEW METHOD : " + tempLocation )
                try{
                    if(tempLocation.hasAttribute("style")){
                        let currentStyleAttribute = tempLocation.getAttribute("style");
                        
                        
                        if(currentStyleAttribute.includes("width")){
                            hasWidth = true;
                        }
                        if(currentStyleAttribute.includes("height")){
                            hasHeight = true;
                        }
                        
                        
                        let tempLocationDimensions;
                        if(hasHeight && hasWidth){
                            
                            tempLocationDimensions = {
                                "height":parseInt(tempLocation.style.height.split('p')[0]),
                                "width":parseInt(tempLocation.style.width.split('p')[0])
                            };
                        }
                        else if(hasHeight){
                            tempLocationDimensions = {
                                "height":parseInt(tempLocation.style.height.split('p')[0]),
                                "width":memeDimensions.width
                            };
                        }else if(hasWidth){
                            tempLocationDimensions = {
                                "height":memeDimensions.height,
                                "width":parseInt(tempLocation.style.width.split('p')[0])
                            };
                        }else{
                            tempLocationDimensions = {
                                "height":memeDimensions.height,
                                "width":memeDimensions.width
                            };
                        }
                        
                        //   console.log("ADNAN temp : " + tempLocationDimensions.height)
                        
                        let resultDimensions = getApproximateDimensions(tempLocationDimensions,memeDimensions)
                        
                        
                        
                        Object.assign(tempLocation.style,{
                            width  : resultDimensions.width,
                            height : resultDimensions.height
                        })
                        // console.log("the element : " + tempLocation + "has style object" + " new width is : " + tempLocation.style.width );
                        return tempLocation;
                        
                    }
                }catch(err){
                    console.log("ADNAN ERROR : " + err + " tempLocation : " + tempLocation)
                    
                    console.log(tempLocation)
                    return tempLocation
                }
                console.log("ADNAN " + tempLocation.parentElement)

                if(tempLocation.parentElement == undefined || tempLocation.parentElement == null){
                    console.log("ADNAN IMPORTANT entered undefined state")
                    let currentLocationDimensions = {
                        "height":parseInt(currentLocation.style.height.split('p')[0]),
                        "width":parseInt(currentLocation.style.width.split('p')[0])
                    };
                    
                    let result = getApproximateDimensions(currentLocationDimensions,memeDimensions)
                    
                    Object.assign(currentLocation.style,{
                        width  : result.width,
                        height : result.height
                    })
                    return currentLocation;
                }
                
                const newLoc = new Promise ( function(resolve) {
                    return new Promise(function (resolve){
                        resolve(tempLocation.parentElement)
                    })
                }).then(result => {
                    tempLocation = result;
                    console.log("ADNAN THE REULST IS " + result)
                    resolve(tempLocation)
                })
                
                tempLocation = newLoc
                
                
            }
            
            return tempLocation;
            
           
        }
        
        
        export {scaleImages}
        
        
        //p.s. Please contribute to this project! We are dying out here.