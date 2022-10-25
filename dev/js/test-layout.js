import html from "../html/layout.html";

export function testLayout(root){
    root.insertAdjacentHTML('beforeend', html);

    EasySelect.init('#layout-native', {
        nativeSelect: true,
        warning: true,
        onChange: (data, type) => {
            console.log(type, data.value)
        }
    });
}