$(function () {
    //��ʼ����Ĭ�ϵ�����
    $.swfUpLoadDefaults = $.swfUpLoadDefaults || {};
    $.swfUpLoadDefaults.property = {
        single: true, //�Ƿ��ļ�
        water: false, //�Ƿ��ˮӡ
        thumbnail: false, //�Ƿ���������ͼ
        sendurl: null, //���͵�ַ
        filetypes: "*.jpg;*.jpge;*.png;*.gif;", //�ļ�����
        filesize: "2048", //�ļ���С
        btntext: "���...", //�ϴ���ť������
        btnwidth: 48, //�ϴ���ť�Ŀ��
        btnheight: 28, //�ϴ���ť�ĸ߶�
        flashurl: null //FLASH�ϴ��ؼ���Ե�ַ
    };
    //��ʼ��SWFUpload�ϴ��ؼ�
    $.fn.InitSWFUpload = function (p) {
        p = $.extend({}, $.swfUpLoadDefaults.property, p || {});
        //�����ϴ���ť
        var parentObj = $(this);
        var parentBtnId = "upload_span_" + Math.floor(Math.random() * 1000 + 1);
        parentObj.append('<div class="upload-btn"><span id="' + parentBtnId + '"></span></div>');
        //��ʼ������
        var btnAction = SWFUpload.BUTTON_ACTION.SELECT_FILES; //���ļ��ϴ�

        p.sendurl += "?action=UpLoadFile";
        if (p.single) {
            btnAction = SWFUpload.BUTTON_ACTION.SELECT_FILE; //���ļ��ϴ�
        }
        if (p.water) {
            p.sendurl += "&IsWater=1";
        }
        if (p.thumbnail) {
            p.sendurl += "&IsThumbnail=1";
        }

        //��ʼ���ϴ��ؼ�
        var swfu = new SWFUpload({
            post_params: { "ASPSESSID": "NONE" },
            upload_url: p.sendurl, //�ϴ���ַ
            file_size_limit: p.filesize, //�ļ���С
            file_types: p.filetypes, //�ļ�����
            file_types_description: "JPG Images",
            file_upload_limit: "0", //һ�����ϴ����ļ�����

            file_queue_error_handler: fileQueueError,
            file_dialog_complete_handler: fileDialogComplete,
            upload_progress_handler: uploadProgress,
            upload_error_handler: uploadError,
            upload_success_handler: uploadSuccess,
            upload_complete_handler: uploadComplete,

            button_placeholder_id: parentBtnId, //ָ��һ��domԪ��
            button_width: p.btnwidth, //�ϴ���ť�Ŀ��
            button_height: p.btnheight, //�ϴ���ť�ĸ߶�
            button_text: '<span class="btnText">' + p.btntext + '</span>', //�ϴ���ť������
            button_text_style: ".btnText{font-family:Microsoft YaHei;font-size:12px;line-height:28px;color:#333333;text-align:center;}", //��ť��ʽ
            button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT, //����͸��
            button_action: btnAction, //���ļ�����ļ��ϴ�
            button_cursor: SWFUpload.CURSOR.HAND, //ָ������
            flash_url: p.flashurl, //Flash·��
            custom_settings: {
                "upload_target": parentObj,
                "button_action": btnAction
            },
            debug: false
        });
    }
});

