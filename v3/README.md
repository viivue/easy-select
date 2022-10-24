# Easy Select v3.1.0

[![release](https://badgen.net/github/release/viivue/easy-select/)](https://github.com/viivue/easy-select/releases/latest)
[![minified](https://badgen.net/badge/minified/8KB/cyan)](https://www.jsdelivr.com/package/gh/viivue/easy-select)
[![jsdelivr](https://data.jsdelivr.com/v1/package/gh/viivue/easy-select/badge?style=rounded)](https://www.jsdelivr.com/package/gh/viivue/easy-select)
[![license](https://badgen.net/github/license/viivue/easy-select/)](https://github.com/viivue/easy-select/blob/main/LICENSE)

> A jQuery-plugin to customize select tag.

## Getting started

### Download

👉 Self hosted - [Download the latest release](https://github.com/viivue/easy-select/releases/latest)

```html

<link rel="stylesheet" href="./easy-select.css">
<script src="./easy-select.js"></script>
```

👉 CDN Hosted - [jsDelivr](https://www.jsdelivr.com/package/gh/viivue/easy-select)

```html
<!-- CSS (3 KB) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/viivue/easy-select@3.1.0/build/easy-select.css">

<!-- JS (14 KB) -->
<script src="https://cdn.jsdelivr.net/gh/viivue/easy-select@3.1.0/build/easy-select.js"></script>
```

or minified version

```html
<!-- CSS (2 KB) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/viivue/easy-select@3.1.0/dist/easy-select.min.css">

<!-- JS (6 KB) -->
<script src="https://cdn.jsdelivr.net/gh/viivue/easy-select@3.1.0/dist/easy-select.min.js"></script>
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
    nativeSelect: false, // keep the native select
    warning: false, // allow to show warning in console log
    wrapDefaultSelect: true, // allow to wrap the default select tag
    customDropDownOptionHTML: option => {
        // custom option HTML
        return `<span>${option['label']}</span>`;
    },
    onInit: data => {
    },
    onRefresh: data => {
    },
    onChange: (data, type) => {
    },
    onDestroy: data => {
    },
    onDisabled: data => {
    },
    onDropdownOpen: data => {
    },
    onDropdownClose: data => {
    },
    onDropdownToggle: data => {
    },
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

Select by option's value

```js
$select.easySelect('select', 'lorem');
```

Disable/enable

```js
$select.easySelect('disabled', true); // disable
$select.easySelect('disabled', false); // enable
```

## Deployment

```shell
npm install
```

```shell
gulp serve
```

## License

[MIT License](https://github.com/viivue/easy-select/blob/master/LICENSE)

Copyright (c) 2022 ViiVue