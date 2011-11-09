    Rx.Observable.prototype.WhereTrue = function (propertyName) {
        return this.Where(function (x) {
            return propertyName === undefined ? x === true : x[propertyName] === true;
        });
    };

    Rx.Observable.prototype.WhereFalse = function (propertyName) {
        return this.Where(function (x) {
            return propertyName === undefined ? x === false : x[propertyName] === false;
        });
    };
    
    Rx.Observable.prototype.WrapAs = function (propertyName) {
        return this.Select(function (x) {
            var temp = {};
            temp[propertyName] = x;
            return temp;
        });
    };

    Rx.Observable.prototype.AppendAs = function (propertyName, data) {
        return this.Select(function (x) {
            if (null !== x && typeof (x) == 'object') {
                x[propertyName] = $.isFunction(data) ? data() : data;
                return x;
            }
            else {
                var temp = {};
                temp[propertyName] = $.isFunction(data) ? data() : data;
                return temp;
            }
        });
    };

    Rx.Observable.prototype.ConvertProperty = function (propertyFrom, propertyTo, transistorFunc) {
        return this.Select(function(x) {
            if (x.hasOwnProperty(propertyFrom) && $.isFunction(transistorFunc)) {
                x[propertyTo] = transistorFunc(x[propertyFrom]);
            }

            return x;
        });
    };
    
    Rx.Observable.prototype.SelectThenThrottledSelect = function (firstSelect, throttleMs, throttledSelect) {
        return this.Let(function(left){
            return left
                       .Select(firstSelect)
                       .Merge(left
                                .Throttle(throttleMs)
                                .Select(throttledSelect)
                       );
        });
    };