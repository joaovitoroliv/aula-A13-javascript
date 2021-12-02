// Funcao criar imagem, recebe src
function createImage (src){
    //Criando elemento imagem com o parametro src
    const image = document.createElement('img');
    image.src = src;
    return image;
}

function onThumbnailClick (event){
    // Recuperar o indice
    currentIndex = event.currentTarget.dataset.index;
    // Criar imagem grande na outra view
    const image = createImage(event.currentTarget.src)
    // Funcao nova
    showFullsizeImage(image);
    // Sumir com a barra de rolagem ao clicar
    document.body.classList.add('no-scroll');
    // Reposicionar a imagem grande que será gerada
    modalView.style.top = window.pageYOffset + 'px';
    //Removemos a classe Hidden
    modalView.classList.remove('hidden');
}

function showFullsizeImage(image){
    modalView.innerHTML = '';
    image.addEventListener('pointerdown', startDrag);
    image.addEventListener('pointermove', duringDrag);
    image.addEventListener('pointerup', endDrag);
    image.addEventListener('pointercancel', endDrag);
    modalView.appendChild(image);
}

let originX = null;
function startDrag (event){
    // Nao trate esse evento igual nativamente
    event.preventDefault();
    event.stopPropagation();

    originX = event.clientX;
    // Continuo pegando a imagem caso meu cursor se mova
    event.target.setPointerCapture(event.pointerId);
}

function duringDrag(event){
    if (originX){
        const currentX = event.clientX;
        const delta = currentX - originX;
        const element = event.currentTarget;
        element.style.transform = 'translateX(' + delta + 'px)';
    }
}

function endDrag (event){
    if (!originX){
        return;
    }
    const currentX = event.clientX;
    const delta = currentX - originX;
    originX = null;
    // Caso eu nao tenha arrastado mais que 100px, faça
    if (Math.abs(delta) < 100){
        event.currentTarget.style.transform = '';
        return;
    }
    let nextIndex = currentIndex;
    if (delta < 0){
        nextIndex++;
    } else {
        nextIndex--;
    }
    if (nextIndex < 0 || nextIndex == PHOTO_LIST.length){
        event.currentTarget.style.transform = '';
        return;
    }

    const photoSrc = PHOTO_LIST[nextIndex];
    const image = createImage(photoSrc);
    if (delta < 0){
        image.classList.add('animate-next');
    } else {
        image.classList.add('animate-prev');
    }
    showFullsizeImage(image);
    currentIndex = nextIndex;
}

function onModalClick(){
    hideModalView();
}

function hideModalView(){
    // Volta a barra de rolagem
    document.body.classList.remove('no-scroll');
    // Adiciona classe hidden
    modalView.classList.add('hidden');
    // Apagar imagem ou qualquer outra coisa que eu tenha adicionado
    modalView.innerHTML = '';
}

let currentIndex = null;
const albumView = document.querySelector('#album-view');
//Para cada contendo no arary PHOTO_LIST, faça:
for (let i = 0; i < PHOTO_LIST.length; i++){
    // Pegar o src da foto
    const photoSrc = PHOTO_LIST[i];
    //Criar imagem com funcao 'createImage' passando photoSrc como parametro
    const image = createImage(photoSrc);
    // Pegar o indice de cada imagem
    image.dataset.index = i;
    // Adicionar um event listener que dispara funcao 'onThumbnailClick'
    image.addEventListener('pointerdown', onThumbnailClick);
    // Adicionar imagem ao albumView
    albumView.appendChild(image);
}
// Clicar na imagem depois que ela ficou grande
const modalView = document.querySelector('#modal-view');
modalView.addEventListener('pointerdown', onModalClick);

//////////////////////////////////////////////////////////////
 /* Adicionar Navegação via Teclado em Desktops*/
 /* Apertar tecla pra direita e esquerda, imagens devem mudar */
 /* Esquerda: deve mostrar imagem de endereço i-1 */
 /* Direita: deve mostrar imagem de endereço i+1 */
 /* Barra de Espaço: sair dessa tela */
