# Easy Select v3.0.0

<div>
<span>
   <img src="https://img.shields.io/badge/Version-v3.0.0-0088ff">
   </span>
 <a href="https://viivue.github.io/easy-select/">
   <img src="https://img.shields.io/badge/-Demo-0273A9">
   </a>
<a href="https://www.jsdelivr.com/package/gh/viivue/easy-select">
   <img src="https://data.jsdelivr.com/v1/package/gh/viivue/easy-select/badge?style=rounded">
   </a>
 </div>

## Getting started

### Download

👉 Self hosted - [Download latest release](https://github.com/viivue/easy-select/releases/latest)

```html

<link rel="stylesheet" href="./easy-select.css">
<script src="./easy-select.js"></script>
```

👉 CDN Hosted - [jsDelivr](https://www.jsdelivr.com/package/gh/viivue/easy-select)

```html
<!-- CSS (2.9 KB) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/viivue/easy-select@latest/easy-select.css">

<!-- JS (6.7 KB) -->
<script src="https://cdn.jsdelivr.net/gh/viivue/easy-select@latest/easy-select.js"></script>
```

or minified version

```html
<!-- CSS (2.5 KB) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/viivue/easy-select@latest/easy-select.min.css">

<!-- JS (3 KB) -->
<script src="https://cdn.jsdelivr.net/gh/viivue/easy-select@latest/easy-select.min.js"></script>
```

### Init

Using attribute

```html
<select data-easy-select>
```

Using jQuery

```js
const option = {
    wrapperClass: '',
    nativeSelect: false, // Choose whether use custom dropdown or keep the native select
    customDropDownOptionHTML: option => {
        // custom option HTML
        return `<span>${option['label']}</span>`;
    },
    onInit: data => {
    },
    onRefresh: data => {
    },
    onDropdownOpen: data => {
    },
    onDropdownClose: data => {
    },
    onDropdownToggle: data => {
    },
    onChange: (data, type) => {
    }
};

$select.easySelect(option);
```

## Methods

Destroy and return the original select

```js
$select.easySelect('destroy');
```

Refresh custom dropdown when the select has changes

```js
$select.easySelect('refresh');
```

Open/close/toggle dropdown

```js
$select.easySelect('open');
$select.easySelect('close');
$select.easySelect('toggle');
```

## Changelog

### [3.0.0] - 2021-11-04

- Refactor plugin structure

### [2.1.1] - 2021-09-08

- Move pre-init to inside jQuery scope

### [2.1.0] - 2021-08-27

- Convert to a jQuery plugin
- Add option `customDropdownItem`

### [2.0] - 2021-08-06

- Refactor with ES6 syntax
- Add event `onInit` and return more data for events
- Fix bug: close other selects when one is opened
- Add class `first-option-selected`

### [1.3] - 2021-07-26

- Able to init using attribute `[data-easy-select]`
- Set default target to `$("[data-easy-select]")`

### [1.2] - 2021-06-23

- Disable native select and add a custom dropdown (exactly like the way Nice Select works).

### [1.1] - 2021-06-15

- Support Gravity Form.

### [1.0] - 2021-05-11

- The very first version.