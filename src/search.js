import {createEl, debounce} from "./utils";

/**
 *  Init search inside dropdown
 *  @param {object} context
 * */
export function intSearchDropdown(context){
    const searchEl = createSearchElement({classes: context.classes.searchInDropdown});

    // append to the dropdown
    context.dropdown.appendChild(searchEl);

    // add search enabled class for wrapper
    context.wrapper.classList.add(context.classes.searchEnabled);

    // handle search change
    searchEl.addEventListener('input', debounce(() => handleSearchChange(context, searchEl.value)));
}


/**
 * Create search element
 * @return HTMLElement
 * */
function createSearchElement({classes = ''}){
    return createEl({tag: 'input', className: classes});
}


/**
 * Handle Search
 * */
function handleSearchChange(context, value){
    context.selectTagData.forEach(data => {
        // contain search value
        if(data.value.includes(value)){
            context.dropdown.querySelector(`li:nth-child(${data.index + 1})`).style.display = 'block';
        }else{
            context.dropdown.querySelector(`li:nth-child(${data.index + 1})`).style.display = 'none';
        }
    });
}
