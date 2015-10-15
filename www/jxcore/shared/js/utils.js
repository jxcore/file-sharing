(function (exports) {

    var utils = {

        merge: function (as, excludeInstances) {
            var copy = {};
            this.extend(copy, as, excludeInstances);
            return copy;
        },

        extend: function (a, bs, excludeInstances) {
            excludeInstances = excludeInstances || [Array];
            for (var i = 0, b; b = bs[i]; i++)
                for (var prop in b)
                    if (b.hasOwnProperty(prop)) {
                        var isInstanceOfExcluded = false;
                        if (excludeInstances)
                            for (var j = 0; j < excludeInstances.length; j++)
                                if (b[prop] instanceof excludeInstances[j])
                                    isInstanceOfExcluded = true;

                        if (typeof b[prop] === 'object' && b[prop] !== null && !isInstanceOfExcluded) {
                            a[prop] = a[prop] !== undefined ? a[prop] : {};
                            this.extend(a[prop], [b[prop]], excludeInstances);
                        } else
                            a[prop] = b[prop];
                    }
            return a;
        },

        setProp: function (obj, prop, value) {
            var parts = prop.split('.');
            var _ref = obj;
            for (var i = 0, part; part = parts[i]; i++)
                if (i === parts.length - 1)
                    _ref[part] = value;
                else
                    _ref = (_ref[part] = _ref[part] || {});
        },

        getProp: function (obj, prop) {
            var parts = prop.split('.');
            var _ref = obj;
            for (var i = 0, part; part = parts[i]; i++)
                if (i === parts.length - 1)
                    return _ref[part];
                else
                    _ref = _ref[part] || {};
        },

        findOne: function (ar, query, fn) {
            for (var i = 0, a; a = ar[i]; i++) {
                var m = this.matchesQuery(a, query);
                if (m) {
                    if (fn) fn(a, i);
                    return a;
                }
            }

            if (fn) fn(null);
            return null;
        },

        matchesQuery: function (obj, query) {
            switch (typeof query) {
                case 'object':
                    for (var prop in query) {
                        var val = this.getProp(obj, prop);
                        if (val !== query[prop])
                            return false;
                    }
                    return true;
                case 'function':
                    return query(obj);
            }
        },

        find: function (ar, query, fn) {
            var results = [];
            for (var i = 0, a; a = ar[i]; i++)
                if (this.matchesQuery(a, query))
                    results.push(a);

            if (fn) fn(results);
            return results;
        },

        contains: function (ar, obj, comparer) {
            for (var i = 0, a; a = ar[i]; i++)
                if (this.equals(a, obj, comparer))
                    return true;
            return false;
        },

        any: function (items, query) {
            for (var i = 0, item; item = items[i]; i++)
                if (this.matchesQuery(item, query))
                    return true;
            return false;
        },

        union: function (ar1, ar2, comparer, fn) {
            var results = [];
            for (var i = 0; i < ar1.length; i++)
                results.push(ar1[i]);
            for (var i = 0; i < ar2.length; i++) {
                var isNotInAr1 = !this.contains(ar1, ar2[i], comparer);
                if (isNotInAr1)
                    results.push(ar2[i]);
            };
            if (fn) fn(results);
            return results;
        },

        except: function (ar1, ar2, comparer, fn) {
            var results = [];
            for (var i = 0; i < ar1.length; i++) {
                var a = ar1[i];
                if (!this.contains(ar2, a, comparer))
                    results.push(a);
            }
            if (fn) fn(results);
            return results;
        },

        max: function (ar) {
            var max;
            for (var i = 0; i < ar.length; i++) {
                var a = ar[i];
                if (typeof max === 'undefined' || a > max)
                    max = a;
            }
            return max;
        },

        isNull: function (x) {
            return x === null;
        },

        isUndefined: function (x) {
            return x === undefined;
        },

        isEmptyString: function (x) {
            return x === '';
        },

        isString: function (x) {
            return typeof x === 'string';
        },

        isNonEmptyString: function (x) {
            return this.isString(x) && x.length > 0;
        },

        equals: function (item1, item2, comparer) {
            if (this.isNullOrUndefined(item1) || this.isNullOrUndefined(item2))
                return false;
            else if (typeof comparer === 'function')
                return comparer(item1, item2);
            else if (typeof comparer === 'object') {
                var val1 = this.getProp(item1, comparer);
                var val2 = this.getProp(item2, comparer);
                return val1 === val2;
            } else
                return item1 === item2;
        },

        chain: function (fn) {
            return function () {
                fn.apply(this, arguments);
                return this;
            };
        },

        noop: function () {
            
        }
    };

    utils.extend(exports, [utils]);

})(typeof module !== 'undefined' ? module.exports : (window.utils = {}));
