'use strict';
/**
 * Function for Http requests with "GET" method.
 * 
 *                              ADNAN TAKE HTTP CALL IN A PROMISE MAN WTF IS THIS!
 * 
 */
const httpClientGet = (aUrl, aCallback) => {
   
      var anHttpRequest = new XMLHttpRequest();
      anHttpRequest.onreadystatechange = function() { 
        if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
        aCallback(anHttpRequest.responseText);
      }
      
      anHttpRequest.open( "GET", aUrl, false );            
      anHttpRequest.send( null );
    
  }

/**
 * Get local resource files via xml http requests.
 * @param {String} urlToFile url with respect to manifest.json location
 * @return {File} fetched file.
 */
const xhrGetFileLocal = async (urlToFile) =>{

  const httpCall = new Promise(function(resolve, reject) {
    let httpRequest = new XMLHttpRequest();
    httpRequest.open("GET", chrome.extension.getURL(urlToFile), true);
    httpRequest.send();
    httpRequest.onload = function() { 
      if (httpRequest.response != undefined)
      {
        console.log("Response has been granted,o mighty melkor.")
        resolve(httpRequest.response)
      }
      else
      {
        console.log("httpRequest.readyState = "+httpRequest.readyState+" httpRequest.status "+httpRequest.status);
        reject("REQUEST REJECTED")
      }
    }
  });
  
  let file;
  await httpCall.then( ( resolve )=>{
    console.log("Resolved");
    file = resolve;
  });
  return file;
}

export {httpClientGet, xhrGetFileLocal};