/**
 * Created by Serhii_Kotyk on 12/9/14.
 */
String.prototype.endsWith = function(substring){
    return this.lastIndexOf(substring) == this.length - substring.length;
};