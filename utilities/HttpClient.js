
/**
 * Function for Http requests with "GET" method.
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

  export {httpClientGet};