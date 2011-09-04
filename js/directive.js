angular.directive('my:mouseenter', function(expression, compiledElement) {
    var compiler = this;
    return function(linkElement) {
        var scope = this;
        linkElement.bind('mouseenter', function(event) {
            scope.$tryEval(expression, linkElement);
            scope.$service('$updateView')();
            event.stopPropagation();
        });
    };
});

angular.directive('my:mouseleave', function(expression, compiledElement) {
    var compiler = this;
    return function(linkElement) {
        var scope = this;
        linkElement.bind('mouseleave', function(event) {
            scope.$tryEval(expression, linkElement);
            scope.$service('$updateView')();
            event.stopPropagation();
        });
    };
});

angular.directive('my:blur', function(expression, compiledElement) {
    var compiler = this;
    return function(linkElement) {
        var scope = this;
        linkElement.bind('blur', function(event) {
            scope.$apply(expression, linkElement);
            event.stopPropagation();
        });
    };
});


angular.directive("my:focus", function(expression, compiledElement){
  return function(element){
    this.$watch(expression, function(){
    if(angular.formatter.boolean.parse(expression) && element.length > 0){
      element[0].focus();
    } 
    }, element);
  };
});
