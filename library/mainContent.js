'use strict';

// IMPORTS & INITS
const adReplacerURL = chrome.runtime.getURL("/library/adReplacer.js");
//promise to get storage value 
const storagePromise = new Promise(function(resolve, reject) {
    chrome.storage.sync.get(['switchKey'], function(result) {
        console.log('Value currently is ' + result.switchKey);
        resolve(result.switchKey); 
      });
});
//promise to get stage state
const pageLoadPromise = new Promise(function(resolve, reject) {
    window.addEventListener('load', (event) => {
        console.log('page is fully loaded');
        resolve(true);
      });
});

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
    let apiResult

    initialization();
    checkResult = await extensionStoreListener();
    checkDomLoaded = await pageLoadListener();

    console.log("checkResult "+checkResult +" checkDomLoaded "+checkDomLoaded);

    if(checkResult == true && checkDomLoaded == true)
    {
        

        //self trigger promise
        (async () => {
            const adReplacer = await import(adReplacerURL);
            console.log("REPLACER STARTS..");
            //if we cant use store, get images and pass it to replacer
            adReplacer.replaceAds(); 
            
        })();
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
 * Init func for requests
 * 
 */
async function initialization(){

    //!!!!! WARNING !!!!! ADNAN SEND API CALL MESSAGE HERE !!!!! WARNING !!!!!
    
    //if we cant store it to backgorund we must pass it through a event
    //and that events listener must be defined here
    //apiResult = message.response
}

main();

    
  
