const apiUrl = "https://script.google.com/macros/s/AKfycbwpDe-ezwT7uDe3k59X08bhEVZaonwv7VAGEmKNKJ1FvLZVMifWg6j-qFPoM0kDzv20jA/exec";

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
        if(data.status==="success"){
            alert("登録成功");
        }else if(data.status==="exists"){
            alert("このメールは既に登録されています");
        }else{
            alert("エラー："+data.message);
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
        if(data.status==="success"){
            alert("送信完了");
            document.getElementById("message").value="";
            loadComments();
        }else{
            alert("送信失敗");
        }
    });
}

function loadComments(){
    fetch(apiUrl)
    .then(res=>res.json())
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