/**
 * Instantiate new object with parameters
 * @param cosntr
 * @param args
 * @returns {Constr} instanceof constructor
 */
function applyConstruct(cosntr, args, context){
    function F() {
        return cosntr.apply(context || this, args);
    }
    F.prototype = cosntr.prototype;
    return new F();
}

/**
 *
 * Creates a function in global scope which when called
 * creates object
 * if parent is defined
 *          as a new instance of parent
 * else
 *          as empty object
 * then creates a new object using
 * constructor method and copies references to properties of that new object
 * as properties of new previously created object.
 *
 * As a result a new object is created with copies of properties and functions
 * of parent object if it exists and copies of properties and functions
 * of object created by a constructor = truly merged-by-override object
 *
 * The gotten function can be called as a cosntructor of an object e.g.
 *
 * EXAMPLE:
 *
 *      Class('A', function(){this.name = 'John'})
 *
 *      new A() -> {name: 'John'}
 *
 *      Class('B', function(this.surname = 'Doe'), 'A')
 *
 *      new B() -> {name: 'John', surname: 'Doe'}
 *
 *
 *  Each time you use new ClassName() it is guaranteed that you
 *  will recieve a completely new Object with no scope conflicts
 *
 *
 * @param {String} name class name
 * @param {Function} construct cunstructor of a class
 * @param {String/Function} parent parent of class (BETTER FUNCTION)
 * @constructor
 */
function Class(name, construct, parent){
    if ('string' === typeof(name)
        && 'function' === typeof(construct)){

        if ('string' === typeof parent){
            parent = Class.getByName(parent);
        }

        //now parent is a function

        var f = function (){
            var parentInstance = null;

            //instantiate object as a parent
            if (parent){
                parentInstance = applyConstruct(parent, arguments);
            }

            //override all parent fields with child fields
            var extender = applyConstruct(construct, arguments, parentInstance);

            if (parentInstance){
                for(var key in parentInstance){
                    this[key] = parentInstance[key];
                }
                this.super = applyConstruct(parent, arguments);
            }

            for(var key in extender){
                this[key] = extender[key];
            }

        };

        Class.namespace(name);
        eval(name + ' = ' +f.toString()+ ';');

        Class[name] = Class.namespace(name);

        //if parent is defined
        if('function' === typeof parent){
            Class[name].prototype = new parent();
        }

        Class.namespace.set(name, Class[name]);
        return Class[name];
    }else if('string' === typeof name){
        return Class.getByName(name);
    } else{
        throw new Error("Class should have name and cosntructor. " + JSON.stringify({
            name: name,
            constructor: construct,
            parent: parent
        }));
    }
}

/**
 * Creates an object hirearchy by following namespace
 * @param {String/Array} package
 */
Class.namespace = function (package, context){
    context = context || window;

    var parts = package instanceof Array ? package : package.split('.');
    if (parts instanceof Array
        && parts.length > 0){
        if (!context[parts[0]]){
            context[parts[0]] = {};
        }

        if (parts.length == 1){
            return context[parts[0]];
        } else if(parts.length > 1){
            return Class.namespace(parts, context[parts.splice(0, 1)]);
        }
    }

    return context;
};

/**
 * returns last part of namespace
 * @param {String/Array} package
 * @returns {String} namespace part
 */
Class.namespace.lastName = function (package){
    var parts = package instanceof Array ? package : package.split('.');
    if (parts instanceof Array
        && parts.length > 0){
        return parts[parts.length - 1];
    }else{
        return package;
    }
};

/**
 * returns namespace but for last part of namespace
 * @param {String/Array} package
 * @returns {Object} namespace part but for the last one
 */
Class.namespace.lastButOne = function (package){
    var parts = package instanceof Array ? package : package.split('.');
    if (parts instanceof Array
        && parts.length > 0){
        Class.namespace(package);
        parts.splice(parts.length - 1, 1);
        return Class.namespace(parts);
    }else{
        return window;
    }
};

/**
 * Sets value of object by namespace
 * @param namespace string or array namespace
 * @param value object or function
 */
Class.namespace.set = function(namespace, value){
    Class.namespace.lastButOne(namespace)[Class.namespace.lastName(namespace)] = value;
};

Class.getByName = function(name){
    return Class[name] || window[name];
};

/**
 *
 * @param name Class name
 * @param constr constructor
 * @param parent parent class
 * @constructor
 */
Class.Singleton = function(name, constr, parent){
    if (!parent || 'function' === typeof parent){
        var singleTonConstructor = Class(name, constr, parent);
        Class.namespace.set(name, new singleTonConstructor());
    } else if ('object' === typeof parent){
        var parentClone = clone(parent);
        constr.call(parentClone);
        Class.namespace.set(name, parentClone);
    }
};