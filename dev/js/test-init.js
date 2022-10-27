import html from "../html/init.html";

export function testInit(root){
    root.insertAdjacentHTML('beforeend', html);

    // Init: default attribute
    EasySelect.init();

    // Init: jQuery plugin
    jQuery('#init-jquery').easySelect();

    // Init: vanilla JS: DOM element
    EasySelect.init(document.querySelector('#init-vanilla-dom'));

    // Init: vanilla JS: jQuery element
    EasySelect.init(jQuery('#init-vanilla-jquery'));

    // Init: vanilla JS: CSS selector string
    EasySelect.init('#init-vanilla-string');
}