//==================================�������ϴ�ʱ�����¼�===================================
//��ѡ���ļ��Ի���ر���ʧʱ����
function fileQueueError(file, errorCode, message) {
    try {
        switch (errorCode) {
            case SWFUpload.errorCode_QUEUE_LIMIT_EXCEEDED:
                alert("��ѡ����ļ�̫�࣡");
                break;
            case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
                alert(file.name + "�ļ�̫С��");
                break;
            case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
                alert(file.name + "�ļ�̫��");
                break;
            case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
                alert(file.name + "�ļ����ͳ���");
                break;
            default:
                if (file !== null) {
                    alert("����δ֪����");
                }
                break;
        }

    } catch (ex) {
        this.debug(ex);
    }
}
//��ѡ���ļ��Ի���رգ������ļ��Ѿ��������ʱ����
function fileDialogComplete(numFilesSelected, numFilesQueued) {
    try {
        if (numFilesQueued > 0) {
            //����ǵ��ļ��ϴ����Ѿɵ��ļ���ַ����ȥ
            if (this.customSettings.button_action == SWFUpload.BUTTON_ACTION.SELECT_FILE) {
                this.setPostParams({
                    "DelFilePath": $(this.customSettings.upload_target).siblings(".upload-path").val()
                });
            }
            this.startUpload();
            createHtmlProgress(this); //����������
        }
    } catch (ex) {
        this.debug(ex);
    }
}
//flash��ʱ��������ʱ����ҳ���е�UIԪ�شﵽ��ʱ��ʾ�ϴ����ȵ�Ч��
function uploadProgress(file, bytesLoaded) {
    try {
        var percent = Math.ceil((bytesLoaded / file.size) * 100);
        var progressObj = $(this.customSettings.upload_target).children(".upload-progress");
        progressObj.children(".txt").html(file.name);
        progressObj.find(".bar b").width(percent + "%");
    } catch (ex) {
        this.debug(ex);
    }
}
//�ϴ�����ֹ����û�гɹ����ʱ����
function uploadError(file, errorCode, message) {
    var progress;
    try {
        switch (errorCode) {
            case SWFUpload.UPLOAD_ERROR.FILE_CANCELLED:
                try {
                    var progressObj = $(this.customSettings.upload_target).children(".upload-progress");
                    progressObj.children(".txt").html("�ϴ���ȡ����Cancelled");
                }
                catch (ex1) {
                    this.debug(ex1);
                }
                break;
            case SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED:
                try {
                    var progressObj = $(this.customSettings.upload_target).children(".upload-progress");
                    progressObj.children(".txt").html("�ϴ���ֹͣ��Stopped");
                }
                catch (ex2) {
                    this.debug(ex2);
                }
            case SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED:
                alert(message + "SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED");
                break;
            default:
                alert(message + "δ֪��");
                break;
        }
    } catch (ex3) {
        this.debug(ex3);
    }
}
//�ļ��ϴ��Ĵ����Ѿ�����ҷ���˷�����200��HTTP״̬ʱ����
function uploadSuccess(file, serverData) {
    try {
        var jsonstr = eval('(' + serverData + ')');
        if (jsonstr.status == '0') {
            var progressObj = $(this.customSettings.upload_target).children(".upload-progress");
            progressObj.children(".txt").html(jsonstr.msg);
        }
        if (jsonstr.status == '1') {
            //����ǵ��ļ��ϴ�����ֵ��Ӧ�ı�
            if (this.customSettings.button_action == SWFUpload.BUTTON_ACTION.SELECT_FILE) {
                $(this.customSettings.upload_target).siblings(".upload-name").val(jsonstr.name);
                $(this.customSettings.upload_target).siblings(".upload-path").val(jsonstr.path);
                var img = $(this.customSettings.upload_target).siblings("img");
                if (img) {
                    img.attr("src", "../.." + jsonstr.path);
                }
                $(this.customSettings.upload_target).siblings(".upload-size").val(jsonstr.size);
            }
            else {

                if ($(this.customSettings.upload_target).hasClass("upload-attach")) {
                    addAttachFiles($(this.customSettings.upload_target), jsonstr.name, jsonstr.path, jsonstr.size)
                }
                else {
                    addImage($(this.customSettings.upload_target), jsonstr.path, jsonstr.thumb);
                }
            }
            var progressObj = $(this.customSettings.upload_target).children(".upload-progress");
            progressObj.children(".txt").html("�ϴ��ɹ���" + file.name);
        }
    } catch (ex) {
        this.debug(ex);
    }
}
//���ϴ������е��ļ������ʱ�����۳ɹ�(uoloadSuccess����)��ʧ��(uploadError����)�����¼����ᱻ����
function uploadComplete(file) {
    try {
        if (this.getStats().files_queued > 0) {
            this.startUpload();
        } else {
            var progressObj = $(this.customSettings.upload_target).children(".upload-progress");
            progressObj.children(".txt").html("ȫ���ϴ��ɹ�");
            progressObj.remove();
        }
    } catch (ex) {
        this.debug(ex);
    }
}

