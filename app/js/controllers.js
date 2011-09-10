/* App Controllers */

App.Controllers.TodoController = function (todoService) {
    var self = this;

    self.newTodo = "";

    self.addTodo = function() {

        todoService.add({ content: self.newTodo }, syncWithDatabase);
        self.newTodo = "";
    };

    self.editTodo = function(todo) {
        todoService.edit(todo);
    };

    self.finishEditing = function(todo) {
        todo.editing = false;
        todoService.update();
    };

    self.removeTodo = function(todo) {
        todoService.remove(todo, syncWithDatabase);
    };

    self.todos = [];

    var syncWithDatabase = function(){
        todoService.getAll(function(result){
            self.todos = result;
            self.$apply();
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
        var oldTodos = self.todos;
        self.todos = [];
        angular.forEach(oldTodos, function(todo) {
            if (!todo.done) self.todos.push(todo);
        });
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