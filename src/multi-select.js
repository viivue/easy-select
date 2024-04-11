import {CLASSES} from "./configs";

export function initMultiSelect(context){
    // add wrapper class
    context.wrapper.classList.add(CLASSES.multipleSelect);

    // set multiple attribute
    context.selectTag.setAttribute('multiple', 'true');

    // todo: remove before release
    context.selectTag.style.display = '';
}