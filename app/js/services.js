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

/**
* PersistenceService which defines how and where to save our entities
*/
angular.service('persistenceService', function() {

    persistence.store.websql.config(persistence, 'todoDb', 'database for the todo app', 5 * 1024 * 1024);

    //persistence.store.memory.config(persistence, 'todoDb', 'database for the todo app', 5 * 1024 * 1024);
    
    return persistence;
    
}, { $eager: true});

/**
* TodoService which is responsible for all operations that can happen around todos
*/
angular.service('todoService', function(persistenceService) {

    var self = this;

    //define a Todo Model
    var Todo = persistenceService.define('Todo',{
        content: "TEXT",
        done: "BOOL",
        editing: "BOOL"
    });

    self.syncSchema = function(callback){
      persistence.schemaSync(callback);
    };

    self.add = function(blueprint, callback){
        blueprint = angular.extend({ done: false, editing: false}, blueprint);
        var todo = new Todo(blueprint);
        persistence.add(todo);
        persistence.flush(function(){
            callback(todo);
        });
    };

    self.edit = function(todo){
        //cancel all active editing operations
        Todo
            .all()
            .filter('editing','=','true')
            .each(function(obj){
                obj.editing = false;
            });
        todo.editing = true;
        persistence.flush();
    };

    self.remove = function(todo, callback){
        persistence.remove(todo);
        persistence.flush(callback);
    }

    self.update = function(){
        persistence.flush();
    };

    self.clearCompletedItems = function(){
        Todo
            .all()
            .filter('done','=','true')
            .each(function(obj){
                persistence.remove(obj);
            });
    };

    self.getAll = function(callback){
      Todo.all().list(null, callback);
    };

    return self;
    
}, {$inject:['persistenceService']});
