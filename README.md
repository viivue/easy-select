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
    onChange: (data, type) => {
    },
    onDestroy: data => {
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

## License

MIT License

Copyright (c) 2021 ViiVue