const url="https://www.espncricinfo.com/series/ipl-2020-21-1210595";
const fs=require("fs");
const path=require("path");
const request=require("request");
const cheerio=require("cheerio");
const AllMatchesObj=require("./allMatches");
const { fstat } = require("fs");

const iplPath=path.join(__dirname,"ipl");
dirCreator(iplPath);
request(url,cb);
function cb(err,response,html){
    if(err){
        console.log("Error: ",err);
    }else{
        extractLink(html);
    }
}
function extractLink(html){
    let $=cheerio.load(html);
    let link="series/ipl-2020-21-1210595/match-results";
    let fullLink="https://www.espncricinfo.com/"+link;
    AllMatchesObj.getAllMatches(fullLink);
}

function dirCreator(filePath){
    if(fs.existsSync(filePath)==false){
        fs.mkdirSync(filePath);
    }
}

