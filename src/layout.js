import {getOptionByValue} from "@/utils";
import {getOptionData, val} from "./data";
import {CLASSES, ATTRS} from "./configs"

/****************************************************
 ********************** HTML *********************
 ***************************************************/

/**
 * Current HTML
 * @returns {string}
 */
export function getCurrentHTML(context){
    return `<div class="${CLASSES.current}">${getCurrentInnerHTML(context)}</div>`;
}

export function getCurrentInnerHTML(context){
    let html = '';

    if(context.options.multiple){
        // current multiple
        const selectedValues = val(context, 'array');
        const labels = [];
        selectedValues.forEach(value => {
            const option = getOptionData(context, getOptionByValue(context, value));
            labels.push(option.label);
        });
        html += `<div class="${CLASSES.option}">`;
        html += `<span class="es-current-label">`;
        html += labels.join(', ');
        html += `</span>`;
        html += `</div>`;
    }else{
        // current single
        html += getOptionHTML(context);
    }

    return html;
}

/**
 * Add/update dropdown HTML based on original select
 */
export function updateDropdownHTML(context){
    context.dropdown = context.wrapper.querySelector(`.${CLASSES.dropdown}`);
    if(context.dropdown) context.dropdown.remove();

    // new dropdown HTML
    context.wrapper.insertAdjacentHTML('beforeend', getDropdownHTML(context));

    // save new dropdown element
    context.dropdown = context.wrapper.querySelector(`.${CLASSES.dropdown}`);

    // on option click
    if(!context.dropdown){
        console.error('Dropdown not found!');
        return;
    }
    context.dropdown.querySelectorAll(`[${ATTRS.optionAttr}]`).forEach(option => {
        option.addEventListener('click', () => {
            const value = option.getAttribute(ATTRS.optionAttr);
            const optionData = context.selectTagData.filter(e => e.value === value)[0];
            if(optionData.isDisabled) return;

            context.select(value);
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
    html += `<div class="${CLASSES.dropdown}">`;
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
    // tested with multi select
    const isActive = typeof option !== 'undefined' && val(context, 'array').includes(option['value']);

    // return selected option
    if(typeof option === 'undefined'){
        option = getOptionData(context);
    }

    let classList = CLASSES.option;
    classList += ' ' + (isActive ? CLASSES.active : '');
    classList += ' ' + (option['isDisabled'] ? CLASSES.disabled : '');

    let html = '';
    html += `<div class="${classList}" ${ATTRS.optionAttr}="${option['value']}">`;
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
    // return custom HTML if any
    let customHTML = context.options.customDropDownOptionHTML(option);
    if(customHTML) return customHTML;

    let html = '';

    // multiple select
    if(context.options.multiple){
        // option
        html += `<i class="es-checkbox"></i>`;
        html += `<span>${option['label']}</span>`;
        return html;
    }

    // single select
    html = `<span>${option['label']}</span>`;

    return html;
}