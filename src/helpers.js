import {isJSON} from "@/utils";

/**
 * Get JSON options
 * ID priority: data-attribute > selector#id > unique id
 * @version 0.0.1
 * @returns {object}
 */
export function getOptions(context, defaultOptions){
    const numeric = []; // convert these props to float
    const wrapper = context.selectTag;

    // options from attribute
    let dataAttribute = wrapper.getAttribute(context.atts.init);
    let options = {};

    // data attribute doesn't exist or not JSON format -> string
    if(!dataAttribute || !isJSON(dataAttribute)){
        // reassign id
        const id = dataAttribute || wrapper.id || defaultOptions.id;
        context.id = id;
        defaultOptions.id = id;

        return defaultOptions;
    }

    options = JSON.parse(dataAttribute);

    for(const [key, value] of Object.entries(options)){
        // convert boolean string to real boolean
        if(value === "false") options[key] = false;
        else if(value === "true") options[key] = true;
        // convert string to float
        else if(numeric.includes(key) && typeof value === 'string' && value.length > 0) options[key] = parseFloat(value);
        else options[key] = value;
    }

    // reassign id
    const id = options.id || wrapper.id || defaultOptions.id;
    context.id = id;
    options.id = id;

    options = {...defaultOptions, ...options};

    // remove json
    wrapper.removeAttribute(context.atts.init);

    return options;
}