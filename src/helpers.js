import {isJSON} from "./utils";
import {eventData} from "./methods";
import {ATTRS} from './configs'

/**
 * Get JSON options
 * ID priority: data-attribute > selector#id > unique id
 * @version 0.0.1
 * @returns {object}
 */
export function getOptions(context, defaultOptions){
    if(!defaultOptions){
        defaultOptions = context.options || context.config || {};
    }

    const numeric = ['autoShow']; // convert these props to float
    const wrapper = context.selectTag;

    // options from attribute
    let dataAttribute = wrapper.getAttribute(ATTRS.init);
    let options = {};

    // data attribute doesn't exist or not JSON format -> string
    const attributeIsNotJSON = !dataAttribute || !isJSON(dataAttribute);

    // data attribute is not json format or string
    if(attributeIsNotJSON){
        options = {...defaultOptions};

        // data attribute exist => string
        if(dataAttribute) options.id = dataAttribute;
        else options.id = '';
    }else{
        options = JSON.parse(dataAttribute);

        for(const [key, value] of Object.entries(options)){
            // convert boolean string to real boolean
            if(value === "false") options[key] = false;
            else if(value === "true") options[key] = true;
            // convert string to float
            else if(numeric.includes(key) && typeof value === 'string' && value.length > 0) options[key] = parseFloat(value);
            else options[key] = value;
        }
    }

    // reassign id
    const id = options.id || wrapper.id || defaultOptions.id;
    context.id = id;
    options.id = id;

    options = {...defaultOptions, ...options};

    return options;
}