//==================================�������ϴ�ʱ�����¼�===================================
//�����ϴ�������
function createHtmlProgress(swfuInstance) {
    //�ж���ʾ���ȵ�DIV�Ƿ���ڣ��������򴴽�
    var targetObj = $(swfuInstance.customSettings.upload_target);
    var fileProgressObj = $('<div class="upload-progress"></div>').appendTo(targetObj);
    var progressText = $('<span class="txt">�����ϴ������Ժ�...</span>').appendTo(fileProgressObj);
    var progressBar = $('<span class="bar"><b></b></span>').appendTo(fileProgressObj);
    var progressCancel = $('<a class="close" title="ȡ���ϴ�">�ر�</a>').appendTo(fileProgressObj);
    //�󶨵���¼�
    progressCancel.click(function () {
        swfuInstance.stopUpload();
        fileProgressObj.remove();
    });
}

//======================================ͼƬ��ᴦ���¼�======================================
//���ͼƬ���
function addImage(targetObj, originalSrc, thumbSrc) {
    //���뵽���UL����
    var newLi = $('<li>'
    + '<input type="hidden" name="hid_photo_name" value="0|' + originalSrc + '|' + thumbSrc + '" />'
    + '<input type="hidden" name="hid_photo_remark" value="" />'
    + '<div class="img-box" onclick="setFocusImg(this);">'
    + '<img src="' + thumbSrc + '" bigsrc="' + originalSrc + '" />'
    + '<span class="remark"><i>��������...</i></span>'
    + '</div>'
    + '<a href="javascript:;" onclick="setRemark(this);">����</a>'
    + '<a href="javascript:;" onclick="delImg(this);">ɾ��</a>'
    + '</li>');
    newLi.appendTo(targetObj.siblings(".photo-list").children("ul"));

    //Ĭ�ϵ�һ��Ϊ������
    var focusPhotoObj = targetObj.siblings(".focus-photo");
    if (focusPhotoObj.val() == "") {
        focusPhotoObj.val(thumbSrc);
        newLi.children(".img-box").addClass("selected");
    }
}
//����������
function setFocusImg(obj) {
    //    var focusPhotoObj = $(obj).parents(".photo-list").siblings(".focus-photo");
    //    focusPhotoObj.val($(obj).children("img").eq(0).attr("src"));
    //    $(obj).parent().siblings().children(".img-box").removeClass("selected");
    //    $(obj).addClass("selected");
    showBigViewImage(obj);
}



//
function showBigViewImage(obj) {
    //    var focusPhotoObj = $(obj).parents(".photo-list").siblings(".focus-photo");
    //    focusPhotoObj.val($(obj).children("img").eq(0).attr("src"));
    //    $(obj).parent().siblings().children(".img-box").removeClass("selected");
    //    $(obj).addClass("selected");
    //    var li = $(obj).parents("li").eq(0);
    //    var index = $(obj).parents(".photo-list").find("li").index(li);
    var bigurl = $(obj).children("img").eq(0).attr("src");
    window.open(bigurl);
    //    var url = $(obj).children("img").eq(0).attr("bigsrc");
    //    var info = $(obj).children("i").eq(0).text();

    //    var data = new Object();
    //    data.select = { burl: bigurl, info: info, index: index, surl: url };
    //    data.rows = new Array();

    //    $(obj).parents(".photo-list").find(".img-box").each(function (index) {
    //        var bigurl = $(this).children("img").eq(0).attr("src");
    //        var url = $(this).children("img").eq(0).attr("bigsrc");
    //        var info = $(this).children("i").eq(0).text();
    //        data.rows.push({ burl: bigurl, info: info, index: index, surl: url });
    //    });
    //    showImageViewDialog(data);
}

