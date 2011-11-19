/* http://docs.angularjs.org/#!angular.service */

/**
 * App service which is responsible for the main configuration of the app.
 */
angular.service('myAngularApp', function($route, $location, $window) {

  $route.when('/main', {template: 'partials/main.html', controller: App.Controllers.TodoController});
  $route.when('/credits', {template: 'partials/credits.html'});
  $route.otherwise({redirectTo: '/main'});

  var self = this;

  self.$on('$afterRouteChange', function(){
    $window.scrollTo(0,0);
  });

}, {$inject:['$route', '$location', '$window'], $eager: true});