/* Eventos de Teclado: keydown, keypress, keyup */
/* - Keydown: Disparado toda vez que apertar uma tecla, se segurar a tecla ele vai continuar disparando*/
/* - Keypress: so funciona se apertar um caractere (letra ou numero), continua disparando se segurado */
/* - Keyup: dispara quando solto a tecla que estava apertando */

/* Mostrar qual tecla que o usuario apertou */
// function onKeyUp (event) {
//     // 'event.key' retorna uma string (list of key values)
//     console.log('onKeyUp: ' + event.key);
// }
// document.addEventListener('keyup', onKeyUp);

//////////////////////////////////////////////////////////////
// Adicionar eventos de teclado para dispositivos móveis
// - Left swipe e Right swipe
// - Não existe em JS um evento swipe, devemos implementar (2017)
// - Para implementar precisamos entender: MouseEvent, TouchEvent e PointerEvent

// - MouseEvent: click, mousedown, mouseup, MOUSEMOVE (só desktop).
// - TouchEvent: - touchstart (toca na tela), 
//               - touchend (tira o dedo da tela),
//               - TOUCHMOVE (arrastar algo com dedo na tela - mobile) 
//               - touchcancel (erra o apertar, dois dedos apertando por exemplo)

///////////////////////////////////////////////////////
// Eventos de Mouse: clientX e clientY
// Pegar coordenadas do eixo
// function onClick (event){
//     console.log ('x is ' + event.clientX);
//     console.log ('y is ' + event.clientY);
// }
// document.addEventListener('click', onClick);
/////////////////////////////////////////////////////
// Implementando dragging em mobile e desktop
// Ideia:
// - Usuario clica/toca num elemento;
// - Pega a posicao inicial - ex: originX = 100;
// - Da uma nova posicao para o mouse - ex: newX = 150;
// - Move o elemento pela diferença entre a antiga e a nova posição
// - Para de ouvir mousemove/touchmove

// Para isso temos: PointerEvent (nao é igual pointer-events do CSS) - Nao funciona em todos os Browsers
// PointerEvent: funciona no mouse e touch, herda do MouseEvent (contem clientX e clientY)
// PointerEvent: - pointerdown (clicou ou apertou)
//               - pointerup (tirou o dedo da tela ou soltou o mouse)
//               - pointercancel (errou ao clicar, apertou com dois botoes etc)

// Biblioteca Polyfill para dar suporte aos browsers que nao possuem o PointerEvent instalado nativamente
// Como adicionar? Adicionar codigo abaixo ao script
// - <script src = "https://code.jquery.com/pep/0.4.1/pep.js"></script>
// - Temos que adicionar touch-action= "none" no elemento HTML que queremos adicionar um event listener

/////////// Movendo um Elemento via transform CSS////
// Exemplo:
// - originX = 100;
// - newX = 150;
// - delta = newX - originX;
// - element.style.transform = 'translateX(' + delta + 'px)';
////////////////////////////////////////////////
// Translate vs position em animações: 
// - translate é muito mais rápido
// - translate é otimizado para animações

// Sempre que pensamos em arrastar algo, devemos usar:
// - event.preventDefault(): prevenir que o browser tente arrastar nativamente algum elemento
// - setPointerCapture(): nao quer perder o rastramento do objeto, isto é, quando eu clico e arrasto mas movo o ponteiro segurando para onde quero. Para isso, usar: event.target.setPointerCapture (event.pointerId);
/////////////////////// Atributo Style ////////////////
// Todo elemento HTML contem um atributo style, para acessá-lo: element.style.transform = 'translateX(' + value + ')';
// - Nao devemos adicionar ou remover classes com element.style, podemos usar classList para isso que é bem melhor
// - Possui maior precendia do que qualquer outra propriedade CSS, logo podemos desfazer um atributo style que definimos com: element.style.transform = '';, assim utilizamos somente o CSS.

///////////// Animações em CSS //////////////////
// - Mudar imagem da pizza suavemente:
// @keyframes animation-name{
//     from {
//         CSS styles
//     }
//     to {
//         Css styles
//     }
// }

