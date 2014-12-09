var EVENT_PREFIX = 'e_',
    DECORATOR = 'decorator';

/**
 * Builds HTML node by a tag name and with certain attributes
 *
 * @param tag tag name
 * @param attributes attributes as a Map
 * @returns {null} if no tag handled
 */
function buildElement(tag, attributes){
    if (!tag){
        throw new DOMException("Can't create element " + tag);
    }

    switch(typeof(tag)){
        case 'string':
            return buildByTag(tag, attributes);
            break;
        case 'object':
            return buildComplexElement(tag);
            break;
        default:
            throw new DOMException("Can't create element " + tag);
    }

    function buildByTag(tag, attributes){
        if (attributes){
            var atTag = attributes['_tag'];
            if(!atTag){
                attributes['_tag'] = tag;
            }

            return buildComplexElement(attributes);
        }else{
            return document.createElement(tag);
        }
    }
}

/**
 * Builds a DOM element attribute by attribute.
 * Tag of element is handled as a '_tag' property of attributes object
 *
 * @param {Object} attributes
 * @returns {Element} DOM element
 */
function buildComplexElement(attributes){
    if (attributes instanceof Array){//if array

        var templatesArray = attributes,
            children = new Array();

        for(var i = 0; i < templatesArray.length; i++){
            children.push(buildElement(templatesArray[i]));
        }

        if (children.length > 0){
            var containerDiv = buildElement('div');
            for(var i = 0; i < children.length; i++){
                containerDiv.appendChild(children[i]);
            }
            return containerDiv;
        }

    }else if(attributes != undefined && attributes != null){//if object

        var tag = attributes['_tag'];

        //if tag is null or not a string
        if (!tag || typeof (tag) !== 'string'){
            throw new Error("Can't build element with tag name " + tag);
        }

        var element = document.createElement(tag);


        if (attributes)
        //for each attribute assign it to element
            for(var key in attributes){
                var attributeName = key,
                    attributeValue = attributes[key];

                if (typeof(attributeValue) === 'function'){ //and value is function
                    if (attributeName === DECORATOR){
                        attributeValue.call(element);
                    }else if (attributeName.indexOf(EVENT_PREFIX) === 0 ){//starts with "e_"
                        var realAttribute = attributeName.replace(EVENT_PREFIX, '');
                        element[realAttribute] = attributeValue;
                    }
                }else if (attributeValue instanceof Node){
                    element.appendChild(attributeValue);
                }else if(attributeName === '_tag'){
                    if (tag !== attributeValue){
                        return buildElement(attributeValue, attributes);
                    }else{
                        continue;
                    }
                }else if (attributeName === 'innerText'){
                    element.appendChild(document.createTextNode(attributeValue));
                }else if(typeof attributeValue === 'object'){
                    element.appendChild(buildElement(attributeValue));
                }else{
                    element.setAttribute(attributeName, attributeValue);
                }
            }

        return element;
    }
}