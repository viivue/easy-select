import {findObjectInArray, uniqueId} from "./utils";
import {getCurrentHTML, getOptionHTML, updateDropdownHTML} from "./layout";
import {getSelectData, val} from "./data";

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
    if(context.select.closest(`.${context.names.wrapperClass}`).length) return;

    // create wrapper
    context.id = uniqueId();
    const wrapperHTML = `<div class="${context.names.wrapperClass} ${context.config.wrapperClass}" ${context.names.wrapperIdAttr}="${context.id}"></div>`;
    const wrapperSelector = `[${context.names.wrapperIdAttr}="${context.id}"]`;

    if(context.isWrapped){
        context.select.wrapAll(wrapperHTML);
        context.wrapper = context.select.closest(wrapperSelector);
    }else{
        $(wrapperHTML).insertAfter(context.select);
        context.wrapper = context.select.next();
    }

    // add current HTML
    context.wrapper.append(getCurrentHTML(context));
    context.current = context.wrapper.find(`.${context.names.currentClass}`);

    // on select change
    context.select.on('change', event => {
            change(context, typeof event.originalEvent !== 'undefined' ? 'originalEvent' : 'easySelectEvent');
        }
    );

    // exit if is native select
    if(context.config.nativeSelect){
        context.wrapper.addClass(context.names.wrapperNativeSelectClass);
        return;
    }

    /** Dropdown **/
    updateDropdownHTML(context);

    // hide default select
    context.select.hide();

    // on current click
    context.current.on('click', () => toggle(context));

    // on outside click
    $(document).on('click', (event) => {
        const isNotThisSelect = !$(event.target).closest(`.easy-select[${context.names.wrapperIdAttr}="${context.id}"]`).length;
        if(isNotThisSelect && context.isOpen){
            close(context);
        }
    });
}

/**
 * Execute public methods
 * @param context
 * @param string
 * @param param
 */
export function execPublicMethods(context, string, param){
    switch(string){
        case 'destroy':
            destroy(context);
            break;
        case 'refresh':
            refresh(context);
            break;
        case 'open':
            open(context);
            break;
        case 'close':
            close(context);
            break;
        case 'toggle':
            toggle(context);
            break;
        case 'disabled':
            disabled(context, param);
            break;
        case 'select':
            update(context, param);
            break;
    }
}

/**
 * Refresh
 * @param context
 */
export function refresh(context){
    context.selectData = getSelectData(context);

    // update current
    context.current.html(getOptionHTML(context));

    // if not native select
    if(!context.config.nativeSelect){
        // update dropdown
        updateDropdownHTML(context);
    }

    // Event: on refresh
    context.config.onRefresh(context);
}

/**
 * Destroy
 * Return original element
 * @param context
 */
export function destroy(context){
    if(!context.config.nativeSelect){
        context.dropdown.detach();
    }

    if(context.isWrapped){
        context.current.detach();
        context.select.unwrap();
    }else{
        context.wrapper.detach();
    }

    context.select.show();

    // Event: on destroy
    context.config.onDestroy(context);
}

/**
 * Update original and custom selects value
 * @param context
 * @param value
 */
export function update(context, value){
    // skip duplicate values
    if(value === val(context)){
        close(context);
        return;
    }

    // update value
    if(typeof findObjectInArray(context.selectData, 'value', value) !== 'undefined'){
        context.select.val(value).trigger('change');
    }else{
        if(context.config.warning) console.warn(`Option[value="${value}"] is not found in context select!`);
    }
}

/**
 * Change HTML based on selected value
 * @param context
 * @param type
 */
export function change(context, type = 'easySelectEvent'){
    // update current HTML
    context.current.html(getOptionHTML(context));

    /** Dropdown **/
    if(!context.config.nativeSelect){
        // active option
        context.dropdown.find(`[${context.names.optionAttr}]`).removeClass(context.names.optionActiveClass);
        context.dropdown.find(`[${context.names.optionAttr}="${val(context)}"]`).addClass(context.names.optionActiveClass);

        // close
        close(context);
    }

    // Event: on change
    context.config.onChange(context, type);
}

/**
 * Open dropdown
 * @param context
 */
export function open(context){
    if(context.config.nativeSelect) return;
    if(context.isOpen) return;
    context.isOpen = true;
    context.wrapper.addClass(context.names.wrapperOpenClass);

    // Event: on open
    context.config.onDropdownOpen(context);
}

/**
 * Close dropdown
 * @param context
 */
export function close(context){
    if(context.config.nativeSelect) return;
    if(!context.isOpen) return;
    context.isOpen = false;
    context.wrapper.removeClass(context.names.wrapperOpenClass);

    // Event: on close
    context.config.onDropdownClose(context);
}

/**
 * Toggle dropdown
 * @param context
 */
export function toggle(context){
    if(context.config.nativeSelect) return;
    if(context.isOpen){
        close(context);
    }else{
        open(context);
    }

    // Event: on toggle
    context.config.onDropdownToggle(context);
}

/**
 * Disable select
 * @param context
 * @param boolean
 */
export function disabled(context, boolean = true){
    context.select.prop('disabled', boolean);
    context.isDisabled = boolean;
    if(boolean){
        context.wrapper.addClass(context.names.wrapperDisabledClass);
    }else{
        context.wrapper.removeClass(context.names.wrapperDisabledClass);
    }

    // Event: on change
    context.config.onDisabled(context);
}