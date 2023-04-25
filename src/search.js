import {createEl} from "./utils";

/**
 *  Init search inside dropdown
 *  @param {object} context
 * */
export function intSearchDropdown(context){
    console.log(context);
    const searchEl = createSearchElement({classes: context.classes.searchInDropdown});

    // append to the dropdown
    context.dropdown.appendChild(searchEl);

    // toggle wrapper attribute
    context.wrapper.classList.add(context.classes.searchEnabled);

    // handle search change

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