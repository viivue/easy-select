import {uniqueId} from "./utils";
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
    if(context.select.closest(`.${context.classes.wrapperClass}`).length) return;

    // create wrapper
    context.id = uniqueId();
    const wrapperHTML = `<div class="${context.classes.wrapperClass} ${context.config.wrapperClass}" ${context.atts.wrapperIdAttr}="${context.id}"></div>`;
    const wrapperSelector = `[${context.atts.wrapperIdAttr}="${context.id}"]`;

    if(context.isWrapped){
        context.select.wrapAll(wrapperHTML);
        context.wrapper = context.select.closest(wrapperSelector);
    }else{
        jQuery(wrapperHTML).insertAfter(context.select);
        context.wrapper = context.select.next();
    }

    // add current HTML
    context.wrapper.append(getCurrentHTML(context));
    context.current = context.wrapper.find(`.${context.classes.currentClass}`);

    // on select change
    context.select.on('change', event => {
            context.change(context, typeof event.originalEvent !== 'undefined' ? 'originalEvent' : 'easySelectEvent');
        }
    );

    // exit if is native select
    if(context.config.nativeSelect){
        context.wrapper.addClass(context.classes.wrapperNativeSelectClass);
        return;
    }

    /** Dropdown **/
    updateDropdownHTML(context);

    // hide default select
    context.select.hide();

    // on current click
    context.current.on('click', () => context.toggle());

    // on outside click
    jQuery(document).on('click', (event) => {
        const isNotThisSelect = !jQuery(event.target).closest(`.easy-select[${context.atts.wrapperIdAttr}="${context.id}"]`).length;
        if(isNotThisSelect && context.isOpen){
            context.close();
        }
    });
}