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
    html += `<div class="${context.classes.currentClass}">`;
    html += getOptionHTML(context);
    html += `</div>`;
    return html;
}

/**
 * Add/update dropdown HTML based on original select
 */
export function updateDropdownHTML(context){
    context.dropdown = context.wrapper.querySelector(`.${context.classes.dropdownClass}`);
    if(context.dropdown){
        context.dropdown.detach();
    }

    // new dropdown HTML
    //context.wrapper.append(getDropdownHTML(context));
    context.wrapper.innerHTML += getDropdownHTML(context);

    // save new dropdown element
    context.dropdown = context.wrapper.querySelector(`.${context.classes.dropdownClass}`);

    // on option click
    if(!context.dropdown){
        console.error('Dropdown not found!');
        return;
    }
    context.dropdown.querySelectorAll(`[${context.atts.optionAttr}]`).forEach(option => {
        option.addEventListener('click', event => {
            context.update(option.getAttribute(context.atts.optionAttr));
        });
    });
}

/**
 * Dropdown HTML
 * @returns {string}
 */
export function getDropdownHTML(context){
    let html = '';

    // generate html
    html += `<div class="${context.classes.dropdownClass}">`;
    html += `<ul>`;
    for(const option of context.selectTagData){
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

    let classList = context.classes.optionClass;
    classList += ' ' + (isActive ? context.classes.optionActiveClass : '');
    classList += ' ' + (option['isDisabled'] ? context.classes.optionDisabledClass : '');

    let html = '';
    html += `<div class="${classList}" ${context.atts.optionAttr}="${option['value']}">`;
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