
//Rear end of the backend
//We must do connection and image gatherings here
//Also, if we need to communicate with other blockers, we must do it here. 

const HttpClientURL = chrome.runtime.getURL("/utilities/httpClient.js");

(async () => {
  HttpClientObj = await import(HttpClientURL);
})();



let HttpClientObj;
let curMemes = []

/**
*  The function for getting memes via API.
*/
function getMaMeme(memeAmount){
  
  console.log("memeAmount " + memeAmount)
  
  HttpClientObj.httpClientGet('https://ad-memer-web-scraper.herokuapp.com/getMemes/' + memeAmount , function(response) {
  console.log("GOT THE MEME RAW " + response);
  console.log("THE MEME URL : " + JSON.parse(response).memes[0]);
  
  
  curMemes = JSON.parse(response).memes
  chrome.storage.sync.set({memes:curMemes}, function(){
    console.log('Memes are saved to storage')
  })
  
  chrome.storage.sync.set({memeWidths:JSON.parse(response).width}, function(){
    console.log('MemeWidths are saved to storage' + JSON.parse(response).width)
  })

  chrome.storage.sync.set({memeHeights:JSON.parse(response).height}, function(){
    console.log('MemeHeights are saved to storage' + JSON.parse(response).height)
  })

})

}

/**
*  Listener for meme requests
*/
chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    
    if(request.command === "giveMeme"){
      getMaMeme(request.memeAmount);
      
      sendResponse( {result: curMemes});
    }else{
      sendResponse( {result: true});
    }
  })
  
  
  
  //main listener for extension
  chrome.runtime.onInstalled.addListener(function(  ) {
    //user decision to block ads
    chrome.storage.sync.set({switchKey: true}, function() {
      console.log('Value is set to ' + true);
    });
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [new chrome.declarativeContent.PageStateMatcher({})],
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }]);
    });
  });
  
  
  //get images from api here
  //store it to extention storage on browser side