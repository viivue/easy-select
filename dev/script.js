// public styles
import '../public/style/fonts.css';

// private style
import './style.scss';
import './easy-select.css';

// source script
import '@/_index';

// import package info
const packageInfo = require('../package.json');

/**
 * Update HTML
 */
// update title
const title = `${packageInfo.prettyName} v${packageInfo.version}`;
document.title = `[DEV] ${title} - ${packageInfo.description}`;
document.querySelector('[data-title]').innerHTML = title;
document.querySelector('[data-description]').innerHTML = packageInfo.description;

/**
 * Lib usage
 */
setTimeout(() => {
    $('[data-easy-select]').append('<option value="Porsche">Porsche</option>');
    $('[data-easy-select]').append('<option value="Huyndai">Huyndai</option>');
    $('[data-easy-select]').append('<option value="Thaco">Thaco</option>');
    $('[data-easy-select]').append('<option value="KIA">KIA</option>');
    $('[data-easy-select]').append('<option value="Photon">Photon</option>');
    $('[data-easy-select]').easySelect('refresh');

    $('#custom-options').easySelect('select', '');
}, 500);

$('#native-dropdown').easySelect({
    nativeSelect: true,
    warning: true,
    onChange: (data, type) => {
        console.log(type, data.value)
    }
});


$('#custom-options').easySelect({
    customDropDownOptionHTML: option => {
        const colorCode = option.el.data('color');

        let html = '<div class="option-color">';
        html += `<span class="color" style="background-color:${colorCode}">${colorCode}</span>`;
        html += `<span>${option.label}</span>`;
        html += '</div>';

        return html;
    },
});