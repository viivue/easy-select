/**
 * Easy Select v2.1.1
 * https://github.com/viivue/easy-select
 * MIT license - 2021
 */

(function($){
    $.fn.easySelect = function(options){
        const settings = $.extend({
            target: $(this), // jQuery element
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
        }, options);

        // check exit
        if(!settings.target.length) return;

        // loop each select tag
        settings.target.each(function(){
            const $thisSelect = $(this);
            const getValue = () => $thisSelect.val();
            const getReturnData = () => ({
                target: $wrapper,
                select: $thisSelect,
                value: optionsData[getValue()],
                data: optionsData,
            });
            const optionsData = {};

            // update theme, prioritize data from attribute
            let theme = $thisSelect.attr('data-easy-select');
            if(typeof theme === 'undefined' || !theme.length){
                theme = settings.theme;
            }

            // skip if installed
            if($thisSelect.hasClass('easy-select-installed')) return;
            $thisSelect.addClass('easy-select-installed');

            // check type
            if(settings.customDropdown){
                settings.classes += ' easy-select-custom';
            }else{
                settings.classes += ' easy-select-native';
            }

            // save options to object
            $thisSelect.find('option').each(function(index){
                const value = $(this).attr('value');
                optionsData[value] = {
                    index: index,
                    name: $(this).text(),
                    isSelected: value === getValue(),
                    value: value,
                    el: $(this)
                };
            });

            // create wrapper
            $thisSelect.wrapAll(`<div class="easy-select theme-${theme} ${settings.classes}"></div>`);
            const $wrapper = $thisSelect.parent();

            // create selected option
            $wrapper.prepend(`<div class="easy-select-current">${optionsData[getValue()].name}</div>`);
            const $current = $wrapper.find('.easy-select-current');


            // trigger init event
            settings.onInit(getReturnData());

            // check first option selected
            if(optionsData[getValue()].index === 0){
                $wrapper.addClass('first-option-selected');
            }


            /**
             * Custom dropdown item HTML
             */
            const getOptionHtml = (option) => {
                let optionHtml = option.name;
                if(settings.customDropdown){
                    const customHtml = settings.customDropdownItem(option);
                    if(typeof customHtml !== "undefined" && customHtml.length){
                        optionHtml = customHtml;
                    }
                }
                return optionHtml;
            };

            /**
             * Update HTML and status
             */
            const update = () => {
                // save selected value
                for(let key in optionsData){
                    optionsData[key].isSelected = getValue() === optionsData[key].value;
                }

                // trigger on change event
                settings.onChange(getReturnData());

                // update current text
                $current.html(getOptionHtml(optionsData[getValue()]));

                // update dropdown active item
                $wrapper.find(`[data-value]`).removeClass('active');
                $wrapper.find(`[data-value="${getValue()}"]`).addClass('active');

                // check first option selected
                if(optionsData[getValue()].index === 0){
                    $wrapper.addClass('first-option-selected');
                }else{
                    $wrapper.removeClass('first-option-selected');
                }
            };
            update();


            /**
             * Default select
             */
            $thisSelect.on('change', update);


            /**
             * Custom dropdown
             */
            if(settings.customDropdown){
                // generate dropdown HTML
                let dropdown = '<div class="easy-select-dropdown"><ul>';
                for(let key in optionsData){
                    dropdown += `<li><a href="${key}" data-value="${key}">`;
                    dropdown += getOptionHtml(optionsData[key]);
                    dropdown += `</a></li>`;
                }
                dropdown += '</ul></div>';
                $wrapper.append(dropdown);

                // update on load
                $wrapper.find(`[data-value="${getValue()}"]`).addClass('active');

                // on dropdown item click
                const $dropdownItem = $wrapper.find('[data-value]');
                $dropdownItem.on('click', function(e){
                    e.preventDefault();
                    const newValue = $(this).attr('data-value');

                    // update selected value, then trigger change event
                    $thisSelect.val(newValue).trigger('change');

                    // close on change
                    if(settings.closeOnChange){
                        $wrapper.removeClass('show-dropdown');
                    }
                });

                // hide default select
                $thisSelect.hide();

                // open/close dropdown
                const isOpen = false;
                $current.on('click', function(){
                    if(isOpen){
                        $wrapper.removeClass('show-dropdown');
                    }else{
                        $('.easy-select').removeClass('show-dropdown');
                        $wrapper.addClass('show-dropdown');
                    }
                });

                // close dropdown on outside click
                $(document).on('click', function(event){
                    let $target = $(event.target);
                    if(!$target.closest('.easy-select').length && $wrapper.is(":visible") && $wrapper.hasClass('show-dropdown')){
                        $wrapper.removeClass('show-dropdown');
                    }
                });
            }


            /**
             * Dev
             */
            if(settings.dev) console.log({
                target: $wrapper,
                select: $thisSelect,
                value: getValue(),
                data: optionsData
            });
        });
    };

    $('[data-easy-select]').easySelect();
    
})(jQuery);