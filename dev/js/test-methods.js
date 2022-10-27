import html from "../html/methods.html";

export function testMethods(root){
    root.insertAdjacentHTML('beforeend', html);

    EasySelect.init();

    // assign method event
    document.querySelectorAll('[data-btn]').forEach(btn => {
        btn.addEventListener('click', () => {
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
                case "destroy":
                    item.destroy();
                    break;
                case "enable":
                    EasySelect.init();
                    break;
                case "select":
                    const value = btn.getAttribute('data-value');
                    item.select(value);
                    break;
            }
        });
    });
}