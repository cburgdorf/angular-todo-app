/* http://docs.angularjs.org/#!angular.service */

/**
 * App service which is responsible for the main configuration of the app.
 */
angular.service('myAngularApp', function($route, $location, $window) {

  $route.when('/main', {template: 'partials/main.html', controller: MyCtrl1});
  $route.when('/credits', {template: 'partials/credits.html'});

  var self = this;

  $route.onChange(function() {
    if ($location.hash === '') {
      $location.updateHash('/main');
      self.$eval();
    } else {
      $route.current.scope.params = $route.current.params;
      $window.scrollTo(0,0);
    }
  });

}, {$inject:['$route', '$location', '$window'], $eager: true});
