// public styles
import '../public/style/fonts.css';

// private style
import './style.scss';
import './easy-select.css';

// source script
import '@/_index';

// test script
import {testInit} from "./js/test-init";
import {testLayout} from "./js/test-layout";

// import package info
const packageInfo = require('../package.json');

/**
 * Update HTML
 */
// update title
const title = `${packageInfo.prettyName} v${packageInfo.version}`;
document.title = `[DEV] ${title} - ${packageInfo.description}`;
document.querySelector('[data-title]').innerHTML = title;

// add HTML
const root = document.querySelector('#root');

/**
 * Test script
 */
testLayout(root);
testInit(root);