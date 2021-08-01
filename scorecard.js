//const url="https://www.espncricinfo.com//series/ipl-2020-21-1210595/mumbai-indians-vs-chennai-super-kings-1st-match-1216492/full-scorecard";
const request=require("request");
const cheerio=require("cheerio");
const path=require("path");
const fs=require("fs");
const xlsx=require("xlsx");
function getScoreCardLink(url){
    request(url,cb);
}

function cb(err,response,html){
    if(err){
        console.log("Error: ",err);
    }else{
        extractMatchDetails(html);
    }
}

function extractMatchDetails(html){
    let $=cheerio.load(html);
    // .match-info.match-info-MATCH.match-info-MATCH-half-width
    //result-> .status-text
    let descElement=$(".event .description");
    let result=$(".event .status-text").text();
    let stringArr=descElement.text().split(",");
    let venue=stringArr[1].trim();
    let date=stringArr[2].trim();
    // console.log(venue);
    // console.log(date);
    let innings=$(".card.content-block.match-scorecard-table .Collapsible");
    let htmlString="";
    //console.log(innings.length);
    for(let i=0;i<innings.length;i++){
       // htmlString+=$(innings[i]).html();
       let teamName=$(innings[i]).find("h5").text();
       let opponentIndex= i==0 ? 1:0;
       teamName=teamName.split("INNINGS")[0].trim();
       let opponentName=$(innings[opponentIndex]).find("h5").text();
       opponentName=opponentName.split("INNINGS")[0].trim();
       //console.log(`${venue} | ${date} | ${teamName} | ${opponentName} | ${result}`);
       let cinnings=$(innings[i]);
       let allRows=cinnings.find(".table.batsman tbody tr");
       for(let j=0;j<allRows.length;j++){
           let allCols=$(allRows[j]).find("td");
           let isPlayer=$(allCols[0]).hasClass("batsman-cell");
           if(isPlayer){
               //console.log(allCols.text());
               let playerName=$(allCols[0]).text().trim();
               let playerRuns=$(allCols[2]).text().trim();
               let playerBalls=$(allCols[3]).text().trim();
               let playerFours=$(allCols[5]).text().trim();
               let playerSixes=$(allCols[6]).text().trim();
               let playerStrikeRate=$(allCols[7]).text().trim();
               console.log(`${playerName} ${playerRuns} ${playerBalls} ${playerFours} ${playerSixes} ${playerStrikeRate}`);
               processPlayer(teamName,playerName,venue,date,opponentName,result,playerRuns,playerBalls,playerFours,playerSixes,playerStrikeRate);
           }
       }
    }
    //console.log(htmlString);
}

function processPlayer(teamName,playerName,venue,date,opponentName,result,playerRuns,playerBalls,playerFours,playerSixes,playerStrikeRate){
    let teamPath=path.join(__dirname,"ipl",teamName);
    dirCreator(teamPath);
    let playerPath=path.join(teamPath,playerName+".xlsx");
    let content=excelReader(playerPath,playerName);
    let playerObj={
        "Team Name":teamName,
        "Player Name":playerName,
        "Venue":venue,
        "Date":date,
        "Opponent Team":opponentName,
        "Result":result,
        "Runs Scored":playerRuns,
        "Balls Played":playerBalls,
        "Fours":playerFours,
        "Sixes":playerSixes,
        "Strike Rate":playerStrikeRate
    }
    content.push(playerObj);
    excelWriter(playerPath,content,playerName);
}

function dirCreator(filePath){
    if(fs.existsSync(filePath)==false){
        fs.mkdirSync(filePath);
    }
}

function excelWriter(filePath,json,sheetName){
    let newWb=xlsx.utils.book_new();
    let newWs=xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newWb,newWs,sheetName);
    xlsx.writeFile(newWb,filePath);
}

function excelReader(filePath,sheetName){
    if(fs.existsSync(filePath)==false){
        return [];
    }
    let wb=xlsx.readFile(filePath);
    let excelData=wb.Sheets[sheetName];
    let ans=xlsx.utils.sheet_to_json(excelData);
    return ans;
}

module.exports={
    getScoreCard:getScoreCardLink
}