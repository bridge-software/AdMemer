//TODO: Reorganize this project ASAP!


const cheerio = require('cheerio');
const request = require('request');
const express = require('express')

const app = express();


const admin = require('firebase-admin');

const maxSeed = 10000;

//TODO: Change this variable according to official bridge software google account.
const serviceAccount = {

}

//!!! WARNING !!! Can be retrieved from an external source like a github document
const urlList = [
    'https://www.reddit.com/r/dankmemes/',
    'https://www.reddit.com/r/MemeEconomy/',
    'https://www.reddit.com/r/meme/',
    'https://www.reddit.com/r/dank_meme/'
    
];

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}...`));

//Request for web scraping
app.get('/',(req,res) => {
    doAllMemeSending(res)
})

//Request for memes
app.get('/getMemes/:memeAmount',(req,res) => {
    sendMemesToClient(res,req.params.memeAmount);
    
})




/**
 * 
 *  Handles distributing memes to the world!
 * 
 * @param {res Object} response 
 * @param {Integer} memeAmount 
 */
function sendMemesToClient(response,memeAmount){
    
    
    let MemeList = []
    let startIndex = Math.floor(Math.random() * Math.floor(maxSeed))
    let hasEnough = true;
    

    console.log('start Index ' + startIndex )
    db.collection('memes')
    .where('seed', '>', startIndex)
    .limit(parseInt(memeAmount))
    .get()
    .then(result => {
        result.forEach(documentSnapshot => {
            console.log("seed Value : "  + documentSnapshot._fieldsProto.seed.integerValue)
            
            MemeList.push(documentSnapshot._fieldsProto.source.stringValue)
        })
        
    }).then(() => {
        console.log(MemeList)
        if(MemeList.length < parseInt(memeAmount)){
            hasEnough = false;
            db.collection('memes')
            .limit(parseInt(memeAmount) - MemeList.length )
            .get()
            .then(result => {
                result.forEach(documentSnapshot => {
                    //console.log("seed Value : "  + documentSnapshot._fieldsProto.seed.integerValue)
                    
                    MemeList.push(documentSnapshot._fieldsProto.source.stringValue)
                })
            }).then( () => response.send(MemeList))
            
        }
    }).then(() =>{
        if(hasEnough)
            response.send(MemeList)

    });
    
    
}




let MemeList = []
/**
 * This function inserts new memes into the firebase firestore!
 * @param {res Object} response 
 */
async function doAllMemeSending(response){
    for(let i = 0 ; i < urlList.length; i++){
        
        let result = await getDankMemes(urlList[i])
        MemeList.push(result)
        
        result.forEach(element => {
            
            let collectionRef = db.collection('memes')
            
            let memeExists = false;
            
            collectionRef.where('source', '==', element).get().then(
                querySnapshot => {
                    if(querySnapshot.size != 0){
                        console.log('This meme already exists in the database! : '+ element);
                        
                        memeExists = true;
                        
                    }
                }
                ).then(() => {
                    let docRef = db.collection('memes').doc();
                    
                    console.log("meme Exists : " + memeExists)
                    if(!memeExists){
                        docRef.set({
                            nsfw: false,
                            source: element,
                            seed : Math.floor(Math.random() * Math.floor(maxSeed))
                        })
                        .catch(err => {console.log(err)})
                    }
                })
                
                
                
                
                
            })
            
        }
        
        
        response.send(MemeList);
    }
    
    
    /**
     * This function scrapes the given reddit URL.
     * @param {string} URL 
     */
    async function getDankMemes(URL){
        
        let returnVal;
        const memePromise = new Promise(
            function(resolve,reject){
                request(URL, function(err, resp, html) {
                    //If there is no error
                    if (!err){
                        console.log("started loading from cheer.io")
                        //The URL Data
                        const $ = cheerio.load(html);
                        console.log("finished loading from cheer.io")
                        //Save embeded urls
                        let returnInfo = [];
                        
                        
                        //Treverse the webpage and select the media elements
                        $('.media-element').each(function(i, element){
                            let temp = $(this).attr('src'); //Create a reference for the image
                            if(temp != null && temp != undefined)
                            returnInfo.push(temp); //Add the URL address to the return info array
                            
                        }); 
                        console.log("finished searching for media-element")
                        //Generate a random number from the length of the returned image urls
                        let randomNum = Math.floor(Math.random() * returnInfo.length);
                        
                        //Try to output the url, if it doesn't exist or there is a problem it will log it out for us
                        try {
                            //Output the url for the image you can embed this somewhere and it will show it
                            console.log(returnInfo[randomNum]);
                            console.log("returned : " + returnInfo[randomNum])
                            resolve(returnInfo)
                            //returnVal =  returnInfo[randomNum];
                        } catch(e) {
                            //Output the error
                            console.log("Error in the output process: " + e);
                        }
                    } else {
                        //There was an error with our request
                        console.log("YARRA YEDIK")
                        console.log("Error in webscrape process: " + err);
                    }
                    
                })});
                
                
                
                await memePromise.then(function(resolveVal){
                    returnVal = resolveVal;
                })
                
                return returnVal;
            }
            
            