import {getSelectData, val} from "./data";
import {fireOnChangeEvent, init} from "./methods";
import {getOptionHTML, updateDropdownHTML} from "./layout";
import {findObjectInArray, getSelectTag} from "./utils";
import {EventsManager, getOptionsFromAttribute} from "@phucbm/os-util";
import {CLASSES, ATTRS, DEFAULTS} from './configs'

const pluginName = "easySelect";

/**
 * Private class
 */
class EasySelect{
    constructor(el, options){
        this.selectTag = getSelectTag(el);
        this.originalSelectTag = this.selectTag;

        // avoid duplicate init
        if(this.selectTag.classList.contains(CLASSES.enabled)) return;

        // init events manager
        this.events = new EventsManager(this, {
            names: ['beforeInit', 'onInit', 'onRefresh', 'onChange', 'onDestroy', 'onDisable',
                'onEnable', 'onOpen', 'onClose', 'onToggle', 'onAdded']
        });

        // get options and assign ID
        this.id = options.id || this.selectTag.id || DEFAULTS.id;

        this.options = getOptionsFromAttribute({
            target: this.selectTag,
            attributeName: ATTRS.init,
            defaultOptions: {...DEFAULTS, ...options, id: this.id},
            numericValues: ['autoShow']
        });

        this.wrapper = this.selectTag.parentElement;
        this.dropdown = this.wrapper.querySelector(`.${CLASSES.dropdown}`);
        this.current = this.wrapper.querySelector(`.${CLASSES.current}`);

        this.isOpen = false;
        this.isDisabled = this.selectTag.disabled;
        this.value = val(this);
        this.isWrapped = this.options.wrapDefaultSelect && !this.options.nativeSelect;
        this.selectTagData = getSelectData(this);

        if(this.options.nativeSelect && this.options.wrapDefaultSelect){
            this.isWrapped = true;
        }

        init(this);

        this.selectTag.classList.add(CLASSES.enabled);
    }

    /**
     * Execute public methods
     * @param options
     * @param param
     * @param param2
     */
    execPublicMethods(options, param, param2 = ''){
        if(typeof options !== 'string') return;

        switch(options){
            case 'destroy':
                this.destroy();
                break;
            case 'refresh':
                this.refresh();
                break;
            case 'open':
                this.open();
                break;
            case 'close':
                this.close();
                break;
            case 'toggle':
                this.toggle();
                break;
            case 'disableOption':
                this.disableOption(param, param2);
                break;
            case 'disabled':
                this.disable(param);
                break;
            case 'select':
                this.select(param);
                break;
            case 'on':
                this.on(param, param2);
                break;
        }
    }


    /******************************
     * EVENTS
     ******************************/
    /**
     * Assign late-events
     */
    on(eventName, callback){
        this.events.add(eventName, callback);
    }


    /**
     * Toggle option disable/enable
     * @param optionValue
     * @param disabled
     */
    disableOption(optionValue, disabled){
        const option = this.selectTag.querySelector(`option[value="${optionValue}"]`);

        if(!option){
            console.warn(`Option with value "${optionValue}" is not found.`);
            return;
        }

        option.disabled = disabled;
        this.refresh();
    }


    /**
     * Remove all options and refresh
     */
    removeAllOptions(){
        this.selectTag.innerHTML = '';
        this.refresh();
    }


    /**
     * Refresh based on the select tag options
     */
    refresh(){
        if(this.isDisabled) return;
        this.selectTagData = getSelectData(this);

        if(this.selectTagData.length){
            // update current
            this.current.innerHTML = getOptionHTML(this);

            // if not native select
            if(!this.options.nativeSelect){
                // update dropdown
                updateDropdownHTML(this);
            }
        }else{
            // select with no option
        }

        // Event: on refresh
        this.events.fire('onRefresh');
    }

    /**
     * Destroy
     * Return original element
     */
    destroy(){
        if(this.isDisabled) return;

        // replace with original select tag
        this.wrapper.replaceWith(this.originalSelectTag);

        // remove from global control
        window.EasySelectController.remove(this.id);

        // Event: on destroy
        this.events.fire('onDestroy');
    }

    /**
     * Select option with value
     * @param value
     */
    select(value){
        if(this.isDisabled) return;

        // skip duplicate value
        if(value === val(this)) return;

        // value exists in data object => update value
        if(typeof findObjectInArray(this.selectTagData, 'value', value) !== 'undefined'){
            this.selectTag.value = value;
            fireOnChangeEvent(this);
            return;
        }

        // warning
        if(this.options.warning) console.warn(`Option[value="${value}"] is not found in this select!`);
    }

    /**
     * Change HTML based on selected value
     * @param type
     */
    change(type = 'easySelectEvent'){
        if(this.isDisabled) return;

        // update current HTML
        this.current.innerHTML = getOptionHTML(this);
        const newValue = val(this);

        /** Dropdown **/
        if(!this.options.nativeSelect){
            // active option
            this.dropdown.querySelectorAll(`[${ATTRS.optionAttr}]`).forEach(item => {
                item.classList.remove(CLASSES.active);
            });
            this.dropdown.querySelector(`[${ATTRS.optionAttr}="${newValue}"]`).classList.add(CLASSES.active);

            // close on change
            if(this.options.closeOnChange) this.close();
        }

        // update value attribute
        this.selectTag.setAttribute(ATTRS.value, newValue);

        // Event: on change
        this.events.fire('onChange', {type, value: newValue});
    }

