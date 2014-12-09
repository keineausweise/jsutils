/**
 * returns uniq id
 */
function uniqId(){
    uniqId.counter = uniqId.counter || 0;
    uniqId.prefix = uniqId.prefix || "uid";

    return uniqId.prefix + uniqId.counter++;
}