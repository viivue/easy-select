/**!
 * Easy Select v3.0.0
 * https://github.com/viivue/easy-select
 * MIT license - 2021
 */
;(function($, window, document, undefined){
    const pluginName = "easySelect",
        defaults = {
            target: '', // jQuery element
            theme: 'default',
            classes: '',
            customDropdown: true, // remove native dropdown
            closeOnChange: true, // for custom dropdown only, close dropdown on change value
            dev: false,
            customDropdownItem: (data) => {
            },
            onInit: () => {
            },
            onChange: () => {
            }
        };

    // The actual plugin constructor
    function Plugin(element, options){
        this.element = $(element);
        this.options = {...defaults, ...options};

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }


    /**
     * Init
     */
    Plugin.prototype.init = function(){
        console.log(this.getOptionData(this.element))
    }


    Plugin.prototype.createCustomSelect = function(){
    };


    /**
     * Get option data
     * @returns {*[]}
     */
    Plugin.prototype.getOptionData = function(select){
        const data = [];
        select.find('option').each((index, element) => {
            const $this = $(element);
            const label = $this.text();
            const value = $this.val();
            const id = this.stringToSlug(value) + '-' + index;
            const isSelected = value === select.val();
            data.push({id, label, value, isSelected, index});
        });
        return data;
    }


    /**
     * String to slug
     * https://stackoverflow.com/a/1054862/10636614
     * @param string
     * @returns {string}
     */
    Plugin.prototype.stringToSlug = (string = '') => {
        return string
            .toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-');
    }


    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function(options){
        return this.each(function(){
            if(!$.data(this, "plugin_" + pluginName)){
                $.data(this, "plugin_" + pluginName,
                    new Plugin(this, options));
            }
        });
    }

})(jQuery, window, document);