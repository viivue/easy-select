import html from "../html/methods.html";

export function testMethods(root){
    root.insertAdjacentHTML('beforeend', html);

    EasySelect.init();

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
                    EasySelect.init();
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