import { getOptionData, val } from './data'
import { initSearchDropdown } from './search'
import { CLASSES, ATTRS } from './config'

/****************************************************
 ********************** HTML *********************
 ***************************************************/

/**
 * Current HTML
 * @returns {string}
 */
export function getCurrentHTML(context){
  let html = ''
  html += `<div class='${CLASSES.current}'>`
  html += getOptionHTML(context)
  html += `</div>`
  return html
}

/**
 * Add/update dropdown HTML based on original select
 */
export function updateDropdownHTML(context){
  context.dropdown = context.wrapper.querySelector(`.${CLASSES.dropdown}`)
  if(context.dropdown) context.dropdown.remove()

  // new dropdown HTML
  context.wrapper.insertAdjacentHTML('beforeend', getDropdownHTML(context))

  // save new dropdown element
  context.dropdown = context.wrapper.querySelector(`.${CLASSES.dropdown}`)

  // on option click
  if(!context.dropdown){
    console.error('Dropdown not found!')
    return
  }
  context.dropdown.querySelectorAll(`[${ATTRS.optionAttr}]`).forEach(option => {
    option.addEventListener('click', () => {
      const value = option.getAttribute(ATTRS.optionAttr)
      const optionData = context.selectTagData.filter(e => e.value === value)[0]
      if(optionData.isDisabled) return
      context.select(value)
    })
  })

  // update search inside dropdown
  if(context.config.search){
    initSearchDropdown(context)
  }
}

/**
 * Dropdown HTML
 * @returns {string}
 */
export function getDropdownHTML(context){
  let html = ''

  // generate html
  html += `<div class='${CLASSES.dropdown}'>`
  html += `<ul>`
  for(const option of context.selectTagData){
    html += `<li>`
    html += getOptionHTML(context, option)
    html += `</li>`
  }
  html += `</ul>`
  html += `</div>`

  return html
}

/**
 * Option HTML
 * @param context
 * @param option
 * @returns {string}
 */
export function getOptionHTML(context, option = undefined){
  // is active
  const isActive = typeof option !== 'undefined' && option['value'] === val(context)

  // return selected option
  if(typeof option === 'undefined'){
    option = getOptionData(context)
  }

  let classList = CLASSES.option
  classList += ' ' + (isActive ? CLASSES.active : '')
  classList += ' ' + (option['isDisabled'] ? CLASSES.disabled : '')

  let html = ''
  html += `<div class='${classList}' ${ATTRS.optionAttr}='${option['value']}'>`
  html += getOptionInnerHTML(context, option)
  html += `</div>`
  return html
}

/**
 * Option inner HTML
 * @param context
 * @param option
 * @returns {string}
 */
export function getOptionInnerHTML(context, option){
  let html = context.config.customDropDownOptionHTML(option)

  if(typeof html === 'undefined'){
    html = `<span>${option['label']}</span>`
  }

  return html
}