import html from "../html/methods.html";

export function testMethods(root){
    root.insertAdjacentHTML('beforeend', html);

    EasySelect.init();


    document.querySelectorAll('[data-btn]').forEach(btn => {
        btn.addEventListener('click', () => {
            const method = EasySelect.get('test-methods');
            const state = btn.getAttribute('data-btn');
            console.log(state, method)
            setTimeout(() => {
                switch(state){
                    case "toggle":
                        method.toggle();
                        break;
                    case "open":
                        method.open();
                        break;
                    case "close":
                        method.close();
                        break;
                }
            },100)
        });
    });
}