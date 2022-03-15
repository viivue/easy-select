/**!
 * Easy Select v3.0.1
 * https://github.com/viivue/easy-select
 * MIT license - 2021
 */
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
    const names = {
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

    // The actual plugin constructor
    function EasySelect(element, options){
        this.select = $(element);
        this.config = {...defaults, ...options};
        this.isOpen = false;
        this.isDisabled = false;
        this.value = this.val();
        this.isWrapped = this.config.wrapDefaultSelect && !this.config.nativeSelect;
        this.selectData = this.getSelectData();

        if(this.config.nativeSelect && this.config.wrapDefaultSelect){
            this.isWrapped = true;
            console.warn(`Default select must be wrapped in Native select mode.`);
        }

        this.init();
    }


    /****************************************************
     ********************** Methods *********************
     ***************************************************/
    EasySelect.prototype.init = function(){
        this.config.beforeInit(this);
        this.create();
        this.config.onInit(this);
    }

    EasySelect.prototype.create = function(){
        // check valid HTML: exit if already created
        if(this.select.closest(`.${names.wrapperClass}`).length) return;

        // create wrapper
        this.id = this.uniqueId();
        const wrapperHTML = `<div class="${names.wrapperClass} ${this.config.wrapperClass}" ${names.wrapperIdAttr}="${this.id}"></div>`;
        const wrapperSelector = `[${names.wrapperIdAttr}="${this.id}"]`;

        if(this.isWrapped){
            this.select.wrapAll(wrapperHTML);
            this.wrapper = this.select.closest(wrapperSelector);
        }else{
            $(wrapperHTML).insertAfter(this.select);
            this.wrapper = this.select.next();
        }

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
        this.updateDropdownHTML();

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
    };

    /**
     * Execute public methods
     * @param string
     * @param param
     */
    EasySelect.prototype.execPublicMethods = function(string, param){
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
    };

    /**
     * Refresh
     */
    EasySelect.prototype.refresh = function(){
        this.selectData = this.getSelectData();

        // update current
        this.current.html(this.getOptionHTML());

        // if not native select
        if(!this.config.nativeSelect){
            // update dropdown
            this.updateDropdownHTML();
        }

        // Event: on refresh
        this.config.onRefresh(this);
    };

    /**
     * Destroy
     * Return original element
     */
    EasySelect.prototype.destroy = function(){
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
    };

    /**
     * Update original and custom selects value
     * @param value
     */
    EasySelect.prototype.update = function(value){
        // skip duplicate values
        if(value === this.val()){
            this.close();
            return;
        }

        // update value
        if(typeof this.findObjectInArray(this.selectData, 'value', value) !== 'undefined'){
            this.select.val(value).trigger('change');
        }else{
            if(this.config.warning) console.warn(`Option[value="${value}"] is not found in this select!`);
        }
    };

    /**
     * Change HTML based on selected value
     */
    EasySelect.prototype.change = function(type = 'easySelectEvent'){
        // update current HTML
        this.current.html(this.getOptionHTML());

        /** Dropdown **/
        if(!this.config.nativeSelect){
            // active option
            this.dropdown.find(`[${names.optionAttr}]`).removeClass(names.optionActiveClass);
            this.dropdown.find(`[${names.optionAttr}="${this.val()}"]`).addClass(names.optionActiveClass);

            // close
            this.close();
        }

        // Event: on change
        this.config.onChange(this, type);
    };

    /**
     * Open dropdown
     */
    EasySelect.prototype.open = function(){
        if(this.config.nativeSelect) return;
        if(this.isOpen) return;
        this.isOpen = true;
        this.wrapper.addClass(names.wrapperOpenClass);

        // Event: on open
        this.config.onDropdownOpen(this);
    };

    /**
     * Close dropdown
     */
    EasySelect.prototype.close = function(){
        if(this.config.nativeSelect) return;
        if(!this.isOpen) return;
        this.isOpen = false;
        this.wrapper.removeClass(names.wrapperOpenClass);

        // Event: on close
        this.config.onDropdownClose(this);
    };

    /**
     * Toggle dropdown
     */
    EasySelect.prototype.toggle = function(){
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
    EasySelect.prototype.disabled = function(boolean = true){
        this.select.prop('disabled', boolean);
        this.isDisabled = boolean;
        if(boolean){
            this.wrapper.addClass(names.wrapperDisabledClass);
        }else{
            this.wrapper.removeClass(names.wrapperDisabledClass);
        }

        // Event: on change
        this.config.onDisabled(this);
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
     * Add/update dropdown HTML based on original select
     */
    EasySelect.prototype.updateDropdownHTML = function(){
        this.dropdown = this.wrapper.find(`.${names.dropdownClass}`);
        if(this.dropdown.length){
            this.dropdown.detach();
        }

        // new dropdown HTML
        this.wrapper.append(this.getDropdownHTML());

        // save new dropdown element
        this.dropdown = this.wrapper.find(`.${names.dropdownClass}`);

        // on option click
        this.dropdown.find(`[${names.optionAttr}]`).on('click', (event) => {
            this.update($(event.currentTarget).attr(`${names.optionAttr}`));
        });
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
        const isActive = typeof option !== 'undefined' && option['value'] === this.val();

        // return selected option
        if(typeof option === 'undefined'){
            option = this.getOptionData();
        }

        let classList = names.optionClass;
        classList += ' ' + (isActive ? names.optionActiveClass : '');
        classList += ' ' + (option['isDisabled'] ? names.optionDisabledClass : '');

        let html = '';
        html += `<div class="${classList}" ${names.optionAttr}="${option['value']}">`;
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
     * Get value
     * @returns {*}
     */
    EasySelect.prototype.val = function(){
        this.value = this.select.val();
        return this.value;
    }

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
        const isSelected = value === this.val();
        const el = $option;
        const isDisabled = $option.is(':disabled');

        return {id, label, value, isSelected, isDisabled, index, el};
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

    /**
     * Find object in array that match key => value
     * @param array
     * @param key
     * @param value
     * @returns {*}
     */
    EasySelect.prototype.findObjectInArray = (array, key, value) => {
        return array.find(x => x[key] === value);
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