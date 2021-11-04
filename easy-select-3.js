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
        this.select = $(element);
        this.options = {...defaults, ...options};
        this.isOpen = false;

        this.init();

        return {
            destroy: () => this.destroy()
        }
    }


    /****************************************************
     ********************** Methods *********************
     ***************************************************/
    Plugin.prototype.init = function(){
        this.create();
        console.log(this.selectData)
    }

    Plugin.prototype.create = function(){
        // check valid HTML: exit if already created
        if(this.select.closest('.easy-select').length) return;

        // create wrapper
        this.selectData = this.getSelectData();
        this.id = this.uniqueId();
        this.select.wrapAll(`<div class="easy-select" data-easy-select-id="${this.id}"></div>`);
        this.wrapper = this.select.closest(`[data-easy-select-id="${this.id}"]`);

        // add custom HTML
        this.wrapper.append(this.getCurrentHTML());
        this.wrapper.append(this.getDropdownHTML());
        this.current = this.wrapper.find('.easy-select-current');
        this.dropdown = this.wrapper.find('.easy-select-dropdown');

        // hide default select
        this.select.hide();

        // on current click
        this.current.on('click', () => this.toggle());

        // on outside click
        $(document).on('click', (event) => {
            const isNotThisSelect = !$(event.target).closest(`.easy-select[data-easy-select-id="${this.id}"]`).length;
            if(isNotThisSelect && this.isOpen){
                this.close();
            }
        });

        // on option click
        this.dropdown.find(`[data-easy-select-option]`).on('click', (event) => {
            this.change($(event.currentTarget).attr('data-easy-select-option'));
        });
    };


    Plugin.prototype.destroy = function(){
        this.current.detach();
        this.dropdown.detach();
        this.select.unwrap();
        this.select.show();
    };

    Plugin.prototype.update = function(){

    };
    Plugin.prototype.change = function(value){
        // update value
        this.select.val(value).trigger('change');

        // active option
        this.dropdown.find(`[data-easy-select-option]`).removeClass('active');
        this.dropdown.find(`[data-easy-select-option="${value}"]`).addClass('active');

        // update current HTML
        this.current.html(this.getOptionHTML());

        // close
        this.close();
    };
    Plugin.prototype.open = function(){
        if(this.isOpen) return;
        this.isOpen = true;
        this.wrapper.addClass('show-dropdown');
    };
    Plugin.prototype.close = function(){
        if(!this.isOpen) return;
        this.isOpen = false;
        this.wrapper.removeClass('show-dropdown');
    };
    Plugin.prototype.toggle = function(){
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
    Plugin.prototype.getCurrentHTML = function(){
        let html = '';
        html += `<div class="easy-select-current">`;
        html += this.getOptionHTML();
        html += `</div>`;
        return html;
    };

    /**
     * Dropdown HTML
     * @returns {string}
     */
    Plugin.prototype.getDropdownHTML = function(){
        let html = '';

        // generate html
        html += `<div class="easy-select-dropdown">`;
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
    Plugin.prototype.getOptionHTML = function(option = undefined){
        // is active
        const isActive = typeof option !== 'undefined' && option['value'] === this.select.val();

        // return selected option
        if(typeof option === 'undefined'){
            option = this.getOptionData();
        }

        let html = '';
        html += `<div class="easy-select-option ${isActive ? 'active' : ''}" data-easy-select-option="${option['value']}">`;
        html += this.getOptionInnerHTML(option);
        html += `</div>`;
        return html;
    }

    /**
     * Option inner HTML
     * @param option
     * @returns {`<span>${string}</span>`}
     */
    Plugin.prototype.getOptionInnerHTML = function(option){
        return `<span>${option['label']}</span>`;
    };


    /****************************************************
     ********************** Data *********************
     ***************************************************/
    /**
     * Get select data
     * @returns {*[]}
     */
    Plugin.prototype.getSelectData = function(){
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
    Plugin.prototype.getOptionData = function($option = undefined){
        if(typeof $option === 'undefined'){
            // return selected option
            $option = this.select.find('option:selected');
        }

        const label = $option.text();
        const value = $option.val();
        const index = $option.index();
        const id = this.stringToSlug(value) + '-' + index;
        const isSelected = value === this.select.val();
        return {id, label, value, isSelected, index};
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
    Plugin.prototype.stringToSlug = (string = '') => {
        return string
            .toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-');
    };

    /**
     * Generate unique ID
     */
    Plugin.prototype.uniqueId = (prefix = '') => {
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
                    new Plugin(this, options));
            }
        });
    }

})(jQuery, window, document);