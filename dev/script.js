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
    const $dropdown = $('[data-easy-select]');
    $dropdown.append('<option value="Porsche">Porsche</option>');
    $dropdown.append('<option value="Hyundai">Hyundai</option>');
    $dropdown.append('<option value="Thaco">Thaco</option>');
    $dropdown.append('<option value="KIA">KIA</option>');
    $dropdown.append('<option value="Photon">Photon</option>');
    $dropdown.easySelect('refresh');

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