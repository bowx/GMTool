var gmApp = angular.module('gmApp',['ngRoute']);
gmApp.config(['$routeProvider',function ($routeProvider) {
      $routeProvider
      .when('/Welcome', {
        templateUrl: 'templates/Welcome.html',
        //controller: 'RouteListCtl'
      })
	  .when('/player', {
        templateUrl: 'templates/player.html',
        controller: 'PlayerCtl'
      })
      .when('/list/:id', {
          templateUrl: 'views/route/detail.html',
          //controller: 'RouteDetailCtl'
      })
      .otherwise({
        redirectTo: '/Welcome'
      });
}]);