/* App Controllers */

App.Controllers.TodoController = function (todoService) {
    var self = this;

    self.newTodo = "";

    self.addTodo = function() {
        todoService.add({ content: self.newTodo }, syncWithDatabase);
        self.newTodo = "";
    };

    self.startEditing = function(todo) {
        todo.editing = true;
    };

    self.finishEditing = function(todo) {
        todo.editing = false;
    };

    self.update = function(todo){
        todoService.update(todo);
    };

    self.removeTodo = function(todo) {
        todoService.remove(todo, syncWithDatabase);
    };

    self.todos = [];

    var syncWithDatabase = function(){
        self.todos = [];
        todoService.getAll(function(result){

            angular.forEach(result, function(todo){
               //binding directly to the persistencejs entity is just not working out smoothly,
               //because it has issues with the special getter/setter construct that persistencejs uses
               var todo = angular.extend({}, todo._data, {id: todo.id});
               self.todos.push(todo);
            });

            //self.todos = result;
            self.$digest()
        });
    };

    todoService.syncSchema(syncWithDatabase);

    var countTodos = function(done) {
        return function() {
            return angular.Array.count(self.todos, function(x) {
                return x.done === (done === "done");
            });
        }
    };

    self.remainingTodos = countTodos("undone");

    self.finishedTodos = countTodos("done");

    self.clearCompletedItems = function() {
        todoService.clearCompletedItems(syncWithDatabase);
    };

    self.hasFinishedTodos = function() {
        return self.finishedTodos() > 0;
    };

    self.hasTodos = function() {
        return self.todos.length > 0;
    };

    /*
     The following code deals with hiding the hint *while* you are typing,
     showing it once you did *finish* typing (aka 500 ms since you hit the last key)
     *in case* the result is a non empty string
     */
    Rx.Observable.FromAngularScope(self, "newTodo")
        .Do(function() {
            self.showHitEnterHint = false;
        })
        .Throttle(500)
        .Select(function(x) {
            return x.length > 0;
        })
        .ToOutputProperty(self, "showHitEnterHint");
};
App.Controllers.TodoController.$inject = ['todoService'];