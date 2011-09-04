/* http://docs.angularjs.org/#!angular.service */

/**
 * App service which is responsible for the main configuration of the app.
 */
angular.service('myAngularApp', function($route, $location, $window) {

  $route.when('/main', {template: 'partials/main.html', controller: App.Controllers.TodoController});
  $route.when('/credits', {template: 'partials/credits.html'});
  $route.when('', {redirectTo: '/main'});

/*
  var self = this;

  //Figure out if we actually need any of this any longer in 0.10.x

  $route.$on('$afterRouteChange', function() {
    if ($location.hash === '') {
      $location.updateHash('/main');
      self.$eval();
    } else {
      $route.current.scope.params = $route.current.params;
      $window.scrollTo(0,0);
    }
  });
*/

}, {$inject:['$route', '$location', '$window'], $eager: true});
