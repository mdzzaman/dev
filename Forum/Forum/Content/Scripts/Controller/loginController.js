
mainModule.controller('loginController', ['$scope', '$http', 'lazyLoadingCSS', function ($scope, $http, lazyLoadingCSS) {
	    $scope.test = "Name";
	    $scope.bodyURL = '';
	    $scope.Model = {UserName:'aaaaaaa',Password:'aaaaaaa'};
	    var Model = $scope.Model;
	    $scope.load = function () {
	        var responsePromise = $http.post('https://192.168.20.86/WebService/Api/Test', Model, {
	            
	        });
	            responsePromise.success(function (dataFromServer, status, headers, config) {
	                console.log('success');
	            });
	            responsePromise.error(function (data, status, headers, config) {
	                console.log('ffff');
	            });
	        //$http({
	        //    url: 'http://192.168.20.99/stackOverflow/api/test/PostName',
	        //    method: "POST",
	        //    headers: {
	        //        'Authorization': 'Basic dGVzdDp0ZXN0',
	        //        'Content-Type': 'application/x-www-form-urlencoded'
	        //    },
	        //    data: {
	        //        'Code': 'test data'
	        //    }
	        //});
	        //return false;
	        requirejs(['gridController'], function () {
	            lazyLoadingCSS(['Scripts/app/Styles/ng-grid.css'], function () { alert(55)});
	            var scope = angular.element($("#loginForm")).scope();
	            scope.$apply(function () {
	                scope.partialUrl = 'Scripts/app/Views/grid.html';
	            });
	        });
	    }
	}]);

