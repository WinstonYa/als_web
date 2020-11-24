//JSON.parse() 将数据转换为 JavaScript 对象。
token = sessionStorage.getItem("token");

if (!token) {
    window.location.href = 'Login.html';
    //window.event.returnValue = false;
} else {
}
