const apiUrl = "https://script.google.com/macros/s/AKfycbwpDe-ezwT7uDe3k59X08bhEVZaonwv7VAGEmKNKJ1FvLZVMifWg6j-qFPoM0kDzv20jA/exec";

function register() {
    const mail = document.getElementById("regMail").value;
    const nickname = document.getElementById("regNick").value;
    const password = document.getElementById("regPass").value;

    fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `action=register&mail=${encodeURIComponent(mail)}&nickname=${encodeURIComponent(nickname)}&password=${encodeURIComponent(password)}`
    })
        .then(res => res.json())
        .then(data => {
            if (data.status === "success") {
                alert("登録成功");
            } else {
                alert("このメールアドレスは登録済みです");
            }
        });
}

function login() {
    const mail = document.getElementById("logMail").value;
    const password = document.getElementById("logPass").value;

    fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `action=login&mail=${encodeURIComponent(mail)}&password=${encodeURIComponent(password)}`
    })
        .then(res => res.json())
        .then(data => {
            if (data.status === "success") {
                localStorage.setItem("mail", mail);
                localStorage.setItem("nickname", data.nickname);
                location.href = "board.html";
            } else {
                alert("ログイン失敗");
            }
        });
}

function logout() {
    localStorage.clear();
    location.href = "index.html";
}

function sendComment() {
    const mail = localStorage.getItem("mail");
    const nickname = localStorage.getItem("nickname");
    const message = document.getElementById("message").value;

    fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `action=comment&mail=${encodeURIComponent(mail)}&nickname=${encodeURIComponent(nickname)}&message=${encodeURIComponent(message)}`
    })
        .then(res => res.json())
        .then(data => {
            alert("送信完了");
            document.getElementById("message").value = "";
            loadComments();
        });
}

function deleteMyComment(id) {
    const mail = localStorage.getItem("mail");

    fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `action=deleteComment&id=${id}&mail=${encodeURIComponent(mail)}`
    })
        .then(res => res.json())
        .then(data => {
            alert("削除しました");
            loadComments();
        });

    if (action == "adminDelete") {
        const id = e.parameter.id;
        const rows = sheetComments.getDataRange().getValues();

        for (let i = 1; i < rows.length; i++) {
            if (String(rows[i][0]) == String(id)) {
                sheetComments.deleteRow(i + 1);
                return output({ status: "deleted" });
            }
        }
    }
}


function userReply(id) {
    const txt = prompt("管理者への返信を入力");
    if (!txt) return;

    fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `action=userReply&id=${id}&reply=${encodeURIComponent(txt)}`
    })
        .then(res => res.json())
        .then(data => {
            alert("返信しました");
            loadComments();
        });
}

function adminReply(id) {
    const txt = prompt("管理者返信を入力");
    if (!txt) return;

    fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `action=adminReply&id=${id}&reply=${encodeURIComponent(txt)}`
    })
        .then(res => res.json())
        .then(data => {
            alert("返信完了");
            loadAdminComments();
        });
}

function loadComments() {
    fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
            const area = document.getElementById("commentsArea");
            area.innerHTML = "";
            const myMail = localStorage.getItem("mail");

            data.reverse().forEach(c => {
                let html = `
            <div class="comment-box">
                <b>${c.nickname}</b><br>
                ${c.message}<br>
                <small>${c.date}</small><br>
            `;

                if (c.mail === myMail) {
                    html += `<button class="small-btn" onclick="deleteMyComment('${c.id}')">削除</button>`;
                }

                if (c.adminReply) {
                    html += `<div class="reply-box"><b>管理者返信:</b><br>${c.adminReply}</div>`;
                }

                if (c.adminReply && !c.userReply && c.mail === myMail) {
                    html += `<button class="small-btn" onclick="userReply('${c.id}')">返信する</button>`;
                }

                if (c.userReply) {
                    html += `<div class="reply-box"><b>あなたの返信:</b><br>${c.userReply}</div>`;
                }

                html += `</div>`;
                area.innerHTML += html;
            });
        });
}

function loadAdminComments() {
    fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
            const area = document.getElementById("adminArea");
            area.innerHTML = "";

            data.reverse().forEach(c => {
                let html = `
            <div class="comment-box">
                <b>${c.nickname}</b> (${c.mail})<br>
                ${c.message}<br>
                <small>${c.date}</small><br>
            `;

                if (c.adminReply) {
                    html += `<div class="reply-box"><b>管理者返信:</b><br>${c.adminReply}</div>`;
                } else {
                    html += `<button class="small-btn" onclick="adminReply('${c.id}')">返信する</button>`;
                }

                html += `<button class="small-btn" onclick="adminDelete('${c.id}')">コメント削除</button>`;

                if (c.userReply) {
                    html += `<div class="reply-box"><b>ユーザー再返信:</b><br>${c.userReply}</div>`;
                }

                html += `</div>`;
                area.innerHTML += html;
            });
        });
}

window.onload = function () {
    if (document.getElementById("welcome")) {
        const nick = localStorage.getItem("nickname");
        document.getElementById("welcome").innerText = nick + " さんでログイン中";
        loadComments();
    }

    if (document.getElementById("adminArea")) {
        loadAdminComments();
    }
}

function adminLogin() {
    const pass = document.getElementById("adminPass").value;

    if (pass === "miyaharu518") {
        document.getElementById("adminLoginBox").style.display = "none";
        document.getElementById("adminPanel").style.display = "block";
        loadAdminComments();
    } else {
        alert("パスワードが違います");
    }
}
function adminDelete(id) {
    if (!confirm("この投稿を削除しますか？")) return;

    fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `action=adminDelete&id=${id}`
    })
        .then(res => res.json())
        .then(data => {
            alert("削除しました");
            loadAdminComments();
        });
}