//������������
function showImageViewDialog(obj) {
    var objNum = arguments.length;
    //alert(screen.width);
    // alert(screen.height);
    var attachDialog = $.dialog({
        id: 'photowallDialogId',
        lock: true,
        max: false,
        min: false,
        title: "�鿴ͼƬ",
        content: 'url:dialog/dialog_photowall.aspx',
        width: $(document).width() - 30,
        height: $(document).height() - 150
    });
    //������޸�״̬�������󴫽�ȥ
    if (objNum == 1) {
        attachDialog.data = obj;
    }
}


//����ͼƬ����
function setRemark(obj) {
    var parentObj = $(obj); //������
    var hidRemarkObj = parentObj.prevAll("input[name='hid_photo_remark']").eq(0); //ȡ������ֵ
    var m = $.dialog({
        lock: true,
        max: false,
        min: false,
        padding: 0,
        title: "ͼƬ����",
        content: '<textarea id="ImageRemark" style="margin:10px 0;font-size:12px;padding:3px;color:#000;border:1px #d2d2d2 solid;vertical-align:middle;width:300px;height:50px;">' + hidRemarkObj.val() + '</textarea>',
        button: [{
            name: '��������',
            callback: function () {
                var remarkObj = $('#ImageRemark', parent.document);
                if (remarkObj.val() == "") {
                    $.dialog.alert('�ܸ�д��ʲô�ɣ�', function () {
                        remarkObj.focus();
                    }, m);
                    return false;
                }
                parentObj.parent().parent().find("li input[name='hid_photo_remark']").val(remarkObj.val());
                parentObj.parent().parent().find("li .img-box .remark i").html(remarkObj.val());
            }
        }, {
            name: '��������',
            callback: function () {
                var remarkObj = $('#ImageRemark', parent.document);
                if (remarkObj.val() == "") {
                    $.dialog.alert('�ܸ�д��ʲô�ɣ�', function () {
                        remarkObj.focus();
                    }, m);
                    return false;
                }
                hidRemarkObj.val(remarkObj.val());
                parentObj.siblings(".img-box").children(".remark").children("i").html(remarkObj.val());
            },
            focus: true
        }]
    });
}

//ɾ��ͼƬLI�ڵ�
function delImg(obj) {
    var parentObj = $(obj).parent().parent();
    var id = $(obj).attr("tagFjid");
    var ctrDel = $("#hdDeleteIds");
    if (id && ctrDel) {
        $("#hdDeleteIds").val($("#hdDeleteIds").val() + ',' + id);
    }
    var focusPhotoObj = parentObj.parent().siblings(".focus-photo");
    var smallImg = $(obj).siblings(".img-box").children("img").attr("src");
    $(obj).parent().remove(); //ɾ����LI�ڵ�
    //����Ƿ�Ϊ����
    if (focusPhotoObj.val() == smallImg) {
        focusPhotoObj.val("");
        var firtImgBox = parentObj.find("li .img-box").eq(0); //ȡ��һ����Ϊ����
        firtImgBox.addClass("selected");
        focusPhotoObj.val(firtImgBox.children("img").attr("src")); //���¸������������ֵ
    }
}



//ɾ��ͼƬLI�ڵ�
function delVideoNode(obj) {
    var parentObj = $(obj).parent().parent();
    var id = $(obj).attr("tagFjid");
    var ctrDel = $("#delVideoIds");
    if (id && ctrDel) {
        $("#delVideoIds").val($("#delVideoIds").val() + ',' + id);
    }
    $(obj).parent().remove(); //ɾ����LI�ڵ�    
}



function addAttachFiles(target, name, path, size) {
  
    var newLi = $('<li>'
            + '<input name="hid_attach_id" type="hidden" value="0" />'
            + '<input name="hid_attach_filename" type="hidden" value="' + name + '" />'
            + '<input name="hid_attach_filepath" type="hidden" value="' + path + '" />'
            + '<input name="hid_attach_filesize" type="hidden" value="' + size + '" />'
            + '<i class="icon"></i>'
            + '<a href="javascript:;" onclick="delAttachNode(this);" class="del" tagfjid="0" title="ɾ������"></a>'
            + '<div class="title"><a href="' + path + '"   target="_blank" >' + name + '</a></div>'
            + '</li>');

    newLi.appendTo(target.siblings(".attach-list").children("ul"));

}