/**
 * Returns freezed value getter of variable, like iterator in a loop
 * @param value
 */
function FixedValueGetter(value){
    return function(){return value};
}

/**
 * Clones object
 * @param obj object to clone
 * @return {Object} object clone
 */
function clone(obj){
    if(obj == null || typeof(obj) != 'object')
        return obj;

    var temp = obj.constructor() || new obj.constructor(); // changed

    for(var key in obj)
        temp[key] = clone(obj[key]);
    return temp;
}