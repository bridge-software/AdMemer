'use strict';

// IMPORTS & INITS
const adReplacerURL = chrome.runtime.getURL("/library/adReplacer.js");
//promise to get storage value 
const storagePromise = new Promise(function(resolve, reject) {
    chrome.storage.sync.get(['switchKey'], function(result) {
        console.log('promise:Switch is currently ' + result.switchKey);
        resolve(result.switchKey); 
      });
});
//promise to get stage state
const pageLoadPromise = new Promise(function(resolve, reject) {
    window.addEventListener('load', (event) => {
        console.log('promise:Page is fully loaded');
        resolve(true);
      });
});

// FUNCTIONS
/**
 * Passive [ASYNC]
 * 
 * Main script func
 * ...
 */
async function main()
{
    let checkResult;
    let checkDomLoaded;
    let apiResult;
    const adReplacer = await import(adReplacerURL);
    //apiResult = await getMemeFromApi(10);
    checkResult = await extensionStoreListener();
    checkDomLoaded = await pageLoadListener();

    console.log("checkResult "+checkResult +" checkDomLoaded "+checkDomLoaded);

    if(checkResult == true && checkDomLoaded == true)
    {
        console.log("REPLACER STARTS..");
        await adReplacer.replaceAds(apiResult); 
    }    

    //ADD AN UPDATE LISTENER FOR LATER ADS
}

/**
 * [ASYNC]
 * 
 * Checks the store for user options.
 * Currently it only check on/off switch
 * 
 * @returns {boolean} bool
 */
async function extensionStoreListener()  {
    
    console.log("check store");
    let result = false;

    await storagePromise.then(function(resolveValue) {
        console.log("resolveValue "+resolveValue);
        result = resolveValue;
      });
   
    return result;
    
}

/**
 * [ASYNC]
 * 
 * Checks if the page loaded fully.[Some ads may load after very long time, so dont completely trust in this.]
 * @returns {boolean} bool
 */
async function pageLoadListener(){
    let result = false;
    await pageLoadPromise.then(function(resolveValue) {
        console.log("resolveValue for page loaded"+resolveValue);
        result = resolveValue;
      });
    return result;
}

/**
 * Calls background for meme via message event
 * 
 * @param {number} memeNum requested meme number
 * @returns {Array} a array of meme links
 */
async function getMemeFromApi(memeNum ){

    let result;
    let getMeme = new Promise(function (resolve) {
        chrome.runtime.sendMessage({command: "giveMeme",memeAmount : memeNum},function (response){
            resolve(response.result);})
        });

    await getMeme.then(function(resolveValue){
        console.log("Meme's from api  : " + resolveValue)
        result = resolveValue;
    })

    return result
}

main();

    
  
