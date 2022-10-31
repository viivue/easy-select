import html from "../html/methods.html";

function highlightLabel(data){
    console.log(data.eventName, data)

    const label = document.querySelector(`[data-event=${data.eventName}]`);

    label.classList.add('active');

    setTimeout(() => {
        label.classList.remove('active');
    }, 300);
}

function init(){
    EasySelect.init('#test-methods', {
        id: 'test-methods',
        onInit: data => highlightLabel(data),
        onRefresh: data => highlightLabel(data),
        onChange: data => highlightLabel(data),
        onDestroy: data => highlightLabel(data),
        onDisable: data => highlightLabel(data),
        onEnable: data => highlightLabel(data),
        onOpen: data => highlightLabel(data),
        onClose: data => highlightLabel(data),
        onToggle: data => highlightLabel(data),
        onAdded: data => highlightLabel(data),
    });
}

export function testMethods(root){
    root.insertAdjacentHTML('beforeend', html);

    init();

    // add option
    const inputAddOption = document.querySelector('input[name="add-option"]');
    const btnAddOption = document.querySelector('button[data-btn="add"]');
    const updateAddNewOptionForm = () => {
        btnAddOption.style.display = inputAddOption.value.length > 0 ? '' : 'none';
    }
    inputAddOption.addEventListener('keyup', () => updateAddNewOptionForm());
    updateAddNewOptionForm();

    // assign method event
    document.querySelectorAll('[data-btn]').forEach(btn => {
        btn.addEventListener('click', e => {
            const item = EasySelect.get(btn.getAttribute('data-id'));
            const state = btn.getAttribute('data-btn');

            switch(state){
                case "toggle":
                    item.toggle();
                    break;
                case "open":
                    item.open();
                    break;
                case "close":
                    item.close();
                    break;
                case "disable":
                    item.disable();
                    break;
                case "enable":
                    item.enable();
                    break;
                case "destroy":
                    item.destroy();
                    break;
                case "re-init":
                    init();
                    break;
                case "select":
                    item.select(btn.getAttribute('data-value'));
                    break;
                case "add":
                    item.add(inputAddOption.value);
                    break;
            }
        });
    });
}