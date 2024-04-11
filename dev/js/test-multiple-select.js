import html from "../html/multiple-select.html";

export function testMultipleSelect(root){
    root.insertAdjacentHTML('beforeend', html);

    // Init: default layout
    EasySelect.init();
}