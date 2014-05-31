var mainModule = angular.module('mainModule', ['ngGrid']);
mainModule.config(function ($routeProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $animationProvider) {
    // save references to the providers
    mainModule.lazy = {
        controller: $controllerProvider.register,
        directive: $compileProvider.directive,
        filter: $filterProvider.register,
        factory: $provide.factory,
        service: $provide.service,
        animation: $animationProvider.register
    };
    // define routes, etc.
});

//Define Routing for app
//Uri /AddNewOrder -> template AddOrder.html and Controller AddOrderController
//Uri /ShowOrders -> template ShowOrders.html and Controller AddOrderController
mainModule.config(['$routeProvider',
  function ($routeProvider) {
      $routeProvider.
        when('/about', {
            templateUrl: 'Scripts/app/Views/GoogleTranslate.htm',
            controller: 'gridController',
           
        }).
        when('/ShowOrders', {
            templateUrl: 'templates/show_orders.html',
            controller: 'ShowOrdersController'
        }).
        otherwise({
            redirectTo: '/AddNewOrder'
        });
  }]);

