import {createEl, debounce, setCSS, removeAccents} from "./utils";
import {CLASSES} from "./configs"

/**
 *  Init search inside dropdown
 *  @param {object} context
 * */
export function initSearchDropdown(context){
    const searchInputEl = createEl({tag: 'input', className: CLASSES.searchInput});
    const searchWrapperEl = createEl({className: CLASSES.searchWrapper});
    const emptySearchTextEl = createEl({className: CLASSES.searchEmpty});
    searchInputEl.placeholder = context.options.searchPlaceHolder;
    emptySearchTextEl.textContent = context.options.emptySearchText;
    emptySearchTextEl.style.display = 'none';

    // append to the dropdown
    searchWrapperEl.appendChild(searchInputEl);
    context.dropdown.prepend(searchWrapperEl);
    context.dropdown.appendChild(emptySearchTextEl);

    // add search enabled class for wrapper
    context.wrapper.classList.add(CLASSES.searchEnabled);

    // handle search change
    searchInputEl.addEventListener('input', debounce(() => onSearchChange(context, searchInputEl.value, emptySearchTextEl)));

    // Focus search input whenever open the select
    context.on('open', () => {
        // cannot focus on invisible input => wait 50ms
        setTimeout(() => {
            searchInputEl.focus();
        }, 50)
    });
}


/**
 * Check if option value is including input search value
 * */
function isOptionIncludesInputSearch(optionValue, inputSearchValue){
    return removeAccents(optionValue.toLowerCase()).includes(removeAccents(inputSearchValue.toLowerCase()))
}

/**
 * Handle Search
 * */
function onSearchChange(context, inputSearchValue, emptySearchTextEl){
    const arrayShow = [];
    const arrayHide = [];
    context.selectTagData.forEach(data => {
            const optionElement = context.dropdown.querySelector(`[data-es-option="${data.value}"]`).closest("li");
            isOptionIncludesInputSearch(data.label, inputSearchValue) ? arrayShow.push(optionElement) : arrayHide.push(optionElement);
        }
    )
    setCSS(arrayShow, {'display': ''});
    setCSS(arrayHide, {'display': 'none'});

    // show and hide empty search text element
    setCSS(emptySearchTextEl, {'display': arrayShow.length === 0 ? '' : 'none'});
}
