import {getSelectData, val} from "./data";
import {fireOnChangeEvent, init} from "./methods";
import {getOptionHTML, updateDropdownHTML} from "./layout";
import {findObjectInArray, getSelectTag, uniqueId} from "./utils";
import {fireEvent, getOptions} from "./helpers";

const pluginName = "easySelect";
const classes = {
    wrapper: 'easy-select',
    dropdownOpen: 'es-dropdown-open',
    current: 'es-current',
    dropdown: 'es-dropdown',
    option: 'es-option',
    active: 'es-active',
    disabled: 'es-disabled',
    nativeSelect: 'es-native',
    enabled: 'es-enabled',
    ignore: 'es-ignore',
    search: 'es-search',
    searchEnabled: 'es-search-enabled'
};
const atts = {
    init: 'data-easy-select',
    wrapperID: 'data-es-id',
    optionAttr: 'data-es-option',
    value: 'data-es-value',
};
const defaults = {
    id: uniqueId('es-'),
    nativeSelect: false,
    warning: true,
    log: true,
    wrapDefaultSelect: true,
    closeOnChange: true,
    align: "left",

    // show search input inside dropdown
    search: false,

    customDropDownOptionHTML: option => {
    },
    beforeInit: data => {
    },
    onInit: data => {
    },
    onRefresh: data => {
    },
    onChange: data => {
    },
    onDestroy: data => {
    },
    onDisable: data => {
    },
    onEnable: data => {
    },
    onOpen: data => {
    },
    onClose: data => {
    },
    onToggle: data => {
    },
    onAdded: data => {
    },
};


/**
 * Private class
 */
class EasySelect{
    constructor(el, options){
        this.classes = {...classes};
        this.atts = {...atts};

        this.selectTag = getSelectTag(el);
        this.originalSelectTag = this.selectTag;

        // avoid duplicate init
        if(this.selectTag.classList.contains(this.classes.enabled)) return;

        // get options and assign ID
        this.config = getOptions(this, {...defaults, ...options});

        // save late-assign events
        this.eventList = [];
        this.eventNames = [
            'beforeInit', 'onInit', 'onRefresh', 'onChange', 'onDestroy', 'onDisable',
            'onEnable', 'onOpen', 'onClose', 'onToggle', 'onAdded'
        ];

        this.wrapper = this.selectTag.parentElement;
        this.dropdown = this.wrapper.querySelector(`.${this.classes.dropdown}`);
        this.current = this.wrapper.querySelector(`.${this.classes.current}`);

        this.isOpen = false;
        this.isDisabled = this.selectTag.disabled;
        this.value = val(this);
        this.isWrapped = this.config.wrapDefaultSelect && !this.config.nativeSelect;
        this.selectTagData = getSelectData(this);

        if(this.config.nativeSelect && this.config.wrapDefaultSelect){
            this.isWrapped = true;
        }

        init(this);

        this.selectTag.classList.add(this.classes.enabled);
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
     * Assign late-events
     */
    on(eventName, callback){
        if(this.eventNames.includes(eventName)){
            // initial array
            if(typeof this.eventList[eventName] === 'undefined') this.eventList[eventName] = [];

            // save callback
            this.eventList[eventName].push(callback);
        }else{
            console.warn(`Event "${eventName}" is not recognized!`);
        }
    }


    /**
     * Refresh
     */
    refresh(){
        if(this.isDisabled) return;
        this.selectTagData = getSelectData(this);

        // update current
        this.current.innerHTML = getOptionHTML(this);

        // if not native select
        if(!this.config.nativeSelect){
            // update dropdown
            updateDropdownHTML(this);
        }

        // Event: on refresh
        fireEvent(this, 'onRefresh');
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
        fireEvent(this, 'onDestroy');
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
        if(this.config.warning) console.warn(`Option[value="${value}"] is not found in this select!`);
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
        if(!this.config.nativeSelect){
            // active option
            this.dropdown.querySelectorAll(`[${this.atts.optionAttr}]`).forEach(item => {
                item.classList.remove(this.classes.active);
            });
            this.dropdown.querySelector(`[${this.atts.optionAttr}="${newValue}"]`).classList.add(this.classes.active);

            // close on change
            if(this.config.closeOnChange) this.close();
        }

        // update value attribute
        this.selectTag.setAttribute(this.atts.value, newValue);

        // Event: on change
        fireEvent(this, 'onChange', {type, value: newValue});
    }

    /**
     * Open dropdown
     */
    open(){
        if(this.isDisabled) return;
        if(this.config.nativeSelect) return;
        if(this.isOpen) return;

        // close all opening dropdown
        window.EasySelectController.closeAll();

        this.isOpen = true;
        this.wrapper.classList.add(this.classes.dropdownOpen);

        // Event: on open
        fireEvent(this, 'onOpen');
    }

    /**
     * Close dropdown
     */
    close(){
        if(this.isDisabled) return;
        if(this.config.nativeSelect) return;
        if(!this.isOpen) return;
        this.isOpen = false;
        this.wrapper.classList.remove(this.classes.dropdownOpen);

        // Event: on close
        fireEvent(this, 'onClose');
    }

    /**
     * Toggle dropdown
     */
    toggle(){
        if(this.isDisabled) return;
        if(this.config.nativeSelect) return;

        // Event: on toggle
        fireEvent(this, 'onToggle', {isOpen: !this.isOpen});

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
            this.wrapper.classList.add(this.classes.disabled);

            // Event: on disable
            fireEvent(this, 'onDisable');
        }else{
            this.wrapper.classList.remove(this.classes.disabled);

            // Event: on enable
            fireEvent(this, 'onEnable');
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

        // avoid duplicate value
        if(this.selectTagData.filter(option => option.value === value).length > 0){
           if(this.config.warning) console.warn(`[ES] ${value} will not be added due to duplicating`);
           return false;
        }

        // add new option to select tag
        this.selectTag.insertAdjacentHTML('beforeend', `<option value='${value}'>${label}</option>`);

        // refresh
        this.refresh();

        // Event: on add
        fireEvent(this, 'onAdded', {newValue: value});

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
            if(el.hasAttribute(atts.wrapperID)){
                id = el.getAttribute(atts.wrapperID);
            }else{
                const wrapper = el.closest('[data-easy-select-id]');
                id = wrapper ? wrapper.getAttribute(atts.wrapperID) : id;
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
            document.querySelectorAll(`[${atts.init}]:not(.${classes.enabled})`).forEach(el => {
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
    const wrapper = event.target.closest(`[${atts.wrapperID}]`) || event.target.closest(`.${classes.ignore}`);
    if(wrapper) return;

    // close all opening dropdown
    window.EasySelectController.closeAll();
});