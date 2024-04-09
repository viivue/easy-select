import {getIndex, getSelectedOption, stringToSlug} from "./utils";

/****************************************************
 ********************** Data *********************
 ***************************************************/

/**
 * Get value
 * @returns {*}
 */
export function val(context){
    context.value = context.selectTag.value;

    // todo: get multiple values
    if(context.options.multiple){
        let result = [];
        let options = context.selectTag && context.selectTag.options;
        let opt;

        for(let i = 0, iLen = options.length; i < iLen; i++){
            opt = options[i];

            if(opt.selected){
                result.push(opt.value || opt.text);
            }
        }
        console.log("result: ", result);
        return result;
    }
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
    const isSelected = value === val(context);
    const el = option;
    const isDisabled = option.disabled;

    return {id, label, value, isSelected, isDisabled, index, el};
}