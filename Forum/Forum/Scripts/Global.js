var Global = new function () {
    var layer,that=this;
    this.variable = new function ()
    {
        this.style_option =
        {
        headerStyle: "success",            //class name for the window header
        yesButtonStyle: "success",         //class name for the window yes button
        cancelButtonStyle: "success",      //class name for the window cancel button
        bodyStyle: "alert_body",     //class name for the window body content
        };
        this.window_option = {
            title: "Success"
        };

        this.style_option_error =
        {
            headerStyle: "danger",            //class name for the window header
            yesButtonStyle: "danger",         //class name for the window yes button
            cancelButtonStyle: "danger",      //class name for the window cancel button
            bodyStyle: "alert_body",     //class name for the window body content
        };
        this.window_option_error = {
            title: "Error"
        };


        this.style_option_info =
        {
            headerStyle: "info",            //class name for the window header
            yesButtonStyle: "info",         //class name for the window yes button
            cancelButtonStyle: "info",      //class name for the window cancel button
            bodyStyle: "alert_body",     //class name for the window body content
        };
        this.window_option_info = {
            title: "Info"
        };

        this.style_option_warning =
        {
            headerStyle: "warning",            //class name for the window header
            yesButtonStyle: "warning",         //class name for the window yes button
            cancelButtonStyle: "warning",      //class name for the window cancel button
            bodyStyle: "alert_body",     //class name for the window body content
        };
        this.window_option_warning = {
            title: "Warning !"
        };

    }
    this.PageSize = new function () {
        var pageSize = this;
        var leftMenuContainer = $('#Left-Board');
        var rightContainer = $('#right-board');
        var TableContainContainer = $('#searchtable');
        this.SetLeftMenuHeight = function () {
         //   leftMenuContainer.css({ height: 'auto' });
          //  var containerHeight = leftMenuContainer.parent().height() - 145, menuHeight = leftMenuContainer.find('li').length * 37 + 50;
//
           // containerHeight > menuHeight && leftMenuContainer.css({ height: containerHeight + 'px' }) || leftMenuContainer.css({ height: menuHeight + 'px' });
        };
        this.SetLeftSidBerHeight = function () {
           // leftMenuContainer.css({ height: 'auto' });
           // rightContainer.css({ height: 'auto' });
           // var right_height = $('#right-board div').height();
           // var left_height = $('#Left-Board div').height();
           // alert(right_height)
            //right_height > left_height && (leftMenuContainer.css('height', right_height), rightContainer.css('height', right_height)) || (rightContainer.css('height', left_height), leftMenuContainer.css('height', left_height));

            ////var containerHeight = $(window).height() - 203, menuHeight = leftMenuContainer.find('li').length * 37 + 50;
            ////var tableHeight = containerHeight+300;

            ////containerHeight > menuHeight && leftMenuContainer.css({ height: containerHeight + 'px' }) || leftMenuContainer.css({ height: menuHeight + 'px' });
            ////containerHeight > menuHeight && TableContainContainer.css({ height: (containerHeight - 157) + 'px' }) || TableContainContainer.css({ height: (menuHeight - 140) + 'px' });
            //TableContainContainer.css({ height: tableHeight + 'px' });
            //containerHeight > menuHeight && alert("s");
        };
        //pageSize.SetLeftMenuHeight();
        //pageSize.SetLeftSidBerHeight();
        //$(window).resize(pageSize.SetLeftMenuHeight);
        //$(window).resize(function () { pageSize.SetLeftSidBerHeight(); });        
    };    
    this.Busy = function () {
        !layer && (
        layer = $('<div class="overlayer" style="background-image:url(/Images/loading.gif); background-repeat:no-repeat; background-position:center; position:fixed; display:none; width:100%; height:100%; top:0px; left:0px; right:0px; bottom:0px; z-index:999999; cursor: wait; background-color:white; opacity:0.5;"></di>'),
        $(document.body).append(layer));
        layer.show();
    };
    this.Free = function () {        
        layer && (layer.hide(), setTimeout(that.PageSize.SetLeftSidBerHeight(), 1000));
    };
    this.ReadOnly = function (elm)
    {
        $(elm).keydown(function (e) {
            e.preventDefault();
        })
    }
    this.Float = function (elm) {
        // 0 for tab
        // 8 for Backspace
        $(elm).keypress(function (event) {
            if ((event.which != 46 || $(this).val().indexOf('.') != -1) && event.which != 0 && event.which!=8 && (event.which < 48 || event.which > 57)) {
                event.preventDefault();
            }
        });
    }
    this.Integer = function (elm,limit) {
        var numberOfNumber = 0;
        $(elm).keypress(function (event)
        {
            if (event.which != 0 && event.which != 8 && (event.which < 48 || event.which > 57) || (limit && (numberOfNumber > limit - 1) && event.which != 0 && event.which != 8))
            {
                event.preventDefault();
            }
            else
            {
                    event.which != 8 && numberOfNumber++;
                    event.which == 8 && numberOfNumber--;
                    numberOfNumber = numberOfNumber < 0 ? 0 : numberOfNumber;
            }
        });
    }
    this.addExtensionClass = function (fileName) {
        var extension = (/[.]/.exec(fileName)) ? /[^.]+$/.exec(fileName) : undefined;

        var parts = fileName.split('.');
        var extension2 = parts[parts.length - 1];

       //var extension2 = extension.toLowerCase();
        switch (extension2) {
            case 'jpg':
            case 'img':
            case 'png':
            case 'gif':
                return "img-file";
            case 'doc':
            case 'docx':
                return "doc-file";
            case 'xls':
            case 'xlsx':
                return "xls-file";
            case 'pdf':
                return "pdf-file";
            case 'zip':
            case 'rar':
                return "zip-file";
            default:
                return "default-file";
        }
    }
    this.File_Upload = new function () {
        var self = this;
        var callbackin;
        var xhr;
        this.modle_formate = function (obj, model_data, hrk) {
            hrk = hrk || "";
            var cc = model_data;
            for (var prop in model_data) {
                if (model_data.hasOwnProperty(prop)) {
                    if (model_data[prop] != null && typeof model_data[prop] == 'object' && !model_data[prop].IsFile && !model_data[prop].isObject) {
                        if (model_data[prop].length) {
                            for (var i = 0; i < model_data[prop].length; i++) {
                                self.modle_formate(obj, model_data[prop][i], hrk + prop + '[' + i + '].');
                                var bb = 0;
                            }
                        } else {
                            self.modle_formate(obj, model_data[prop], hrk + prop + '.');
                        }
                    } else {
                        if (model_data.hasOwnProperty(prop)) {
                            if (model_data[prop] && model_data[prop].IsFile) {
                                obj.append(hrk + prop, model_data[prop].File);
                            } else if (model_data[prop] && model_data[prop].isDate) {   //  for customize to other type
                                obj.append(hrk + prop, model_data[prop].date);          //  
                            } else if (model_data[prop] && model_data[prop].isObject) {   //  for customize to other type
                                obj.append(hrk + prop, model_data[prop].Data);          //  
                            } else if (model_data[prop] == null) {   //  for customize to other type
                                //obj.append(hrk + prop, null);          //  
                            } else {
                                obj.append(hrk + prop, model_data[prop]);
                            }
                        }
                    }
                }
            }
        }
        this.upload = function (url, send_data,callback) {
            callbackin = callback;
            if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
                xhr = new XMLHttpRequest();
            }
            else {// code for IE6, IE5
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            }
            xhr.upload.addEventListener("progress", self.uploadProgress, false);
            xhr.addEventListener("load", self.uploadComplete, false);
            xhr.addEventListener("error", self.uploadFailed, false);
            xhr.addEventListener("abort", self.uploadCanceled, false);
            xhr.open("POST", url);
            xhr.send(send_data);

            //$.ajax({
            //    async: true,
            //    type: 'POST',
            //    url: url,
            //    dataType: 'json',
            //    data: send_data,
            //    success: function (data) {

            //    },
            //    cache: false,
            //    contentType: false,
            //    processData: false
            //});
        }
        this.uploadProgress = function (e) {
            // _progress = document.getElementById('_progress');
            // _progress.style.width = Math.ceil((e.loaded / e.total) * 100 ) + '%';
            //console.log(e);
            //alert(Math.ceil((e.loaded / e.total) * 100));
        }
        this.uploadComplete = function (e) {
            if (typeof (callbackin) === 'function') {
                callbackin(xhr.responseText);
            }
        }
        this.uploadFailed = function () { }
        this.uploadCanceled = function () { }
        this.imagePriview = function (input) {
            if (input.files && input.files[0]) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    $('#' + $(input).data('holder'))
                        .attr('src', e.target.result);
                        //.width(150)
                        //.height(200);
                };

                reader.readAsDataURL(input.files[0]);
            }
            console.log($(input).data('holder'));
        }
    }
    this.CallService = function (type, url, data, contentType, dataType, processData, successFunction, errorFunction) {
        $.ajax({
            type: type, //GET,POST,PUT or DELETE verb
            url: url, // Location of the service
            data: data, //Data to be sent to server
            contentType: contentType, // content type sent to server
            dataType: dataType, //Expected data format from server
            processdata: processData, //True or False
            success: successFunction,
            error: function (result) {//lblMsg
                errorFunction(result);
            }  // function When Service call fails
        });
    }
    this.AjaxCall = function (url, data, success) {
        $.ajax({
            type: 'POST',
            url: url,
            data: data,
            dataType: 'json',
            contentType: 'application/json;charset=utf-8',
            success: success,
            error: function (error) {
                alert(error.responseText);
            }
        });
    };
};

