const apiUrl = "https://script.google.com/macros/s/AKfycbzP3xNDpVBGIS6wOjenmSrMgpcDUh9Hu2M-xVa5BwiIT1pswX7kvGVTMr8xSSRSCXw-gw/exec";

function doPost(e) {
  const sheetUsers = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("users");
  const sheetComments = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("comments");

  const action = e.parameter.action;

  if(action == "register"){
    const mail = e.parameter.mail;
    const nickname = e.parameter.nickname;
    const password = e.parameter.password;

    const users = sheetUsers.getDataRange().getValues();

    for(let i=1;i<users.length;i++){
      if(users[i][0] == mail){
        return output({status:"exists"});
      }
    }

    sheetUsers.appendRow([mail,nickname,password,new Date()]);
    return output({status:"success"});
  }

  if(action == "login"){
    const mail = e.parameter.mail;
    const password = e.parameter.password;

    const users = sheetUsers.getDataRange().getValues();

    for(let i=1;i<users.length;i++){
      if(users[i][0] == mail && users[i][2] == password){
        return output({
          status:"success",
          nickname:users[i][1]
        });
      }
    }

    return output({status:"fail"});
  }

  if(action == "comment"){
    const mail = e.parameter.mail;
    const nickname = e.parameter.nickname;
    const message = e.parameter.message;

    sheetComments.appendRow([mail,nickname,message,new Date()]);
    return output({status:"success"});
  }
}

function doGet(){
  const sheetComments = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("comments");
  const comments = sheetComments.getDataRange().getValues();
  let result = [];

  for(let i=1;i<comments.length;i++){
    result.push({
      mail:comments[i][0],
      nickname:comments[i][1],
      message:comments[i][2],
      date:comments[i][3]
    });
  }

  return output(result);
}

function output(data){
  return ContentService.createTextOutput(JSON.stringify(data))
  .setMimeType(ContentService.MimeType.JSON);
}

function register(){
    const mail = document.getElementById("regMail").value;
    const nickname = document.getElementById("regNick").value;
    const password = document.getElementById("regPass").value;

    fetch(apiUrl,{
        method:"POST",
        headers:{
            "Content-Type":"application/x-www-form-urlencoded"
        },
        body:`action=register&mail=${encodeURIComponent(mail)}&nickname=${encodeURIComponent(nickname)}&password=${encodeURIComponent(password)}`
    })
    .then(res=>res.json())
    .then(data=>{
        alert(JSON.stringify(data));
        if(data.status==="success"){
            alert("登録成功");
        }else{
            alert("このメールは既に登録されています");
        }
    });
}

function login(){
    const mail = document.getElementById("logMail").value;
    const password = document.getElementById("logPass").value;

    fetch(apiUrl,{
        method:"POST",
        headers:{
            "Content-Type":"application/x-www-form-urlencoded"
        },
        body:`action=login&mail=${encodeURIComponent(mail)}&password=${encodeURIComponent(password)}`
    })
    .then(res=>res.json())
    .then(data=>{
        if(data.status==="success"){
            localStorage.setItem("mail",mail);
            localStorage.setItem("nickname",data.nickname);
            location.href="board.html";
        }else{
            alert("ログイン失敗");
        }
    });
}
function sendComment(){
    const mail = localStorage.getItem("mail");
    const nickname = localStorage.getItem("nickname");
    const message = document.getElementById("message").value;

    fetch(apiUrl,{
        method:"POST",
        headers:{
            "Content-Type":"application/x-www-form-urlencoded"
        },
        body:`action=comment&mail=${encodeURIComponent(mail)}&nickname=${encodeURIComponent(nickname)}&message=${encodeURIComponent(message)}`
    })
    .then(res=>res.json())
    .then(data=>{
        alert("送信完了");
        document.getElementById("message").value="";
        loadComments();
    });
}