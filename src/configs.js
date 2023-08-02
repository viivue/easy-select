import {uniqueId} from "./utils";

/**
 * Classes
 * */
export const CLASSES = {
  wrapper: 'easy-select',
  dropdownOpen: 'es-dropdown-open',
  current: 'es-current',
  dropdown: 'es-dropdown',
  option: 'es-option',
  active: 'es-active',
  disabled: 'es-disabled',
  nativeSelect: 'es-native',
  enabled: 'es-enabled',
  ignore: 'es-ignore',
  search: 'es-search',
  searchEnabled: 'es-search-enabled',
  searchWrapper: 'es-search-wrapper',
  searchEmpty: 'es-search-empty',
}
/**
 * Attributes
 * */
export const ATTRS = {
  init: 'data-easy-select',
  wrapperID: 'data-es-id',
  optionAttr: 'data-es-option',
  value: 'data-es-value',
}
/**
 * Defaults
 * */
export const DEFAULTS = {
  id: uniqueId('es-'),
  nativeSelect: false,
  warning: true,
  log: true,
  wrapDefaultSelect: true,
  closeOnChange: true,
  align: "left",

  // show search input inside dropdown
  search: false,

  customDropDownOptionHTML: option => {
  },
};