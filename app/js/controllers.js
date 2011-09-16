/* App Controllers */

App.Controllers.TodoController = function () {
    var self = this;

    self.newTodo = "";

    self.addTodo = function() {
        self.todos.push({
            content: self.newTodo,
            done: false,
            editing: false
        });
        self.newTodo = "";
    };

    self.editTodo = function(todo) {
        //cancel any active editing operation
        angular.forEach(self.todos, function(value) {
            value.editing = false;
        });
        todo.editing = true;
    };

    self.finishEditing = function(todo) {
        todo.editing = false;
    };

    self.removeTodo = function(todo) {
        angular.Array.remove(self.todos, todo);
    };

    self.todos = [];

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

    /*
        Rx.Observable.FromAngularScope(self, "newTodo")
        .Do(function() {
            self.showHitEnterHint = false;
        })
        .Throttle(500)
        .Select(function(x) {
            return x.length > 0;
        })
        .ToOutputProperty(self, "showHitEnterHint");
    */
    
    //I took the snippet from above and refactored it into this one.
    //it looks more scary but it's killing the side-effect (the Do() call)
    //which is more in balance with the whole functional programming approach
    //and makes up a solution that can easily be turned into a general
    //operator

    Rx.Observable
        .FromAngularScope(self, "newTodo")
        .Let(function(left){
            return left
                       .SelectMany(function(){ return Rx.Observable.Return(false); })
                       .Merge(left
                                .Throttle(500)
                                .Select(function(x) {
                                    return x.length > 0;
                                })
                       );
        })
        .ToOutputProperty(self, "showHitEnterHint");
};
App.Controllers.TodoController.$inject = [];