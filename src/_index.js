import {getSelectData, val} from "./data";
import {execPublicMethods, init} from "./methods";

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

            init(this);

            // todo: check this out
            this.dropdown = this.wrapper.find(`.${this.names.dropdownClass}`);

            return {
                execPublicMethods: (options, param) => execPublicMethods(this, options, param)
            }
        }

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