import { inbox } from "file-transfer";
import * as fs from "fs";

let srcStorage = "http://192.168.1.19/file-storage-local/index.php";
console.log("im here");
let queueFiles = [];

const upload = (fileContents, fileName) => {
  // console.log(fileName);
  let flag = true;
  let newFile = new File([fileContents], fileName);
  const formData = new FormData();
  formData.append('file', newFile);

  fetch(srcStorage, { // Your POST endpoint
    method: 'POST',
    body: formData // This is your file object
  })
  .then(
    success => { // Handle the success response object
      console.log("Succ" + success)
      flag = true;
     } 
  ).catch(
    error => { // Handle the error response object
      console.log("Err" + error)
      flag = false;
    }
  );
  return flag;
};

const now = () => {
  let actDate = new Date();
  let dateString = actDate.getFullYear() + "-" + (actDate.getMonth()+1) + "-" + actDate.getDate() + "_" + actDate.getHours() + "-" + actDate.getMinutes();
  if(actDate.getMinutes() == 0) {
    dateString += "0";
  }
  return dateString;
}

async function processAllFiles() {
    let file;
    while ((file = await inbox.pop())) {
      const payload = await file.text();
      let timeNow = new Date()
      let fileName = now();
      let status = upload(payload, fileName);
      
      if (!status) {
        if (queueFiles.length > 10) queueFiles.shift();
        queueFiles.push([payload, fileName]);
      } else {
        while (queueFiles != [] || !status) {
          let [value, name] = queueFiles.shift();
          status = upload(value, name);
        }
      }
    }
}
  
  inbox.addEventListener("newfile", processAllFiles);
  
  processAllFiles()


  