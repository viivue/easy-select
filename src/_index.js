import {getSelectData, val} from "./data";
import {init} from "./methods";
import {getOptionHTML, updateDropdownHTML} from "./layout";
import {findObjectInArray} from "./utils";

const pluginName = "easySelect";
const defaults = {
    wrapperClass: '',
    nativeSelect: false,
    warning: false,
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
    constructor(element, options){
        this.names = {
            wrapperClass: 'easy-select',
            wrapperOpenClass: 'show-dropdown',
            wrapperIdAttr: 'data-easy-select-id',
            currentClass: 'easy-select-current',
            dropdownClass: 'easy-select-dropdown',
            optionClass: 'easy-select-option',
            optionAttr: 'data-easy-select-option',
            optionActiveClass: 'active',
            optionDisabledClass: 'disabled',
            wrapperNativeSelectClass: 'easy-select-native',
            wrapperDisabledClass: 'easy-select-disabled'
        };

        this.select = jQuery(element);
        this.config = {...defaults, ...options};
        this.isOpen = false;
        this.isDisabled = false;
        this.value = val(this);
        this.isWrapped = this.config.wrapDefaultSelect && !this.config.nativeSelect;
        this.selectData = getSelectData(this);

        if(this.config.nativeSelect && this.config.wrapDefaultSelect){
            this.isWrapped = true;
            console.warn(`Default select must be wrapped in Native select mode.`);
        }

        init(this);

        // todo: check this out
        console.log('select', this.select)
        console.log('wrapper', this.selectData)
        this.dropdown = this.wrapper.find(`.${this.names.dropdownClass}`);
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
                this.update(param);
                break;
        }
    }


    /**
     * Refresh
     */
    refresh(){
        this.selectData = getSelectData(this);

        // update current
        this.current.html(getOptionHTML(this));

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
        if(!this.config.nativeSelect){
            this.dropdown.detach();
        }

        if(this.isWrapped){
            this.current.detach();
            this.select.unwrap();
        }else{
            this.wrapper.detach();
        }

        this.select.show();

        // Event: on destroy
        this.config.onDestroy(this);
    }

    /**
     * Update original and custom selects value
     * @param value
     */
    update(value){
        // skip duplicate values
        if(value === val(this)){
            this.close();
            return;
        }

        // update value
        if(typeof findObjectInArray(this.selectData, 'value', value) !== 'undefined'){
            this.select.val(value).trigger('change');
        }else{
            if(this.config.warning) console.warn(`Option[value="${value}"] is not found in this select!`);
        }
    }

    /**
     * Change HTML based on selected value
     * @param type
     */
    change(type = 'easySelectEvent'){
        // update current HTML
        this.current.html(getOptionHTML(this));

        /** Dropdown **/
        if(!this.config.nativeSelect){
            // active option
            this.dropdown.find(`[${this.names.optionAttr}]`).removeClass(this.names.optionActiveClass);
            this.dropdown.find(`[${this.names.optionAttr}="${val(this)}"]`).addClass(this.names.optionActiveClass);

            // close
            this.close();
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
        this.isOpen = true;
        this.wrapper.addClass(this.names.wrapperOpenClass);

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
        this.wrapper.removeClass(this.names.wrapperOpenClass);

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
        this.select.prop('disabled', boolean);
        this.isDisabled = boolean;
        if(boolean){
            this.wrapper.addClass(this.names.wrapperDisabledClass);
        }else{
            this.wrapper.removeClass(this.names.wrapperDisabledClass);
        }

        // Event: on change
        this.config.onDisabled(this);
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
            if(el.hasAttribute('data-easy-select-id')){
                id = el.getAttribute('data-easy-select-id');
            }else{
                const wrapper = el.closest('[data-easy-select-id]');
                id = wrapper ? wrapper.getAttribute('data-easy-select-id') : id;
            }

            if(id){
                const easySelect = window.EasySelect.get(id);
                // exec methods
                console.log(`jquery: found Easy Select [${id}]`, el, options, param)
                easySelect.execPublicMethods(options, param);
            }else{
                console.log(`jquery: init Easy Select`, el, options, param)
                // init
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

    add(instance){
        this.instances.push(instance);
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
            const selector = '[data-easy-select]';
            document.querySelectorAll(selector).forEach(el => {
                window.EasySelectController.add(new EasySelect(el, options));
            });
            return;
        }

        // init single element
        window.EasySelectController.add(new EasySelect(el, options));
    },
    // Get instance object by ID
    get: id => window.EasySelectController.get(id)
};

window.EasySelect.init();