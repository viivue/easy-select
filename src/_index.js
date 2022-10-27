import {getSelectData, val} from "./data";
import {fireOnChangeEvent, getID, init} from "./methods";
import {getOptionHTML, updateDropdownHTML} from "./layout";
import {findObjectInArray, getSelectTag} from "./utils";

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
};
const atts = {
    init: 'data-easy-select',
    wrapperID: 'data-es-id',
    optionAttr: 'data-es-option',
};
const defaults = {
    wrapper: '',
    nativeSelect: false,
    warning: true,
    wrapDefaultSelect: true,
    customDropDownOptionHTML: option => {
    },
    beforeInit: data => {
    },
    onInit: data => {
    },
    onRefresh: data => {
    },
    onChange: (data, type) => {
    },
    onDestroy: data => {
    },
    onDisabled: data => {
    },
    onDropdownOpen: data => {
    },
    onDropdownClose: data => {
    },
    onDropdownToggle: data => {
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

        this.id = getID(this);
        this.wrapper = this.selectTag.parentElement;
        this.dropdown = this.wrapper.querySelector(`.${this.classes.dropdown}`);
        this.current = this.wrapper.querySelector(`.${this.classes.current}`);

        this.config = {...defaults, ...options};
        this.isOpen = false;
        this.isDisabled = false;
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
     */
    execPublicMethods(options, param){
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
            case 'disabled':
                this.disabled(param);
                break;
            case 'select':
                this.select(value);
                break;
        }
    }


    /**
     * Refresh
     */
    refresh(){
        this.selectTagData = getSelectData(this);

        // update current
        this.current.innerHTML = getOptionHTML(this);

        // if not native select
        if(!this.config.nativeSelect){
            // update dropdown
            updateDropdownHTML(this);
        }

        // Event: on refresh
        this.config.onRefresh(this);
    }

    /**
     * Destroy
     * Return original element
     */
    destroy(){
        // replace with original select tag
        this.wrapper.replaceWith(this.originalSelectTag);

        // remove from global control
        window.EasySelectController.remove(this.id);

        // Event: on destroy
        this.config.onDestroy(this);
    }

    /**
     * Select option with value
     * @param value
     */
    select(value){
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
        // update current HTML
        this.current.innerHTML = getOptionHTML(this);

        /** Dropdown **/
        if(!this.config.nativeSelect){
            // active option
            this.dropdown.querySelectorAll(`[${this.atts.optionAttr}]`).forEach(item => {
                item.classList.remove(this.classes.active);
            });
            this.dropdown.querySelector(`[${this.atts.optionAttr}="${val(this)}"]`).classList.add(this.classes.active);
        }

        // Event: on change
        this.config.onChange(this, type);
    }

    /**
     * Open dropdown
     */
    open(){
        if(this.config.nativeSelect) return;
        if(this.isOpen) return;

        // close all opening dropdown
        window.EasySelectController.closeAll();

        this.isOpen = true;
        this.wrapper.classList.add(this.classes.dropdownOpen);

        // Event: on open
        this.config.onDropdownOpen(this);
    }

    /**
     * Close dropdown
     */
    close(){
        if(this.config.nativeSelect) return;
        if(!this.isOpen) return;
        this.isOpen = false;
        this.wrapper.classList.remove(this.classes.dropdownOpen);

        // Event: on close
        this.config.onDropdownClose(this);
    }

    /**
     * Toggle dropdown
     */
    toggle(){
        if(this.config.nativeSelect) return;
        if(this.isOpen){
            this.close();
        }else{
            this.open();
        }

        // Event: on toggle
        this.config.onDropdownToggle(this);
    }

    /**
     * Disable select
     * @param boolean
     */
    disabled(boolean = true){
        this.selectTag.prop('disabled', boolean);
        this.isDisabled = boolean;
        if(boolean){
            this.wrapper.classList.add(this.classes.disabled);
        }else{
            this.wrapper.classList.remove(this.classes.disabled);
        }

        // Event: on change
        this.config.onDisabled(this);
    }

    add(value){
        // avoid duplicate value
        if(this.selectTagData.filter(option => option.value === value).length > 0){
            if(this.config.warning) console.warn(`[ES] ${value} will not be added due to duplicating`);
            return false;
        }

        // add new option to select tag
        this.selectTag.insertAdjacentHTML('beforeend', `<option value="${value}">${value}</option>`);

        // refresh
        this.refresh();

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
        // init with multiple elements via attributes
        if(typeof el === 'undefined'){
            document.querySelectorAll(`[${atts.init}]:not(.${classes.enabled})`).forEach(el => {
                window.EasySelectController.add(new EasySelect(el, options));
            });
            return;
        }

        // init single element
        window.EasySelectController.add(new EasySelect(el, options));

        // on outside click
        document.addEventListener('click', event => {
            const wrapper = event.target.closest(`[${atts.wrapperID}]`) || event.target.closest(`.${classes.ignore}`);

            if(wrapper) return;

            // close all opening dropdown
            window.EasySelectController.closeAll();
        });
    },
    // Get instance object by ID
    get: id => window.EasySelectController.get(id)
};

window.EasySelect.init();