function doApi(sucFunc, errFunc, comFunc, url, type, params, contentType, async) {
    $.ajax({
        url: url,
        data: params,
        type: type,
        async: async ? async : true,
        contentType: contentType,
        // async: true,
        beforeSend: function (request) {
            var token = localStorage.getItem('token');
            if (token) {
                request.setRequestHeader('Authorization', token);
            }
        },
        success: sucFunc,
        error: function (res) {
            if (res.responseText.substr(0, 30) === "AuthenticationEntryPoint检测到异常:") {
                localStorage.removeItem('token');
                window.location.href = 'Login.html';
            } else if (errFunc) {
                errFunc(res);
            }
        },
        complete: comFunc
    });
}

function doApiByJsonstr(sucFunc, errFunc, comFunc, url, type, params, async) {

    var jsonParams = null;
    if (params) {
        jsonParams = JSON.stringify(params);
    }
    doApi(sucFunc, errFunc, comFunc, url, type, jsonParams, 'application/json', async)
}

//（带文件）form表单提交
function doApiByFile(sucFunc, errFunc, comFunc, url, type, params) {

    $.ajax({
        url: url,
        type: type,
        // {contentType:false processData:false 固定写法}
        contentType: false,
        processData: false,//是否预处理数据:默认为true，默认情况下，发送的数据将被转换为对象，设为false不希望进行转换
        data: params,
        beforeSend: function (request) {
            var token = localStorage.getItem('token');
            if (token) {
                request.setRequestHeader('Authorization', token);
            }
        },
        success: sucFunc,
        error: errFunc,
        complete: comFunc
    })
}
