import {stringToSlug} from "./utils";

/****************************************************
 ********************** Data *********************
 ***************************************************/

/**
 * Get value
 * @returns {*}
 */
export function val(context){
    context.value = context.select.val();
    return context.value;
}

/**
 * Get select data
 * @returns {*[]}
 */
export function getSelectData(context){
    const data = [];
    context.select.find('option').each((index, option) => {
        data.push(getOptionData(context, jQuery(option)));
    });
    return data;
}

/**
 * Get option data
 * @returns {{isSelected: boolean, index: *, id: string, label: *, value: (*|string|number|string[])}}
 */
export function getOptionData(context, $option = undefined){
    if(typeof $option === 'undefined'){
        // return selected option
        $option = context.select.find('option:selected');
    }

    const label = $option.text();
    const value = $option.val();
    const index = $option.index();
    const id = stringToSlug(value) + '-' + index;
    const isSelected = value === val(context);
    const el = $option;
    const isDisabled = $option.is(':disabled');

    return {id, label, value, isSelected, isDisabled, index, el};
}