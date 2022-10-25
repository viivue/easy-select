import {createEl, insertAfter, uniqueId, wrapAll} from "./utils";
import {getCurrentHTML, updateDropdownHTML} from "./layout";

/****************************************************
 ********************** Methods *********************
 ***************************************************/
/**
 * Init
 * @param context
 */
export function init(context){
    context.config.beforeInit(context);
    create(context);
    context.config.onInit(context);
}


/**
 * Create
 * @param context
 */
export function create(context){
    // check valid HTML: exit if already created
    let wrapper = context.selectTag.closest(`.${context.classes.wrapperClass}`);
    if(wrapper && wrapper.length) return;

    // create wrapper
    context.id = uniqueId();
    wrapper = createEl({
        className: `${context.classes.wrapperClass} ${context.config.wrapperClass}`
    });
    wrapper.setAttribute(context.atts.wrapperIdAttr, context.id);
    //const wrapperHTML = `<div class="${context.classes.wrapperClass} ${context.config.wrapperClass}" ${context.atts.wrapperIdAttr}="${context.id}"></div>`;
    //const wrapperSelector = `[${context.atts.wrapperIdAttr}="${context.id}"]`;

    if(context.isWrapped){
        wrapAll(context.selectTag, wrapper);
    }else{
        insertAfter(wrapper, context.selectTag);
    }
    context.wrapper = wrapper;

    // add current HTML
    context.wrapper.innerHTML += getCurrentHTML(context);

    // exit if is native select
    if(context.config.nativeSelect){
        context.wrapper.addClass(context.classes.wrapperNativeSelectClass);
        return;
    }

    /** Dropdown **/
    updateDropdownHTML(context);

    // hide default select
    // re-query selectTag due to DOM-redraw
    context.selectTag = context.wrapper.querySelector('select');
    context.selectTag.style.display = 'none';

    // on select change
    context.selectTag.addEventListener('change', event => {
        context.change(context, typeof event.originalEvent !== 'undefined' ? 'originalEvent' : 'easySelectEvent');
    });

    // on current click
    context.current = context.wrapper.querySelector(`.${context.classes.currentClass}`);
    context.current.addEventListener('click', () => context.toggle());

    // on outside click
    jQuery(document).on('click', (event) => {
        const isNotThisSelect = !jQuery(event.target).closest(`.easy-select[${context.atts.wrapperIdAttr}="${context.id}"]`).length;
        if(isNotThisSelect && context.isOpen){
            context.close();
        }
    });
}