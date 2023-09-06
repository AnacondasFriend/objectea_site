var requestURL = "data/data.json";
var request = new XMLHttpRequest();
const body = document.querySelector('body');
const shortView = document.querySelector('.shortView');
const detailedView = document.querySelector('.detailedView');
const filters = document.querySelectorAll('.filter');
const sortArea = document.querySelector('.sort');
const sortWrapper = document.querySelector('.sortBy');
const sortItemWrapper = document.querySelector('.sort-wrapper');
const sortList = document.querySelectorAll('.sort__item');
const submitFilters = document.querySelector('.submitFilters');
const resetFilters = document.querySelector('.resetFilters');
const products = document.querySelector('.products');
const shoppingCart = document.querySelector('.shoppingCart');
const shoppingCartProducts= document.querySelector('.shoppingCart-products');
const emptyCart = document.querySelector('.empty-cart');
const result = document.querySelector('.result-sum');
const bin = document.querySelector('.bin');
const sendData = document.querySelector('.send-data');
const order = document.querySelector('.order');
const backToCartButton = document.querySelector('.backToCart');
let productsArray;
let teaObject;
let sortingSet;
let short;
const changeEvent = new Event('change');

function fillInBlock(jsonArray){
    for(object of jsonArray){
        productId = object.id;
        productName = object.name;
        productDescription = object.description;
        productYear = object.year;
        productType = object.type;
        productPrice = object.price;
        productImg = object.img;
        block = createCard(productId, productName, productDescription, productYear, productType, productPrice, productImg);
        products.insertAdjacentHTML('beforeend', block);
    }
}

function createCard(id, productName, desc, year, type, price, img){
    return `<div class='productCard'>
                <img src='${img}'></img>
                <div id='${id}' class='product'>
                    <h3 class='product-name'>${productName}</h3>
                    <p class='price'>Цена: <span class='priceValue'>${price}</span> р/г</p>
                    <div class='addInfo'>                        
                        <p>Описание: ${desc}</p>
                        <p>Год производства: ${year}</p>
                        <p class='teaCategory ${type}'>Категория: ${teaObject[type]}</p>
                    </div>
                    <br>
                    <button class='addToCart btn-style2'>добавить в корзину</button>
                </div>
            </div>`
}

function showSort(){
    for(let div of sortList){
        div.classList.add('unhideElem');
    }

    sortItemWrapper.addEventListener('click', (e)=>{
        currentElement = e.target;
        for(let div of sortList){
            div.classList.remove('unhideElem');
        }
        currentElement.classList.add('unhideElem');
        sortClass = currentElement.classList[1];
        if(sortClass=='priceHigher'){
            sortingSet='price';
            sortedArray = fastSort(productsArray, sortingSet);
        }
        else if(sortClass=='priceLower'){
            sortingSet='price';
            sortedArray = fastSort(productsArray, sortingSet);
            sortedArray.reverse()
        }
        else if(sortClass=='yearNewer'){
            sortingSet='year';
            sortedArray = fastSort(productsArray, sortingSet);
            sortedArray.reverse()
        }
        else if(sortClass=='yearOlder'){
            sortingSet='year';
            sortedArray = fastSort(productsArray, sortingSet);
        }
        
        products.innerHTML = '';
        fillInBlock(sortedArray);
        sortWithFilters();
        if(!short) showDetails();
        addToCart(); 
        e.stopPropagation();
    }, {once: true})
}

function fastSort(arr, sortClass){
    if(arr.length < 2){
        return arr;
    }
    startPoint = arr[0];
    let leftList=[];
    let rightList=[];
    let middleList=[];
    for(i=1; i < arr.length; i++){
        if(arr[i][sortClass]>startPoint[sortClass]){
            rightList.push(arr[i]);
        } 
        else {
            leftList.push(arr[i]);
        };
    }
    middleList.push(startPoint);
    return [...fastSort(leftList, sortClass), ...middleList,  ...fastSort(rightList, sortClass)]
}

