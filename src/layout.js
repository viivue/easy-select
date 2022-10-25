import {getOptionData, val} from "./data";

/****************************************************
 ********************** HTML *********************
 ***************************************************/

/**
 * Current HTML
 * @returns {string}
 */
export function getCurrentHTML(context){
    let html = '';
    html += `<div class="${context.names.currentClass}">`;
    html += getOptionHTML(context);
    html += `</div>`;
    return html;
}

/**
 * Add/update dropdown HTML based on original select
 */
export function updateDropdownHTML(context){
    context.dropdown = context.wrapper.find(`.${context.names.dropdownClass}`);
    if(context.dropdown.length){
        context.dropdown.detach();
    }

    // new dropdown HTML
    context.wrapper.append(getDropdownHTML(context));

    // save new dropdown element
    context.dropdown = context.wrapper.find(`.${context.names.dropdownClass}`);

    // on option click
    context.dropdown.find(`[${context.names.optionAttr}]`).on('click', (event) => {
        context.update(jQuery(event.currentTarget).attr(`${context.names.optionAttr}`));
    });
}

/**
 * Dropdown HTML
 * @returns {string}
 */
export function getDropdownHTML(context){
    let html = '';

    // generate html
    html += `<div class="${context.names.dropdownClass}">`;
    html += `<ul>`;
    for(const option of context.selectData){
        html += `<li>`;
        html += getOptionHTML(context, option);
        html += `</li>`;
    }
    html += `</ul>`;
    html += `</div>`;

    return html;
}

/**
 * Option HTML
 * @param context
 * @param option
 * @returns {string}
 */
export function getOptionHTML(context, option = undefined){
    // is active
    const isActive = typeof option !== 'undefined' && option['value'] === val(context);

    // return selected option
    if(typeof option === 'undefined'){
        option = getOptionData(context);
    }

    let classList = context.names.optionClass;
    classList += ' ' + (isActive ? context.names.optionActiveClass : '');
    classList += ' ' + (option['isDisabled'] ? context.names.optionDisabledClass : '');

    let html = '';
    html += `<div class="${classList}" ${context.names.optionAttr}="${option['value']}">`;
    html += getOptionInnerHTML(context, option);
    html += `</div>`;
    return html;
}

/**
 * Option inner HTML
 * @param context
 * @param option
 * @returns {string}
 */
export function getOptionInnerHTML(context, option){
    let html = context.config.customDropDownOptionHTML(option);

    if(typeof html === 'undefined'){
        html = `<span>${option['label']}</span>`;
    }

    return html;
}