const request=require("request");
const cheerio=require("cheerio");
const scoreCardObj=require("./scorecard");
function getAllMatchesLink(html){
    request(html,function(err,response,html){
        if(err){
            console.log("Error: ",err);
        }else{
           getAllLinks(html);
        }
    })
}

function getAllLinks(html){
    let $=cheerio.load(html);
    let scoreCardElems=$(".match-info-link-FIXTURES");
    for(let i=0;i<scoreCardElems.length;i++){
        let link=$(scoreCardElems[i]).attr("href");
        let fullLink="https://www.espncricinfo.com/"+link;
        //console.log(fullLink);
        scoreCardObj.getScoreCard(fullLink);
    }
}

module.exports={
    getAllMatches:getAllMatchesLink
}