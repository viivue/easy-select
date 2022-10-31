import html from "../html/layout.html";

export function testLayout(root){
    root.insertAdjacentHTML('beforeend', html);

    // Init: default layout
    EasySelect.init();

    // Options with custom HTML
    EasySelect.init('#layout-custom-options', {
        customDropDownOptionHTML: option => {
            const colorCode = option.el.dataset.color;

            let html = '<div class="option-color">';
            html += `<span class="color" style="background-color:${colorCode}">${colorCode}</span>`;
            html += `<span>${option.label}</span>`;
            html += '</div>';

            return html;
        }
    });
}