'use strict';

// IMPORTS 
const adReplacerURL = chrome.runtime.getURL("/library/adReplacer.js");


async function main()
{
    let checkResult;
    let isDomLoaded;

    console.log("contenScript");
    checkResult = await checkExtensionScript();
    console.log("checkResult "+checkResult);
    if(checkResult == true)
    {
        //self trigger promise
        (async () => {
            const adReplacer = await import(adReplacerURL);
            console.log("REPLACER STARTS..");
            adReplacer.replaceAds(); 
            
        })();
    }    
}


/**
 * Starts Listeners for these content script;
 * 
 * 1) chrome.runtime.onMessage, 
 * 
 * 2) 
 * 
 */

function initListeners() {
    
    document.addEventListener('DOMContentLoaded', fireContentLoadedEvent, false);

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) =>
    {
        console.log("INCOMING COMMAND = "+request.command);
        console.log(sender.tab ?
                    "from a content script:" + sender.tab.url :
                    "from the extension");
        if (request.command == "replaceAds")
        {
            console.log("replace bool "+ request.replace);
            if(request.replace == true)
            {}
            else
            {console.log(" replace is false ");}
            sendResponse({farewell: "Hi extension im contentScript, ur request to replace ads has been granted."});
        }
        else
        {console.log("what is this?");}
    });
}


async function checkExtensionScript()  {
    
    console.log("check intit");
    let result = false;

    //boom shaka laka
    const storagePromise = new Promise(function(resolve, reject) {
        chrome.storage.sync.get(['switchKey'], function(result) {
            console.log('Value currently is ' + result.switchKey);
            resolve(result.switchKey); 
          });
      });
      
     await storagePromise.then(function(resolveValue) {
        console.log("resolveValue "+resolveValue);
        result = resolveValue;
      });
   
    return result;
    
    /*
    chrome.runtime.sendMessage({check: "Do we block ?"}, function(response) {
        result = response.result;
        console.log(response.result);
    })*/
    
}


function fireContentLoadedEvent () {
    console.log ("DOM Content Loaded !");
    const checkResult = checkExtensionScript();

    if(checkResult)
    {
        //self trigger promise
        (async () => {
            const adReplacer = await import(adReplacerURL);
            //adReplacer.replaceAds();
        })();
    }
}

initListeners();
main();

    
  
