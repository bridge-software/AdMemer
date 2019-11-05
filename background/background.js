
//Rear end of the backend
//We must do connection and image gatherings here
//Also, if we need to communicate with other blockers, we must do it here. 


const HttpClientURL = chrome.runtime.getURL("/utilities/HttpClient.js");
(async () => {
  HttpClientObj = await import(HttpClientURL);
})();

//user decision to block ads
chrome.storage.sync.set({switchKey: true}, function() {
  console.log('Value is set to ' + true);
  

  
});


let HttpClientObj;
let curMemes = []

/**
 *  The function for getting memes via API.
 */
function getMaMeme(){
  
  
  
  HttpClientObj.httpClientGet('https://meme-api.herokuapp.com/gimme', function(response) {
  console.log("GOT THE MEME");
  console.log("THE MEME URL : " + JSON.parse(response).url);
  curMemes.push( JSON.parse(response).url)
  
})

}

/**
 *  Listener for meme requests
 */
chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    


    
    for(let i = 0; i < request.memeAmount; i ++){
      getMaMeme();
      console.log("get ma meme #" + i);
    }
    //this process must be done in some statements
    sendResponse( {result: curMemes});
    
  })
  
  

  //main listener for extension
  chrome.runtime.onInstalled.addListener(function(  ) {
    
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [new chrome.declarativeContent.PageStateMatcher({})],
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }]);
    });
  });
  
  //get images from api here
  //store it to extention storage on browser side