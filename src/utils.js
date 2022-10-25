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
        .replace(/ +/g, '-');
}

/**
 * Generate unique ID
 */
export function uniqueId(prefix = ''){
    return prefix + (+new Date()).toString(16) +
        (Math.random() * 100000000 | 0).toString(16);
}

/**
 * Find object in array that match key => value
 * @param array
 * @param key
 * @param value
 * @returns {*}
 */
export function findObjectInArray(array, key, value){
    return array.find(x => x[key] === value);
}