function sortWithFilters(){
    const productCards = document.querySelectorAll('.productCard');
    let categoriesChecks = document.querySelectorAll('.tea-category:checked');
    let priceChecks= document.querySelector('.price-category:checked');
    let chosenCategories = createFiltersList(categoriesChecks);
    let cards = [];
    showAllCards();
    if(categoriesChecks.length==0 && priceChecks.classList[1]=='all-cat'){
        resetFilterSettings();
        return 0;
    }
    else if(categoriesChecks.length==0 && priceChecks.classList[1]!='all-cat'){
        chosePriceCategory(productCards, priceChecks);
        return 0;
    }
    for(card of productCards){
        catElement = card.querySelector('.teaCategory').classList[1];
        if(!chosenCategories.includes(catElement)){
            card.style.display = 'none';
        }
        else{
            cards.push(card);
        }
    }
    chosePriceCategory(cards, priceChecks);
}

function showAllCards(){
    const productCards = document.querySelectorAll('.productCard');
    for(card of productCards){
            card.style.display = 'inline-block';
    }
}

function resetFilterSettings(){
    let priceChecks= document.querySelector('.all-cat');
    let categoriesChecks = document.querySelectorAll('.tea-category:checked');
    priceChecks.checked = true;
    for(check of categoriesChecks){
        check.checked=false;
    }
    showAllCards();
}

function createFiltersList(checkObjects){
    let arr=[];
    for(object of checkObjects){
        arr.push(object.classList[1]);
    }
    return arr;
}

function chosePriceCategory(cardList, checkedPrice){
    priceCheck = checkedPrice.value
    if(priceCheck=='more100'){
        for(card of cardList){
            cardPrice = Number(card.querySelector('.priceValue').textContent);
            if(cardPrice<100) card.style.display = 'none';
        }
    }
    else{
        for(card of cardList){
            cardPrice = Number(card.querySelector('.priceValue').textContent);
            if(cardPrice > Number(priceCheck))  card.style.display = 'none';
        }
    }
}

function showDetails(){
    short = false;
    const productCards = document.querySelectorAll('.productCard');
    for(card of productCards){
        card.classList.add('productDetails');       
        card.querySelector('.addInfo').style.display = 'inline-block';
        card.style.textAlign = 'left';
        card.querySelector('img').style.float = 'left';
    }
}

function hideDetails(){
    short = true;
    const productCards = document.querySelectorAll('.productCard');
    for(card of productCards){
        card.classList.remove('productDetails');        
        card.querySelector('.addInfo').style.display = 'none';
        card.style.textAlign = 'center';
    }
}

function addToCart(){
    const addToCartButtons = document.querySelectorAll('.addToCart');
    for(btn of addToCartButtons){
        btn.addEventListener('click', (e)=>{
            card = e.target.parentNode.parentNode;
            img = card.querySelector('img').getAttribute('src');
            productName = card.querySelector('.product-name').textContent;
            price = card.querySelector('.priceValue').textContent;
            alreadyExist = findMatch(productName);
            if(!alreadyExist){
                block = `<div class='cart-product'>
                        <button class='delete-from-cart-button'>удалить</button>
                        <div class='cart-img'><img src='${img}'></img></div>
                        <div>
                            <p class='cart-name'>Название: <span>${productName}</span></p>
                            <p class='cart-price'>Цена за грамм: <span>${price}</span></p>
                            <label>Количество <input value='1' type="number" min='1'/> грамм</label>
                            <p class='finaly-price'>Итоговая цена <span>${price}</span> &#8381;</p>
                        </div>
                    </div>`
            shoppingCart.querySelector('.shoppingCart-products').insertAdjacentHTML('beforeend', block);
            deleteFromCart();
            }
            calculatePrice();
        })
    }
}

