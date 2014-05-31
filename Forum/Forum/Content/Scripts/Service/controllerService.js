mainModule.factory('controllerService', function () {
    var controller = {};
    
    return {
        set: function (key, velue) {
            controller[key] = velue;
        },
        get: function (key, velue) {
            return controller[key];
        }
    };
});