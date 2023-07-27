/****************************************************
 ********************** Helpers *********************
 ***************************************************/

/**
 * String to slug
 * https://stackoverflow.com/a/1054862/10636614
 * @param string
 * @returns {string}
 */
export function stringToSlug(string = ''){
    return string
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-')
}

/**
 * Generate unique ID
 */
export function uniqueId(prefix = ''){
    return prefix + (+new Date()).toString(16) +
      (Math.random() * 100000000 | 0).toString(16)
}

/**
 * Find object in array that match key => value
 * @param array
 * @param key
 * @param value
 * @returns {*}
 */
export function findObjectInArray(array, key, value){
    return array.find(x => x[key] === value)
}


/**
 * Is jQuery element
 * @param element : HTMLElement
 * @returns {boolean}
 */
export function isjQueryElement(element){
    return typeof jQuery !== 'undefined' && element instanceof jQuery
}


export function getIndex(element){
    return Array.prototype.findIndex.call(element.parentElement.children, (c) => c === element)
}

export function insertAfter(newNode, referenceNode){
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling)
    return newNode
}

export function wrapAll(innerNode, outerNode){
    const outer = insertAfter(outerNode, innerNode)
    outer.innerHTML = innerNode.outerHTML
    innerNode.remove()

    return outer
}

export function createEl({ tag = 'div', className = '' }){
    const el = document.createElement(tag)

    className.split(' ').forEach(classItem => {
        if(classItem.length){
            el.classList.add(classItem)
        }
    })

    return el
}

export function prepend(innerEl, outerEl){
    outerEl.insertBefore(innerEl, outerEl.children[0])
    return outerEl
}

export function getSelectedOption(selectTag){
    return selectTag.options[selectTag.selectedIndex]
}

export function getSelectTag(el){
    if(isjQueryElement(el)) return el.get()[0]

    if(typeof el === 'string') return document.querySelector(el)

    return el
}

/**
 * Check if value is an empty string
 * @param value
 * @returns {boolean}
 */
export function isEmptyString(value){
    return typeof value === 'string' && value.length === 0
}

/**
 * Is JSON string
 * https://stackoverflow.com/a/32278428/6453822
 * @param string
 * @returns {any|boolean}
 */
export function isJSON(string){
    try{
        return (JSON.parse(string) && !!string)
    }catch(e){
        return false
    }
}


/**
 * Debounce (ignore all, run the last)
 * https://www.freecodecamp.org/news/javascript-debounce-example/
 * @param func
 * @param timeout
 * @returns {(function(...[*]): void)|*}
 */
export function debounce(func, timeout = 150){
    let timer
    return (...args) => {
        clearTimeout(timer)
        timer = setTimeout(() => {
            func.apply(this, args)
        }, timeout)
    }
}