import {createEl, debounce, setCSS} from "./utils";
import {CLASSES} from "./configs"

/**
 *  Init search inside dropdown
 *  @param {object} context
 * */
export function initSearchDropdown(context){
    const searchInputEl = createEl({tag: 'input', className: CLASSES.searchInput});
    const searchWrapperEl = createEl({className: CLASSES.searchWrapper});
    const emptySearchTextEl = createEl({className: CLASSES.searchEmpty});
    searchInputEl.placeholder = context.config.searchPlaceHolder;
    emptySearchTextEl.textContent = context.config.emptySearchText;
    emptySearchTextEl.style.display = 'none';

    // append to the dropdown
    searchWrapperEl.appendChild(searchInputEl);
    context.dropdown?.prepend(searchWrapperEl);
    context.dropdown.appendChild(emptySearchTextEl);

    // add search enabled class for wrapper
    context.wrapper.classList.add(CLASSES.searchEnabled);

    // handle search change
    searchInputEl.addEventListener('input', debounce(() => onSearchChange(context, searchInputEl.value, emptySearchTextEl)));
}


/**
 * Remove accents in UNICODE
 * https://www.tunglt.com/2018/11/bo-dau-tieng-viet-javascript-es6/
 * */
function removeAccents(str){
    return str.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd').replace(/Đ/g, 'D');
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
            console.log("optionElement", optionElement)
            isOptionIncludesInputSearch(data.value, inputSearchValue) ? arrayShow.push(optionElement) : arrayHide.push(optionElement);
        }
    )
    setCSS(arrayShow, {'display': ''});
    setCSS(arrayHide, {'display': 'none'});

    // show and hide empty search text element
    setCSS(emptySearchTextEl, {'display': arrayShow.length === 0 ? '' : 'none'});
}
