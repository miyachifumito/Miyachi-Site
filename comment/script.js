const apiUrl = "https://script.google.com/macros/s/AKfycbzP3xNDpVBGIS6wOjenmSrMgpcDUh9Hu2M-xVa5BwiIT1pswX7kvGVTMr8xSSRSCXw-gw/exec";

function register(){
    const mail = document.getElementById("regMail").value;
    const nickname = document.getElementById("regNick").value;
    const password = document.getElementById("regPass").value;

    fetch(apiUrl,{
        method:"POST",
        body:JSON.stringify({
            action:"register",
            mail:mail,
            nickname:nickname,
            password:password
        })
    })
    .then(r=>r.json())
    .then(data=>{
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
        body:JSON.stringify({
            action:"login",
            mail:mail,
            password:password
        })
    })
    .then(r=>r.json())
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
        body:JSON.stringify({
            action:"comment",
            mail:mail,
            nickname:nickname,
            message:message
        })
    })
    .then(r=>r.json())
    .then(data=>{
        alert("送信完了");
        document.getElementById("message").value="";
        loadComments();
    });
}

function loadComments(){
    fetch(apiUrl)
    .then(r=>r.json())
    .then(data=>{
        const area = document.getElementById("commentsArea");
        area.innerHTML = "";

        data.reverse().forEach(c=>{
            area.innerHTML += `
                <div class="comment-box">
                    <b>${c.nickname}</b><br>
                    ${c.message}<br>
                    <small>${c.date}</small>
                </div>
            `;
        });
    });
}

window.onload = function(){
    if(document.getElementById("welcome")){
        const nick = localStorage.getItem("nickname");
        document.getElementById("welcome").innerText = nick + " さんでログイン中";
        loadComments();
    }
}