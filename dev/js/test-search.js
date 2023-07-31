import html from "../html/search.html";
import { CLASSES } from '@/configs'

export function testSearch(root){
   root.insertAdjacentHTML('beforeend', html);

   // Init: default attribute
   EasySelect.init('#test-search', {
      id: 'test-methods',
   });

   //keep dropdown open
   const search = document.querySelector('div[data-es-id="test-search"]')
   search.classList.add(CLASSES.dropdownOpen)
}