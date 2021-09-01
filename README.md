# Easy Select v2.1

> Easy Select has been converted to a jQuery plugin.

Features:

1. Replace default `<select>` with a custom `<div>` for easy styling. However, the default dropdown will remain the
   same.
2. Replace default dropdown with a custom dropdown (like NiceSelect), because sometimes the default dropdown is anoying.

## Options

| Option | Type | Default | Description |
| ------ | ------ | ------ | ------ |
| target | jQuery element | `$("[data-easy-select]")` | Target to `<select>` |
| theme | string | `"default"` | Add theme class for multiple styling. Return a class like `theme-${your-theme}` |
| classes | string | `""` | Add classes |
| customDropdown | boolean | `false` | Add custom dropdown |
| customDropdownItem | function | `undefined` | Custom dropdown item's HTML |
| closeOnChange | boolean | `false` | For `customDropdown` only, close the dropdown when value is changed |

## Installation

1. Include vendor in functions.php
2. Enqueue using sample enqueue in easy-select.php

### 1. Init

- Add attribute to the select tag

```html
<select data-easy-select>
```

- Init with script

```js
$('[data-easy-select]').easySelect();
```

### 2. Add custom theme class

```html
<select data-easy-select="your-theme">
```

or

```js
$('.wrapper select').easySelect({theme: "your-theme"});
```

### 3. Gravity Form select

- Enqueue inside `bcnb_gform_deregister_scripts`.
- Gravity Form with AJAX need to be recalled on event `gform_post_render`.

### 4. Custom dropdown item's HTML

Pass data to the option's attribute.

```html
<select id="custom-options">
    <option value="apple" data-color="red">Apple</option>
    <option value="samsung" data-color="blue" selected>Samsung</option>
    <option value="sony" data-color="#000">Sony</option>
    <option value="lg" data-color="#fff">LG</option>
</select>
```
Init with `customDropdownItem: (option){}`, the `option` parameter is an object contains the current
option data, then you can use that to create new HTML.

```js
$('#custom-options').easySelect({
    customDropdownItem: (option) => {
        const colorCode = option.el.data('color');

        let html = '<div class="option-color">';
        html += `<span class="color" style="background-color:${colorCode}">${colorCode}</span>`;
        html += `<span>${option.name}</span>`;
        html += '</div>';

        return html;
    }
});
```

## Changelog

### [2.1] - 2021-08-27

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
