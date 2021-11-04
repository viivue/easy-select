/**!
 * Easy Select v3.0.0
 * https://github.com/viivue/easy-select
 * MIT license - 2021
 */
;(function($, window, document, undefined){
    const pluginName = "easySelect";
    const defaults = {
        wrapperClass: '',
        nativeSelect: false,
        customDropDownOptionHTML: option => {
        },
        onInit: data => {
        },
        onChange: (data, type) => {
        }
    };
    const names = {
        wrapperClass: 'easy-select',
        wrapperOpenClass: 'show-dropdown',
        wrapperIdAttr: 'data-easy-select-id',
        currentClass: 'easy-select-current',
        dropdownClass: 'easy-select-dropdown',
        optionClass: 'easy-select-option',
        optionAttr: 'data-easy-select-option',
        optionActiveClass: 'active',
        wrapperNativeSelectClass: 'easy-select-native'
    };

    // The actual plugin constructor
    function EasySelect(element, options){
        this.select = $(element);
        this.config = {...defaults, ...options};
        this.isOpen = false;
        this.value = this.select.val();
        console.log(element)
        this.init();

        return {
            destroy: () => this.destroy()
        }
    }


    /****************************************************
     ********************** Methods *********************
     ***************************************************/
    EasySelect.prototype.init = function(){
        this.create();
        this.config.onInit(this);
    }

    EasySelect.prototype.create = function(){
        // check valid HTML: exit if already created
        if(this.select.closest(`.${names.wrapperClass}`).length) return;

        // create wrapper
        this.selectData = this.getSelectData();
        this.id = this.uniqueId();
        this.select.wrapAll(`<div class="${names.wrapperClass} ${this.config.wrapperClass}" ${names.wrapperIdAttr}="${this.id}"></div>`);
        this.wrapper = this.select.closest(`[${names.wrapperIdAttr}="${this.id}"]`);

        // add current HTML
        this.wrapper.append(this.getCurrentHTML());
        this.current = this.wrapper.find(`.${names.currentClass}`);

        // on select change
        this.select.on('change', event => {
                this.change(typeof event.originalEvent !== 'undefined' ? 'originalEvent' : 'easySelectEvent');
            }
        );

        // exit if is native select
        if(this.config.nativeSelect){
            this.wrapper.addClass(names.wrapperNativeSelectClass);
            return;
        }

        /** Dropdown **/
        // add dropdown HTML
        this.wrapper.append(this.getDropdownHTML());
        this.dropdown = this.wrapper.find(`.${names.dropdownClass}`);

        // hide default select
        this.select.hide();

        // on current click
        this.current.on('click', () => this.toggle());

        // on outside click
        $(document).on('click', (event) => {
            const isNotThisSelect = !$(event.target).closest(`.easy-select[${names.wrapperIdAttr}="${this.id}"]`).length;
            if(isNotThisSelect && this.isOpen){
                this.close();
            }
        });

        // on option click
        this.dropdown.find(`[${names.optionAttr}]`).on('click', (event) => {
            this.update($(event.currentTarget).attr(`${names.optionAttr}`));
        });
    };


    EasySelect.prototype.destroy = function(){
        this.current.detach();
        this.dropdown.detach();
        this.select.unwrap();
        this.select.show();
    };

    /**
     * Update original and custom selects value
     * @param value
     */
    EasySelect.prototype.update = function(value){
        // skip duplicate values
        if(value === this.select.val()) return;

        // update value
        this.select.val(value).trigger('change');
    };

    /**
     * Change HTML based on selected value
     */
    EasySelect.prototype.change = function(type = 'easySelectEvent'){
        this.value = this.select.val();

        // update current HTML
        this.current.html(this.getOptionHTML());

        /** Dropdown **/
        if(!this.config.nativeSelect){
            // active option
            this.dropdown.find(`[${names.optionAttr}]`).removeClass(names.optionActiveClass);
            this.dropdown.find(`[${names.optionAttr}="${this.value}"]`).addClass(names.optionActiveClass);

            // close
            this.close();
        }

        // Event: on change
        this.config.onChange(this, type);
    };
    EasySelect.prototype.open = function(){
        if(this.isOpen) return;
        this.isOpen = true;
        this.wrapper.addClass(names.wrapperOpenClass);
    };
    EasySelect.prototype.close = function(){
        if(!this.isOpen) return;
        this.isOpen = false;
        this.wrapper.removeClass(names.wrapperOpenClass);
    };
    EasySelect.prototype.toggle = function(){
        if(this.isOpen){
            this.close();
        }else{
            this.open();
        }
    };


    /****************************************************
     ********************** HTML *********************
     ***************************************************/
    /**
     * Current HTML
     * @returns {string}
     */
    EasySelect.prototype.getCurrentHTML = function(){
        let html = '';
        html += `<div class="${names.currentClass}">`;
        html += this.getOptionHTML();
        html += `</div>`;
        return html;
    };

    /**
     * Dropdown HTML
     * @returns {string}
     */
    EasySelect.prototype.getDropdownHTML = function(){
        let html = '';

        // generate html
        html += `<div class="${names.dropdownClass}">`;
        html += `<ul>`;
        for(const option of this.selectData){
            html += `<li>`;
            html += this.getOptionHTML(option);
            html += `</li>`;
        }
        html += `</ul>`;
        html += `</div>`;

        return html;
    };

    /**
     * Option HTML
     * @param option
     * @returns {string}
     */
    EasySelect.prototype.getOptionHTML = function(option = undefined){
        // is active
        const isActive = typeof option !== 'undefined' && option['value'] === this.select.val();

        // return selected option
        if(typeof option === 'undefined'){
            option = this.getOptionData();
        }

        let html = '';
        html += `<div class="${names.optionClass} ${isActive ? names.optionActiveClass : ''}" ${names.optionAttr}="${option['value']}">`;
        html += this.getOptionInnerHTML(option);
        html += `</div>`;
        return html;
    }

    /**
     * Option inner HTML
     * @param option
     * @returns {string}
     */
    EasySelect.prototype.getOptionInnerHTML = function(option){
        let html = this.config.customDropDownOptionHTML(option);

        if(typeof html === 'undefined'){
            html = `<span>${option['label']}</span>`;
        }

        return html;
    };


    /****************************************************
     ********************** Data *********************
     ***************************************************/
    /**
     * Get select data
     * @returns {*[]}
     */
    EasySelect.prototype.getSelectData = function(){
        const data = [];
        this.select.find('option').each((index, option) => {
            data.push(this.getOptionData($(option)));
        });
        return data;
    }

    /**
     * Get option data
     * @returns {{isSelected: boolean, index: *, id: string, label: *, value: (*|string|number|string[])}}
     */
    EasySelect.prototype.getOptionData = function($option = undefined){
        if(typeof $option === 'undefined'){
            // return selected option
            $option = this.select.find('option:selected');
        }

        const label = $option.text();
        const value = $option.val();
        const index = $option.index();
        const id = this.stringToSlug(value) + '-' + index;
        const isSelected = value === this.select.val();
        const el = $option;

        return {id, label, value, isSelected, index, el};
    };


    /****************************************************
     ********************** Helpers *********************
     ***************************************************/
    /**
     * String to slug
     * https://stackoverflow.com/a/1054862/10636614
     * @param string
     * @returns {string}
     */
    EasySelect.prototype.stringToSlug = (string = '') => {
        return string
            .toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-');
    };

    /**
     * Generate unique ID
     */
    EasySelect.prototype.uniqueId = (prefix = '') => {
        return prefix + (+new Date()).toString(16) +
            (Math.random() * 100000000 | 0).toString(16);
    };


    /****************************************************
     ********************** Export *********************
     ***************************************************/
    $.fn[pluginName] = function(options){
        return this.each(function(){
            if(!$.data(this, "plugin_" + pluginName)){
                $.data(this, "plugin_" + pluginName,
                    new EasySelect(this, options));
            }
        });
    }
    $('[data-easy-select]').easySelect();

})(jQuery, window, document);