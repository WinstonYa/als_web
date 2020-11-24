//json数据    文件名称    excle首行标题      过滤字段
function Json2Excel(JSONData, FileName, title, filter) {

    //身份证正则
    var regIdCard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;

    if(!JSONData) return;
    //转化json为object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    var excel = "<table>";
    //设置表头
    var row = "<tr>";
    if(title) {
        //使用标题项
        for (var i in title) { row += "<th align='center'>" + title[i] + '</th>'; }
    } else {
        //不使用标题项
        for (var i in arrData[0]) { row += "<th align='center'>" + i + '</th>'; }
    }
    excel += row + "</tr>";
    //设置数据
    for (var i = 0; i < arrData.length; i++) {
        var row = "<tr>";
        for (var index in arrData[i]) {
            //判断是否有过滤行
            if(filter) {
                if(filter.indexOf(index) == -1){
                    var value = arrData[i][index] == null ? "" : arrData[i][index];
                    /*<td> 拼接 正则是身份证 则加标记为 excle文本类型*/
                    // if(regIdCard.test(value) === true) {
                        row += '<td style="vnd.ms-excel.numberformat:@">' + value + '</td>';
                    // }else {
                        // row += '<td>' + value + '</td>';
                    // }
                }
            }else{
                var value = arrData[i][index] == null ? "" : arrData[i][index];
                row += "<td align='center'>" + value + "</td>";
            }
        }
        excel += row + "</tr>";
    }
    excel += "</table>";
    var excelFile = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>";
    excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';
    excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel';
    excelFile += '; charset=UTF-8">';
    excelFile += "<head>";
    excelFile += "<!--[if gte mso 9]>";
    excelFile += "<xml>";
    excelFile += "<x:ExcelWorkbook>";
    excelFile += "<x:ExcelWorksheets>";
    excelFile += "<x:ExcelWorksheet>";
    excelFile += "<x:Name>";
    excelFile += "{worksheet}";
    excelFile += "</x:Name>";
    excelFile += "<x:WorksheetOptions>";
    excelFile += "<x:DisplayGridlines/>";
    excelFile += "</x:WorksheetOptions>";
    excelFile += "</x:ExcelWorksheet>";
    excelFile += "</x:ExcelWorksheets>";
    excelFile += "</x:ExcelWorkbook>";
    excelFile += "</xml>";
    excelFile += "<![endif]-->";
    excelFile += "</head>";
    excelFile += "<body>";
    excelFile += excel;
    excelFile += "</body>";
    excelFile += "</html>";
    var uri = 'data:application/vnd.ms-excel;base64,' + encodeURIComponent(excelFile);
    var isIE = !!window.ActiveXObject || "ActiveXObject" in window; //判断是否IE浏览器

    // 兼容ie11
    if(isIE){
        var blob = new Blob([excelFile], {
            type: "application/vnd.ms-excel;charset=utf-8"
        });
        //使用 Blob 构造函数可以直接在客户端上创建和操作 Blob（通常等效于一个文件）。
        //msSaveOrOpenBlob 保存并打开
        //Internet Explorer 10 的 msSaveBlob 和 msSaveOrOpenBlob 方法允许用户在客户端上保存文件，方法如同从 Internet 下载文件，这是此类文件保存到“下载”文件夹的原因。
        window.navigator.msSaveOrOpenBlob(blob, FileName + ".xls");
        var flag = 'end'

    } else {
        try {
            var blob = new Blob([excelFile], {
                type: "application/vnd.ms-excel;charset=utf-8"
            });
            var url = window.URL.createObjectURL(blob);
            var link = document.createElement("a");
            link.href = url;
            link.style.visibility = "hidden";
            link.download = FileName + ".xls";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (e) {
            alert("下载异常！");
        }
        flag='end'
    }
    return flag

}