    /**
     * Open dropdown
     */
    open(){
        if(this.isDisabled) return;
        if(this.options.nativeSelect) return;
        if(this.isOpen) return;

        // close all opening dropdown
        window.EasySelectController.closeAll();

        this.isOpen = true;
        this.wrapper.classList.add(CLASSES.dropdownOpen);

        // Event: on open
        this.events.fire('onOpen');
    }

    /**
     * Close dropdown
     */
    close(){
        if(this.isDisabled) return;
        if(this.options.nativeSelect) return;
        if(!this.isOpen) return;
        this.isOpen = false;
        this.wrapper.classList.remove(CLASSES.dropdownOpen);

        // Event: on close
        this.events.fire('onClose');
    }

    /**
     * Toggle dropdown
     */
    toggle(){
        if(this.isDisabled) return;
        if(this.options.nativeSelect) return;

        // Event: on toggle
        this.events.fire('onToggle', {isOpen: !this.isOpen});

        if(this.isOpen){
            this.close();
        }else{
            this.open();
        }
    }

    /**
     * Disable select
     * @param boolean
     */
    disable(boolean = true){
        this.selectTag.disabled = boolean;
        this.isDisabled = boolean;

        if(boolean){
            this.wrapper.classList.add(CLASSES.disabled);

            // Event: on disable
            this.events.fire('onDisable');
        }else{
            this.wrapper.classList.remove(CLASSES.disabled);

            // Event: on enable
            this.events.fire('onEnable');
        }
    }

    /**
     * Enable select
     */
    enable(){
        this.disable(false);
    }

    /**
     * Add new option
     * @param value
     * @param label
     * @returns {boolean|EasySelect}
     */
    add(value, label = value){
        if(this.isDisabled) return false;

        // use value as label if label is empty
        if(label === "") label = value;

        // avoid duplicate value
        if(this.selectTagData.filter(option => option.value === value).length > 0){
            if(this.options.warning) console.warn(`[ES] ${value} will not be added due to duplicating`);
            return false;
        }

        // add new option to select tag
        this.selectTag.insertAdjacentHTML('beforeend', `<option value="${value}">${label}</option>`);

        // refresh
        this.refresh();

        // Event: on add
        this.events.fire('onAdded', {newValue: value});

        return this;
    }
}

/****************************************************
 ************** Export jQuery plugin ****************
 ***************************************************/
if(typeof jQuery !== 'undefined'){
    // init plugin
    jQuery.fn[pluginName] = function(options, param){
        return this.each(function(){
            const el = this;
            let id = '';
            if(el.hasAttribute(ATTRS.wrapperID)){
                id = el.getAttribute(ATTRS.wrapperID);
            }else{
                const wrapper = el.closest('[data-easy-select-id]');
                id = wrapper ? wrapper.getAttribute(ATTRS.wrapperID) : id;
            }

            if(id){
                // found id => run method
                window.EasySelect.get(id).execPublicMethods(options, param);
            }else{
                // id not found => init new instance
                window.EasySelect.init(el, options);
            }
        });
    }
}

/**
 * Private class Controller
 * This class will hold instances of the library's objects
 */
class Controller{
    constructor(){
        this.instances = [];
    }

    closeAll(){
        this.instances.filter(instance => instance.isOpen).forEach(item => item.close());
    }

    add(instance){
        this.instances.push(instance);
    }

    remove(id){
        // find index of instance
        const index = this.instances.map(e => e.id).indexOf(id);

        // remove instance
        this.instances.splice(index, 1);
    }

    get(id){
        return this.instances.filter(instance => instance.id === id)[0];
    }
}


/**
 * Public library data
 * access via window.EasySelectController
 */
window.EasySelectController = new Controller();


/**
 * Public library object
 * access via window.EasySelect
 */
window.EasySelect = {
    // init new instances
    init: (el = undefined, options = {}) => {
        // empty => init with multiple elements via attributes
        if(typeof el === 'undefined'){
            document.querySelectorAll(`[${ATTRS.init}]:not(.${CLASSES.enabled})`).forEach(el => {
                window.EasySelectController.add(new EasySelect(el, options));
            });
            return;
        }


        // string => multiple elements
        if(typeof el === 'string'){
            document.querySelectorAll(el).forEach(item => {
                window.EasySelectController.add(new EasySelect(item, options));
            });
            return;
        }

        // array =>  multiple elements
        if(typeof el.forEach !== 'undefined'){
            el.forEach(item => {
                // init single element
                window.EasySelectController.add(new EasySelect(item, options));
            });
            return;
        }

        // init single element
        window.EasySelectController.add(new EasySelect(el, options));
    }, // Get instance object by ID
    get: id => window.EasySelectController.get(id)
};

// init
window.EasySelect.init();

// on outside click
document.addEventListener('click', event => {
    const wrapper = event.target.closest(`[${ATTRS.wrapperID}]`) || event.target.closest(`.${CLASSES.ignore}`);
    if(wrapper) return;

    // close all opening dropdown
    window.EasySelectController.closeAll();
});