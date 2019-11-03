let removeAds = document.getElementById('removeAds');

removeAds.onclick = function(element) {

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      console.log("TAB NAME "+tabs[0].title);
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {command: "replaceAds", replace: true }, function(response) {
         
        });

      });

    });
};