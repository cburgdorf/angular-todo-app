/* App Controllers */


function MyCtrl1() {
  var self = this;
  
  self.newTodo = "";
  
  self.addTodo = function(){
    self.todos.push({
      content: self.newTodo,
      done: false,
      editing: false
    });
    self.newTodo = "";
  };
  
  self.editTodo = function(todo){
    //cancel any active editing operation
    angular.forEach(self.todos, function(value){
      value.editing = false;
    });
    todo.editing = true;
  };
  
  self.finishEditing = function(todo){
    todo.editing = false;
  };
  
  self.removeTodo = function(todo){
      angular.Array.remove(self.todos, todo);
  }  
  
  self.todos = [];
  
  var countTodos = function(done){
      return function(){
          return angular.Array.count(self.todos, function(x){
                return x.done === (done === "done" ? true : false);
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
  
  self.hasFinishedTodos = function(){
    return self.finishedTodos() > 0;  
  };
  
  self.hasTodos = function(){
    return self.todos.length > 0;  
  };
  
  self.showHitEnterHint = function(){
    return self.newTodo.length > 0;  
  };
  
}
MyCtrl1.$inject = [];


function MyCtrl2($location) {
  var self = this;
  
  self.users = [{
                  firstName: "Max"
               },
               {
                  firstName: "Steffi"
               }];
  
  self.goBack = function(){
    $location.update({hashPath: '/view1'});
  };
}
MyCtrl2.$inject = ['$location'];
