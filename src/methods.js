import {createEl, insertAfter, isEmptyString, isJSON, wrapAll} from "./utils";
import {getCurrentHTML, updateDropdownHTML} from "./layout";

/****************************************************
 ********************** Methods *********************
 ***************************************************/
/**
 * Init
 * @param context
 */
export function init(context){
    context.config.beforeInit(eventData(context, 'beforeInit'));

    // create HTML
    create(context);

    // alignment
    checkAlignmentOption(context);

    context.config.onInit(eventData(context, 'onInit'));
}


/**
 * Add class for dropdown alignment
 * @param context
 */
function checkAlignmentOption(context){
    // native select will have no alignment
    if(context.config.nativeSelect) return;

    context.config.align.split(' ').forEach(align => {
        if(align !== 'left') context.wrapper.classList.add(`es-align-${align}`);
    });
}


/**
 * Data return from an event
 * @param context
 * @param eventName
 * @param obj
 * @returns {*&{instance, eventName}}
 */
export function eventData(context, eventName, obj){
    return {
        instance: context,
        eventName,
        ...obj
    }
}


/**
 * Create
 * @param context
 */
export function create(context){
    // check valid HTML: exit if already created
    let wrapper = context.selectTag.closest(`.${context.classes.wrapper}`);
    if(wrapper && wrapper.length) return;

    // create wrapper
    wrapper = createEl({
        className: `${context.classes.wrapper} ${context.config.wrapper}`
    });
    wrapper.setAttribute(context.atts.wrapperID, context.id);

    if(context.isWrapped){
        wrapAll(context.selectTag, wrapper);
    }else{
        insertAfter(wrapper, context.selectTag);
    }
    context.wrapper = wrapper;

    // add current HTML
    context.wrapper.insertAdjacentHTML('beforeend', getCurrentHTML(context));

    // exit if is native select
    if(context.config.nativeSelect){
        context.wrapper.classList.add(context.classes.nativeSelect);
        assignSelectOnChange(context);
        return;
    }

    /** Dropdown **/
    updateDropdownHTML(context);

    // hide default select
    assignSelectOnChange(context);
    context.selectTag.style.display = 'none';

    // on current click
    context.current.addEventListener('click', () => context.toggle());
}


/**
 * Get ID from attribute
 * @param context
 * @returns {*|string}
 */
export function getID(context){
    // id (priority: attribute > options > auto-generate)
    let id = context.selectTag.getAttribute(context.atts.init);

    // string from init attribute always be treated as ID
    if(isJSON(id)) return context.config.id;

    // ID priority: attribute > js object > default
    id = id !== null && !isEmptyString(id) ? id : context.config.id;
    return id;
}

export function getOptions(context, options){
    // options from attribute
    let string = context.selectTag.getAttribute(context.atts.init);

    // option priority: attribute > js object > default
    if(isJSON(string)) options = {...options, ...JSON.parse(string)};

    // convert boolean string to real boolean
    for(const [key, value] of Object.entries(options)){
        if(value === "false") options[key] = false;
        if(value === "true") options[key] = true;
    }

    return options;
}

/**
 * Fire on change event manually
 * @param context
 */
export function fireOnChangeEvent(context){
    context.selectTag.dispatchEvent(new Event('change', {bubbles: true}));
}


/**
 * re-query to avoid DOM-redraw
 * @param context
 */
function updateElements(context){
    // select tag
    context.selectTag = context.wrapper.querySelector('select');

    // current element
    context.current = context.wrapper.querySelector(`.${context.classes.current}`);
}

function assignSelectOnChange(context){
    // re-query elements
    updateElements(context);

    // on select change
    context.selectTag.addEventListener('change', event => {
        context.change(context, typeof event.originalEvent !== 'undefined' ? 'originalEvent' : 'easySelectEvent');
    });
}