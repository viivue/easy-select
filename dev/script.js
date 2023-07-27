import '@viivue/atomic-css'
import 'honcau'
import './style.scss'
import '@/_style.scss'

// source script
import '@/_index'

// test script
import { testInit } from './js/test-init'
import { testLayout } from './js/test-layout'
import { testMethods } from './js/test-methods'
import { testDisabled } from './js/test-disabled'

// import package info
const packageInfo = require('../package.json')

/**
 * Update HTML
 */
// update title
const title = `${packageInfo.prettyName} v${packageInfo.version}`
document.title = `${title} - ${packageInfo.description}`
document.querySelector('[data-title]').innerHTML = title

// add HTML
const root = document.querySelector('#root')

/**
 * Test script
 */
testMethods(root)
testLayout(root)
testInit(root)
testDisabled(root)