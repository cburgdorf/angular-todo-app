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
            var onNext = function(){
                observer.OnNext(angularScope[propertyName]);
            };
            angularScope.$watch(function(){
              return angularScope[propertyName];
            }, 
            onNext, 
            function(){
                observer.OnError(angularScope[propertyName]);
            }, false);
            return function () {
               // since AngularJS has no API to unbind we set the previous registered
               // callback to a empty dummy function (far from perfect!)
               onNext = function() {};
            };
        });
    };

    root.Observable.prototype.ToOutputProperty = function (scope, propertyName) {
        var disposable = this.Subscribe(function (data) {
            scope[propertyName] = data;
            scope.$eval();
        });
    };

})();