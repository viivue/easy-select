// public styles
import '../public/style/fonts.css';

// private style
import './style.scss';

// source script
import '@/_index';
import '@/_style.scss';

// test script
import {testInit} from "./js/test-init";
import {testLayout} from "./js/test-layout";
import {testMethods} from "./js/test-methods";

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
testMethods(root);
testLayout(root);
testInit(root);