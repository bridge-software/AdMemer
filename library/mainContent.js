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

    //PAGE FULLY LOADED
    window.addEventListener('load', (event) => {
        console.log('\npromise:Page is fully loaded\n');
        resolve(true);
      });
    
     /*document.addEventListener('readystatechange', (event) => {
        console.log(`readystate: ${document.readyState}\n`);
        if (document.readyState == "complete")
        {
            console.log("document frames at ready state complete");
            //console.log(document.body.getElementsByTagName('iframe'));
            resolve(true);       
           
        }
        if (document.readyState == "interactive")
        {
            
           chrome.runtime.sendMessage({command: "startBlocker"}, function(response) {
                console.log(response.result);});
            console.log("document frames at ready state interactive");
            //console.log(document.body.getElementsByTagName('iframe'));
            //resolve(true);

        }
    });*/


    //ONLY DOM ELEMENTS LOADED
    /*window.addEventListener('DOMContentLoaded', (event) => {
        console.log('DOM fully loaded and parsed');
        console.log("document frames at DOMContentLoaded");
        console.log(document.body.getElementsByTagName('iframe'));
        resolve(true);
    });*/

      /*ORDER OF Document/WINDOW load events
        1 readystate: interactive
        2 DOMContentLoaded
        3 readystate: complete
        4 load
      */
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
    apiResult = await getMemeFromApi(10);
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
 * [ASYNC]
 * 
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

    
  
