Node.prototype.isClass = function(className){
    if ( typeof(className) === 'string' ){
        var index = this.className.indexOf(className);
        if ( index == 0 ){
            if (this.className === className){
                return true;
            }else if (this.className.length > className.length){
                return this.className[className.length] === ' ';
            }else{
                return false;
            }
        }else if ( index > 0 ){
            if ( index + className.length == this.className.length
                && this.className[index - 1] === ' '){ // in the end
                 return true;
            } else if ( index + className.length < this.className.length
                && this.className[index - 1] === ' '
                && this.className[index + className.length] === ' '){//in the middle
                return true;
            } else{
                return false;
            }
        }else if ( index == -1){
            return false;
        }
    }else{
        return false;
    }
};

Node.prototype.addClass = function(className){
   if ( typeof(className) === 'string' ){
       if ( !this.isClass(className) ){
           if ( this.className.length == 0 ){
               this.className = className;
           }else{
               this.className += ' ' + className;
           }
       }
   }
};

Node.prototype.removeClass = function(className){
    if ( typeof(className) === 'string' ){
        if ( this.className.length > 0 ){
            this.className = this.className.replace(className, '').replace('  ', ' ');
        }
    }
};

Node.prototype.toggleClass = function(className){
    if ( typeof(className) === 'string' ){
        if (this.isClass(className)){
            this.removeClass(className);
        }else{
            this.addClass(className);
        }
    }
};

Node.prototype.insertAfter = function (referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
};