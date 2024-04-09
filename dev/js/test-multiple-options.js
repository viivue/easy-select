import html from "../html/multiple-options.html";

export function testMultipleOptions(root){
    root.insertAdjacentHTML('beforeend', html);

    // Init: default layout
    EasySelect.init();
}