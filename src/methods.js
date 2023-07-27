import { createEl, insertAfter, wrapAll } from './utils'
import { getCurrentHTML, updateDropdownHTML } from './layout'
import { val } from './data'
import { fireEvent } from './helpers'
import { initSearchDropdown } from './search'
import { CLASSES, ATTRS } from './config'

/****************************************************
 ********************** Methods *********************
 ***************************************************/
/**
 * Init
 * @param context
 */
export function init(context){
  fireEvent(context, 'beforeInit')

  // create HTML
  create(context)

  // alignment
  checkAlignmentOption(context)

  // init search dropdown
  if(context.config.search){
    initSearchDropdown(context)
  }

  // update value attribute
  context.selectTag.setAttribute(ATTRS.value, val(context))

  fireEvent(context, 'onInit')
}


/**
 * Add class for dropdown alignment
 * @param context
 */
function checkAlignmentOption(context){
  // native select will have no alignment
  if(context.config.nativeSelect) return

  context.config.align.split(' ').forEach(align => {
    if(align !== 'left') context.wrapper.classList.add(`es-align-${align}`)
  })
}


/**
 * Data return from an event
 * @param context
 * @param eventName
 * @param obj
 * @returns {*&{instance, eventName}}
 */
export function eventData(context, eventName, obj){
  return {
    instance: context,
    eventName,
    ...obj,
  }
}


/**
 * Create
 * @param context
 */
export function create(context){
  // check valid HTML: exit if already created
  let wrapper = context.selectTag.closest(`.${CLASSES.wrapper}`)
  if(wrapper && wrapper.length) return

  // create wrapper
  let wrapperClass = CLASSES.wrapper
  wrapperClass += context.isDisabled ? ' ' + CLASSES.disabled : ''
  wrapper = createEl({
    className: wrapperClass,
  })
  wrapper.setAttribute(ATTRS.wrapperID, context.id)

  if(context.isWrapped){
    wrapAll(context.selectTag, wrapper)
  }else{
    insertAfter(wrapper, context.selectTag)
  }
  context.wrapper = wrapper

  // add current HTML
  context.wrapper.insertAdjacentHTML('beforeend', getCurrentHTML(context))

  // exit if is native select
  if(context.config.nativeSelect){
    context.wrapper.classList.add(CLASSES.nativeSelect)
    assignSelectOnChange(context)
    return
  }

  /** Dropdown **/
  updateDropdownHTML(context)

  // hide default select
  assignSelectOnChange(context)
  context.selectTag.style.display = 'none'

  // on current click
  context.current.addEventListener('click', () => context.toggle())
}


/**
 * Fire on change event manually
 * @param context
 */
export function fireOnChangeEvent(context){
  context.selectTag.dispatchEvent(new Event('change', { bubbles: true }))
}


/**
 * re-query to avoid DOM-redraw
 * @param context
 */
function updateElements(context){
  // select tag
  context.selectTag = context.wrapper.querySelector('select')

  // current element
  context.current = context.wrapper.querySelector(`.${CLASSES.current}`)
}

function assignSelectOnChange(context){
  // re-query elements
  updateElements(context)

  // on select change
  context.selectTag.addEventListener('change', event => {
    context.change(context, typeof event.originalEvent !== 'undefined' ? 'originalEvent' : 'easySelectEvent')
  })
}