function deleteFromCart(){
    let allButtons = document.querySelectorAll('.delete-from-cart-button');
    const button = allButtons[allButtons.length-1];
    button.addEventListener('click',(e)=>{
        let allButtons = document.querySelectorAll('.delete-from-cart-button');
        if(allButtons.length==1){
            emptyCart.style.display = 'block';
            result.style.display = 'none';
        }
        e.target.parentNode.remove();
        updateResultSum();
    })
}

function findMatch(prodName){
    cards = document.querySelectorAll('.cart-product');
    for(card of cards){
        if (card.querySelector('.cart-name').querySelector('span').textContent == prodName){
            cardInput = card.querySelector('input');
            changedValue = Number(cardInput.value) + 1;
            card.querySelector('input').setAttribute('value', changedValue);
            cardInput.dispatchEvent(changeEvent);
            return true;
        }
    }
}

function showShoppingCart(){
    if(shoppingCartProducts.innerHTML == ''){
        emptyCart.style.display = 'block';
        result.style.display = 'none';
        
    }
    else{
        emptyCart.style.display = 'none';
        result.style.display = 'block';
        updateResultSum();
    }
    shoppingCart.style.display = 'inline-block';
    body.style.overflow = 'hidden';
    document.querySelector('.close-shopping-cart').onclick = closeShoppingCart;
}

function closeShoppingCart(){
    shoppingCart.style.display = 'none';
    body.style.overflow = 'visible';
}

function calculatePrice(){
    const productsInCart = document.querySelectorAll('.cart-product');
    const product = productsInCart[productsInCart.length-1];
        let input = product.querySelector('input');
        input.addEventListener('change', (e)=>{
            prodCard = e.target.parentNode.parentNode;
            let finnalyPrice = prodCard.querySelector('.finaly-price').querySelector('span');
            price = prodCard.querySelector('.cart-price').querySelector('span').innerText;
            res = e.target.value*Number(price);
            if(res<1){
                res = Number(price);
                e.target.value = 1;
            } 
            finnalyPrice.innerHTML = `${res}`;
            updateResultSum();
        })
}

function updateResultSum(){
    const productsInCart = document.querySelectorAll('.cart-product');
    const resSum = document.querySelector('.finally-sum');
    let sum = 0;
    for(product of productsInCart){
        let d = product.querySelector('.finaly-price').querySelector('span').innerText;
        sum += Number(d);
    }
    resSum.innerHTML = `Итого: ${sum} &#8381;`
}

function makeOrder(){
    closeShoppingCart();
    order.style.display = 'block';
    body.style.overflow = 'hidden';
}

function backToCart(){
    order.style.display = 'none';
    showShoppingCart();
}

function hideChecksInFilters(){
    for(let filter of filters){
                ul = filter.nextElementSibling;
                ul.classList.remove('unhideElem');
            }       
}

request.open("GET", requestURL);
request.responseType = "json";
request.send();
request.onload = function () {
    let response = request.response;
    productsArray = response.products;
    sortedArray = fastSort(productsArray, 'price');
    teaObject = response.teatype;
    fillInBlock(sortedArray);
    resetFilterSettings();
    short=true;
    addToCart();

};

for(let filter of filters){
    filter.addEventListener('click', ()=>{
        if(document.body.clientWidth < 820){
            ul = filter.nextElementSibling;
            ul.classList.toggle('unhideElem');
            submitFilters.addEventListener('click', hideChecksInFilters);
            resetFilters.addEventListener('click', hideChecksInFilters);
        }
    })
}

sortWrapper.addEventListener('click', showSort);  
detailedView.addEventListener('click', showDetails);
shortView.addEventListener('click', hideDetails);
submitFilters.addEventListener('click', sortWithFilters);
resetFilters.addEventListener('click', resetFilterSettings);
bin.addEventListener('click', showShoppingCart);
sendData.addEventListener('click', makeOrder);
backToCartButton.addEventListener('click', backToCart);