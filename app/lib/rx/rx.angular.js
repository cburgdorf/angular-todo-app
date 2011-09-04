(function () {
    var global = this,
        root = (typeof ProvideCustomRxRootObject == "undefined") ? global.Rx : ProvideCustomRxRootObject();

    var observable = root.Observable;
    var asyncSubject = root.AsyncSubject;
    var observableCreate = observable.Create;
    var disposableEmpty = root.Disposable.Empty;

    if (!Object.getPrototypeOf) {
        Object.getPrototypeOf = function getPrototypeOf(object) {
            return object.__proto__ || object.constructor.prototype;
            // or undefined if not available in this engine
        };
    }

/*
    //it seems as if we have no anguar scope prototype we can extend :-( 
 
    Object.getPrototypeOf(angular.scope).toObservable = function (property) {
        var angularScope = this;
        return observableCreate(function (observer) {
            angularScope.$watch(function(){
              return angularScope[property];
            }, function(){
              observer.OnNext(angularScope[property]);
            });
            return function () {
                // make something to unwatch the expression
            };
        });
    };
*/

    observable.FromAngularScope = function (angularScope, propertyName) {
        return observableCreate(function (observer) {
            var unwatch = angularScope.$watch(function(){
              return angularScope[propertyName];
            }, 
            function(){
                observer.OnNext(angularScope[propertyName]);
            });
            return function () {
               unwatch();
            };
        })
        .Skip(1); //In AngularJS 0.10.x There is no way to avoid initial evaluation. So we take care about it!
    };

    root.Observable.prototype.ToOutputProperty = function (scope, propertyName) {
        var disposable = this.Subscribe(function (data) {
            scope[propertyName] = data;
            scope.$apply();
        });
        
        scope.$on('$destroy', function(event){
          //we need to asure that we only dispose the observable when it's our scope that
          //was destroyed.
          
          //TODO: Figure out if thats enought to asure the above (e.g what happens when
          //a child scope will be destroyed but ours won't be affected. Or the other way around, 
          //a higher scope will be destroyed does it mean that $destroy() will be called up on our
          //scope, too or will our scope get destroyed without actually calling $destroy() on it?
          if (event.targetScope === scope){
            disposable.Dispose();
          }          
        });        
    };

})();