# Changelog

### [3.0.0] - 2021-11-05

- Refactor plugin structure
- Add methods: destroy, refresh, open, close, toggle, disabled, select
- Add events: onInit, onRefresh, onChange, onDestroy, onDropdownOpen, onDropdownClose, onDropdownToggle, onDisabled

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