
/**
 * Locates advertisement and replaces it
 * 
 */
const replaceAds = () =>{

    const subNavigation = document.getElementById("sub-navigation");
    
    let href = document.body.getElementsByTagName('*');
    let frameList = document.body.getElementsByTagName('iframe');

    for(let frameIndex = 0; frameIndex < frameList.length; frameIndex++)
    {
        console.log("\niframe "+ frameIndex +
                    " id ==> "+ frameList[frameIndex].id+
                    " has attribute src? ==> "+frameList[frameIndex].hasAttribute("src"));
        

        let innerDoc = frameList[frameIndex].contentDocument //|| frameList[frameIndex].contentWindow.document;
        let imageList;
        if(innerDoc != undefined)
        {
            imageList = innerDoc.images;
            
            //start adFilter (adfilter must filter advertisement images from website images so only ad images gets banned)
            //start imageScaler (gets images from extension storage then scales them as ad image size)
            
            for(let imgIndex=0; imgIndex < imageList.length;imgIndex++)
            {
                console.log("\nIMAGE "+ imgIndex +" id ==> "+ imageList[imgIndex].id+" src ==>"+imageList[imgIndex].src);
                
                //replace the meme to ad image
                //changing only the src of an image is not a solution
                //we must entirely delete that div and replace a new, which constructed by us.
                if(imgIndex % 2 == 0)
                {
                    imageList[imgIndex].src = "https://raw.githubusercontent.com/bridge-software/AdMemer/master/placeholders/adnoneplaceholder.jpg"
                }
                else{
                    imageList[imgIndex].src = "https://raw.githubusercontent.com/bridge-software/AdMemer/master/placeholders/placeholder.jpeg"
                }

            }
            innerDoc = undefined;
            imageList = undefined;
        }
        
    }
    
    

};

export { replaceAds };

