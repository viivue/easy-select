import {getIndex, getMultipleSelectedValues, getSelectedOption, stringToSlug} from "./utils";

/****************************************************
 ********************** Data *********************
 ***************************************************/

/**
 * Get value
 * @param context
 * @param type
 * @returns {*}
 */
export function val(context, type = 'string'){
    const valueArray = getMultipleSelectedValues(context.selectTag);
    let value;

    switch(type){
        case "array":
            value = valueArray;
            break;
        default:
            // string
            if(valueArray.length === 1){
                value = valueArray[0]; // => "value"
            }else if(valueArray.length > 1){
                value = valueArray.join(','); // => "value1,value2"
            }else{
                value = ''; // => ""
            }
    }

    context.value = value;
    return context.value;
}

/**
 * Get select data
 * @returns {*[]}
 */
export function getSelectData(context){
    const data = [];
    context.selectTag.querySelectorAll('option').forEach(option => {
        data.push(getOptionData(context, option));
    });
    return data;
}

/**
 * Get option data
 * @returns {{isSelected: boolean, index: *, id: string, label: *, value: (*|string|number|string[])}}
 */
export function getOptionData(context, option = undefined){
    if(typeof option === 'undefined'){
        // return selected option
        option = getSelectedOption(context.selectTag);
    }

    const label = option.innerText;
    const value = option.value;
    const index = getIndex(option);
    const id = stringToSlug(value) + '-' + index;
    const isSelected = val(context, 'array').includes(value); // tested with multi select
    const el = option;
    const isDisabled = option.disabled;

    return {id, label, value, isSelected, isDisabled, index, el};
}