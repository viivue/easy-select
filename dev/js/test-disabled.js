import html from "../html/disabled.html";

export function testDisabled(root){
    root.insertAdjacentHTML('beforeend', html);

    // Init: default attribute
    EasySelect.init();
}