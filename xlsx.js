const fs=require("fs");
const xlsx=require("xlsx");
const data=require("");

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


/*****************Write********************/
// //To create new workbook
// let newWb=xlsx.utils.book_new();

// //To convert json data to excel format
// let newWs=xlsx.utils.json_to_sheet(json);

// //To add the sheet to workbook with what name has to be given to the sheet
// xlsx.utils.book_append_sheet(newWb,newWs,name);

// //To write the workbook in the given filePath
// xlsx.writeFile(newWb,filePath);

/***************Read ******************/

// //To get the workbook
// let wb=xlsx.readFile(filePath);

// //To get the sheet with given name from the workbook
// let excelData=wb.Sheets[name];

// //To convert the data to json format
// let ans=xlsx.utils.sheet_to_json(excelData);
// return ans;
