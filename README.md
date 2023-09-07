# Easy Select

[![release](https://badgen.net/github/release/viivue/easy-select/)](https://github.com/viivue/easy-select/releases/latest)
[![minified](https://badgen.net/badge/minified/9KB/cyan)](https://www.jsdelivr.com/package/gh/viivue/easy-select)
[![jsdelivr](https://data.jsdelivr.com/v1/package/gh/viivue/easy-select/badge?style=rounded)](https://www.jsdelivr.com/package/gh/viivue/easy-select)
[![Netlify Status](https://api.netlify.com/api/v1/badges/84c6ed49-b3f3-450b-857a-ec904db724b7/deploy-status)](https://app.netlify.com/sites/easy-select/deploys)

> Demo: https://easy-select.netlify.app

## Getting started

### CDN

```html

<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/viivue/easy-select@4.1.1/dist/easy-select.min.css">

<script src="https://cdn.jsdelivr.net/gh/viivue/easy-select@4.1.1/dist/easy-select.min.js"></script>
```

## Initialize

### With HTML

Using these HTML attributes to initialize without JavaScript.

```html
<!-- Init with HTML attribute -->
<select data-easy-select>
    <option value="1">One</option>
    <option value="2">Two - Hai</option>
    <option value="3">Three - 第三的</option>
</select>
```

### With JavaScript

Assume that we have the HTML like below

```html
<select id="my-select">
    <option value="1">One</option>
    <option value="2">Two - Hai</option>
    <option value="3">Three - 第三的</option>
</select>
```

```js
// jQuery plugin
jQuery('#my-select').easySelect();

// DOM element
EasySelect.init(document.querySelector('#my-select'));

// jQuery element
EasySelect.init(jQuery('#my-select'));

// CSS selector string
EasySelect.init('#my-select');
```

## Options

All options are optional.

| Attribute           | Type    | Default                  | Description                                                                                      | 
|---------------------|---------|--------------------------|--------------------------------------------------------------------------------------------------|
| `id`                | string  | Auto-generated ID        | Set an ID to access this select later with `EasySelect.get()`                                    |
| `nativeSelect`      | boolean | `false`                  | Use native select instead of a custom dropdown                                                   |
| `align`             | string  | `"left"`                 | Set alignment for dropdown. Could be `"top"` or `"top right"`. Visit demo page for full options. |
| `closeOnChange`     | boolean | `true`                   | Close dropdown on value changes.                                                                 |
| `search`            | boolean | `false`                  | Show a field to search options inside the dropdown.                                              |
| `emptySearchText`   | string  | `"There are no options"` | Text when no search results found                                                                |
| `searchPlaceHolder` | string  | `"Type to search..."`    | Placeholder for the search input                                                                 |

```js
EasySelect.init('#my-select', {
    id: 'my-select',
    align: "top right"
});
```

### Set options via HTML

Pass a string to use as ID

```html
<!-- Init with custom ID -->
<select data-easy-select="my-id">
    <option value="1">One</option>
</select>
```

Pass a valid JSON to use as options

```html
<!-- Init with options -->
<select data-easy-select='{ "id":"my-id", "align":"right" }'>
    <option value="1">One</option>
</select>
```

> ⚠️ Options set in HTML must be valid JSON. Keys need to be quoted, for example `"align":"right"`.

## Methods

| Usage                                           | Description                                               | 
|-------------------------------------------------|-----------------------------------------------------------|
| `instance.toggle()`                             | Toggle open/close                                         |
| `instance.open()`                               | Open dropdown                                             |
| `instance.close()`                              | Close dropdown                                            |
| `instance.disable()`                            | Disable select                                            |
| `instance.disableOption(optionValue, disabled)` | Disable/enable an option                                  |
| `instance.enable()`                             | Enable select                                             |
| `instance.refresh()`                            | Refresh select when original select changes with new HTML |
| `instance.destroy()`                            | Destroy select, return original HTML                      |
| `instance.select(value)`                        | Select a value                                            |
| `instance.add(value)`                           | Add new option with value                                 |
| `instance.on(eventName, callback)`              | Assign events                                             |

```js
// init
EasySelect.init('#my-select', {
    id: 'my-select'
});

// get instance
const instance = EasySelect.get('my-select');

// use method
instance.open();
```

## Events

| Usage                    | Description                                                                 | 
|--------------------------|-----------------------------------------------------------------------------|
| `beforeInit: data => {}` | Before init                                                                 |
| `onInit: data => {}`     | After init                                                                  |
| `onRefresh: data => {}`  | After refresh                                                               |
| `onChange: data => {}`   | After value changed, the same as `select.addEventListener('change',()=>{})` |
| `onDestroy: data => {}`  | After destroy                                                               |
| `onDisable: data => {}`  | After disable                                                               |
| `onEnable: data => {}`   | After enable                                                                |
| `onOpen: data => {}`     | After open                                                                  |
| `onClose: data => {}`    | After close                                                                 |
| `onToggle: data => {}`   | After toggle, before open or close                                          |
| `onAdded: data => {}`    | After a new item was added successfully                                     |

```js
EasySelect.init('#my-select', {
    id: 'my-select',
    onChange: data => {
        console.log(data);
    }
});

// add event via method on()
const instance = EasySelect.get('my-select');
instance.on('change', () => {
    // do something
});
```

## Deployment

```shell
# Run dev server
npm run dev

# Build dev site
npm run build

# Generate production files
npm run prod
```

## License

[MIT License](https://github.com/viivue/easy-select/blob/main/LICENSE)

Copyright (c) 2023 ViiVue
