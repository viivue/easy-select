import html from "../html/search.html";

export function testSearch(root){
    root.insertAdjacentHTML('beforeend', html);

    // Init: default attribute
    EasySelect.init('#test-search', {
        id: 'test-search',
        search: true,
    });

    //keep dropdown open
    const search = EasySelect.get('test-search');
    search.open();
}