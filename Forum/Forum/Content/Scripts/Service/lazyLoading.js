mainModule.factory('lazyLoadingCSS', function () {

    var totalFile = 0, loadedFile = 0, finalFunc;
    function callBack() {
        loadedFile++;
        if (totalFile == loadedFile) {
            finalFunc();
        }
    };
    function loadCssFile(urlToLoad, func) {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = urlToLoad;
        document.getElementsByTagName("head")[0].appendChild(link);
        link.onload = callBack;
    };


    return function (urlCollections, func) {
        totalFile = urlCollections.length;
        if (totalFile) {
            finalFunc = func || function () { };
            for (var i = 0; i < totalFile; i++) {
                loadCssFile(urlCollections[i], func);
            }
        }
    }
});