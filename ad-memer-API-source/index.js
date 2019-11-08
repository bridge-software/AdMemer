//TODO: Reorganize this project ASAP!


const cheerio = require('cheerio');
const request = require('request');
const express = require('express')

const app = express();


const admin = require('firebase-admin');

const maxSeed = 10000;

//TODO: Change this variable according to official bridge software google account.
const serviceAccount = {
    "type": "service_account",
    "project_id": "firebase-functions-deneme",
    "private_key_id": "d6194ab807c3230dfcedea3b346fb3bbc7515227",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCSBtToPnazprCQ\n/kUkPK3Mo68q1qgcp8eu/pBuhgFOCSfhXZnLQv3qSmZh8TfBleBgK8LP5cJfNiOC\np+XIVnzJ4TqsLNu5Dj3p1OIqGcKA7elcgXX/7uFYoapf8puylG4yDDPBe8rZk9gO\nW0KsiBnp0HMJltw+yXf7SsMUyGJgHHc7Wt3tiA00tmJAv/vAa2//ZSAPcza7yntd\np6T+G7EzyQLA+oJG80aKANM2Nynu7gRfcgAQGgowgplEegmbbsecHoELHsoq4ni/\n99Qc0SpGBLwmLKq5RbCQJXCsdRIRCxjPLIKittj4KsHeR6xVDkVcxo1focdYVKlf\nr1h8UQhtAgMBAAECggEAEDIzcroxhosiQe//HDNMtYn2wjdtDZdAVbTvW7V/jI0F\nwCsWWo3eGsUmEOPlDWgXAE5U56PHSLHOWM36yvBoxn1gJBDqTTP6raY1Gs/2RkAy\nUKvH5Ns1DD8LZg6YXUNgQNXLTGueBpQtc6jZ6XKY/oQRAPXGDNgMojGwbGwt7mne\n4WIq1MMsp1Hem1vVuaBZl0fJM90rPyngKqvpXREbvpffDjI/KwDE3ezGgfmpbxY3\nTXsyvSS9K0elG/igf/qldfka758JCUz+GOriduWPUrdPG9u+i5dzOASzY7BX0JEt\n2HFW/3E43dWzSKlMaQScPO92UzkFAVk6mfmUxJYzswKBgQDMrpRZw6+yMVQnLx7r\nre0z1VFTy3Ja/M0Ve4yLugezMlXemRzIWcgbIOwFmZGPZOBnKRYLyAvEE0XpFr+h\nX3fwhxiip+W/tHA12dH7Ygrk+LlhwiWb7mk19Dsf45YrSAhh0ctrxZw55JxQNHa0\nntbwuYNlVxsPFHTeDQqYyGEMowKBgQC2o31seDH2C/zwIfkGWOqbhs0aPyRNYTWe\nfvHEpEMEGmj1LuGy9L+vqwYH/vXRXENtMjuRkA49SQzM4j7uTYWDjO9X9IHqNT5U\nLtKU5l/ku917d5LGPdJWMyFaqVv4Kzr34E+xe22xGb8ow+MXUL/4g+2YQG4O/Ycs\ncYGmi3pXrwKBgBg8U7SNRzCCRsSc/7xIS93nVEnnvRKo/F+e0XV6AY9mVmSVHKNc\nfiU4MLo5BNNFzoxogQPEHCCLZ6vB1c71zu3cET6xQrMAWokF0adCZKfYC5tXsbxU\n7oBE+vs7p3xYeyWaAcwxCd6RAzE8BRI9/JVkYfqN5dZTRcNFKAwPLe6hAoGBAJ+H\nFlrUce9UcU7encGpkOLgT+6JEJB2RHt4rnzwbYj7+ImQtZu2pGgwnkgFr3l7eXm7\n0sRGa+mkEQY06HsGQ4Swaa8N5xxH/XVSoKVmxIPqhH7/5rg576tTZeLm42pVeGBj\nEbkY8qsqrgpRb95BrizIL5Q5UujNEnEDhBeQ5QAJAoGBAJFhwRyj56QP9opkP1ZL\n1tWoTEXAPBuzz2kM9zuRaPQf7EDisJtYUPx94uGNoecLnk7qVbKb753J8jcL2F8C\nLhgz14WAd+X/77buDnAeu1fgVpL08/oGfzVNMvDsqO9VZ9vwywVFxvYdSKY2JIdg\n5RYyaAa/v6cIN+CdNOgmkOAS\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-7gsng@firebase-functions-deneme.iam.gserviceaccount.com",
    "client_id": "110524752690207056065",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-7gsng%40firebase-functions-deneme.iam.gserviceaccount.com"
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
            
            