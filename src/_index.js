import {getCurrentHTML, getOptionHTML, updateDropdownHTML} from "./layout";
import {getSelectData, val} from "./data";
import {findObjectInArray, uniqueId} from "./utils";

;(function($, window, document, undefined){
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


            this.select = $(element);
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

            this.init();

            // todo: check this out
            this.dropdown = this.wrapper.find(`.${this.names.dropdownClass}`);
        }

        /****************************************************
         ********************** Methods *********************
         ***************************************************/
        init(){
            this.config.beforeInit(this);
            this.create();
            this.config.onInit(this);
        }

        create(){
            // check valid HTML: exit if already created
            if(this.select.closest(`.${this.names.wrapperClass}`).length) return;

            // create wrapper
            this.id = uniqueId();
            const wrapperHTML = `<div class="${this.names.wrapperClass} ${this.config.wrapperClass}" ${this.names.wrapperIdAttr}="${this.id}"></div>`;
            const wrapperSelector = `[${this.names.wrapperIdAttr}="${this.id}"]`;

            if(this.isWrapped){
                this.select.wrapAll(wrapperHTML);
                this.wrapper = this.select.closest(wrapperSelector);
            }else{
                $(wrapperHTML).insertAfter(this.select);
                this.wrapper = this.select.next();
            }

            // add current HTML
            this.wrapper.append(getCurrentHTML(this));
            this.current = this.wrapper.find(`.${this.names.currentClass}`);

            // on select change
            this.select.on('change', event => {
                    this.change(typeof event.originalEvent !== 'undefined' ? 'originalEvent' : 'easySelectEvent');
                }
            );

            // exit if is native select
            if(this.config.nativeSelect){
                this.wrapper.addClass(this.names.wrapperNativeSelectClass);
                return;
            }

            /** Dropdown **/
            updateDropdownHTML(this);

            // hide default select
            this.select.hide();

            // on current click
            this.current.on('click', () => this.toggle());

            // on outside click
            $(document).on('click', (event) => {
                const isNotThisSelect = !$(event.target).closest(`.easy-select[${this.names.wrapperIdAttr}="${this.id}"]`).length;
                if(isNotThisSelect && this.isOpen){
                    this.close();
                }
            });
        }

        /**
         * Execute public methods
         * @param string
         * @param param
         */
        execPublicMethods(string, param){
            switch(string){
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
        };

        /**
         * Change HTML based on selected value
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
        };

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
        };

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
        };

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
        };

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
        };

    }

    /****************************************************
     ********************** Export *********************
     ***************************************************/
    $.fn[pluginName] = function(options, param){
        return this.each(function(){
            const easySelect = $.data(this, "plugin_" + pluginName);
            if(!easySelect){
                // init
                $.data(this, "plugin_" + pluginName, new EasySelect(this, options));
            }else{
                // exec methods
                easySelect.execPublicMethods(options, param);
            }
        });
    }
    $('[data-easy-select]').easySelect();

})(jQuery, window, document);


/**
 * Private class Controller
 * This class will hold instances of the library's objects
 */
class Controller{
    constructor(){
        this.instances = [];
    }

    add(slider){
        this.instances.push(slider);
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
// window.EasySelect = {
//     // init new instances
//     init: (options = {}) => {
//         const selector = options.selector || '[data-easy-select]';
//
//         // init with selector
//         document.querySelectorAll(selector).forEach(el => {
//             window.EasySelectController.add(new EasySelect({el, ...options}));
//         });
//     },
//     // Get instance object by ID
//     get: id => window.EasySelectController.get(id)
// };
//
// window.EasySelect.init();