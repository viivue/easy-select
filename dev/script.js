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

/**
 * Lib test
 */
// Init: jQuery plugin
$('#init-jquery').easySelect();

// Init: vanilla JS: DOM element
EasySelect.init(document.querySelector('#init-vanilla-dom'));

// Init: vanilla JS: jQuery element
EasySelect.init($('#init-vanilla-jquery'));

// Init: vanilla JS: CSS selector string
EasySelect.init('#init-vanilla-string');