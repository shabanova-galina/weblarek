import './scss/styles.scss';
import { ProductsCatalog } from './components/Models/ProductsCatalog';
import { ProductsCart } from './components/Models/ProductsCart';
import { Customer } from './components/Models/Customer';
import { apiProducts } from '../src/utils/data';
import { API_URL} from '../src/utils/constants';
import { Api } from './components/base/Api';
import { AppApi } from './components/Models/AppApi'
import { Header } from './components/View/Header';
import { Gallery } from './components/View/Gallery';
import { Modal } from './components/View/Modal';
import { Card } from './components/View/Card';
import { cloneTemplate } from './utils/utils';
import { CardInCatalog } from './components/View/CardInCatalog';
import { CardPreview } from './components/View/CardPreview';
import { EventEmitter } from './components/base/Events';
import { Success } from './components/View/Success';
import { CardInBasket } from './components/View/CardInBasket';
import { Basket } from './components/View/Basket';
import { FormContacts } from './components/View/FormContacts';
import { FormOrder } from './components/View/FormOrder';
import { ensureElement } from './utils/utils';
import { IOrderRequest } from './types';

const events = new EventEmitter();
const api = new Api(API_URL);
const test = new AppApi(api);
const mainGalery = new Gallery(document.querySelector('.gallery') as HTMLElement);
const productsModel = new ProductsCatalog(events);
const productsInCart = new ProductsCart(events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'));
const headerContainer = document.querySelector('.header') as HTMLElement;
const header = new Header(headerContainer, events);
const basket = new Basket(cloneTemplate<HTMLElement>('#basket'), {onClick: () => events.emit('order:clicked')});
const customer = new Customer(events); 
const formOrder = new FormOrder(cloneTemplate<HTMLElement>('#order'), events);
const formContacts = new FormContacts(cloneTemplate<HTMLElement>('#contacts'), events);
const successForm = new Success(cloneTemplate<HTMLElement>('#success'), events);


async function testLoad() {
    try {
        const response = await test.getProducts();
        console.log('Ответ получен от сервера:', response);
        const productsArray = response.items;
        productsModel.setProducts(productsArray);
    } catch (error) {
        console.error('Ошибка при загрузке товаров:', error);
  }
}
testLoad();

//При изменении списка товаров карточки перерисовываются
events.on('catalog:changed',() => {
    const itemCards = productsModel.getProducts().map((item) => {
        const card = new CardInCatalog(cloneTemplate('#card-catalog'), {
            onClick: () => events.emit('card:clicked', item),
        });
        return card.render(item); 
    });

    mainGalery.render( { catalog: itemCards});
    });

//При нажатии на карточку товара открывается модальное окно с информацией о товаре (внутри могут быть разные кнопки)
const cardPrev = new CardPreview(cloneTemplate<HTMLElement>('#card-preview'), () => {});
 events.on('card:clicked', (item) => {
    const isInCart = productsInCart.hasItem(item.id); 
    const isPriceNull = item.price === null;
    let buttonText = ''; 
    let isDisabled = false;
    if (isPriceNull) { 
        buttonText = 'Недоступно'; 
        isDisabled = true;
    } else if (isInCart) {
         buttonText = 'Удалить из корзины'; 
         isDisabled = false;
    } else { 
        buttonText = 'Добавить в корзину'; 
        isDisabled = false;
    }
    cardPrev.render(item);
    cardPrev.render({ text: item.description });
    cardPrev.render({ anotherTextButton: buttonText, setDisabled: isDisabled});
    cardPrev.setOnClickHandler(() => {
        const currentIsInCart = productsInCart.hasItem(item.id);
        if (currentIsInCart) {
            events.emit('toDelete:clicked', item);
        } else {
            events.emit('toAdd:clicked', item);
        }
    });
    modal.render( {content: cardPrev.render()});
 });

//При нажатии на кнопку "В корзину" товар должен добавиться в корзину (если не был добавлен ранее), модальное окно закрывается;
events.on('toAdd:clicked', (item) => {
    productsInCart.addItem(item);
    modal.close();
});

events.on('toDelete:clicked', (item) => {
    productsInCart.removeItem(item);
    modal.close();
});

events.on('cart:changed', (data) =>{
    header.render( {counter: data.totalCount}); 
});

//Добавленные в корзину товары должны отображаться в корзине
events.on('basket:opened',() => {
    const itemInCards = productsInCart.getItems().map((item, index) => {
        const cardInCart = new CardInBasket(cloneTemplate<HTMLElement>('#card-basket'), index + 1, {
            onClick: () => events.emit('card:deleted', item),
        });
        return cardInCart.render(item);
    });
    const items = productsInCart.getItems();
    const check = items.length === 0;
    const itemPrice = productsInCart.getTotalPrice();
    modal.render( {content:basket.render({
        basketList: itemInCards, 
        price: itemPrice,
        isDisabled: check })
    });
})
    
events.on('card:deleted',(item) => {
    productsInCart.removeItem(item);
    const itemInCards = productsInCart.getItems().map((item, index) => {
    return cardInCart.render(item);
    });
    const itemPrice = productsInCart.getTotalPrice();
    const items = productsInCart.getItems();
    const check = items.length === 0;
    modal.render( {content:basket.render({basketList: itemInCards, price: itemPrice, isDisabled: check})} )
});

events.on('order:clicked', () => {
    modal.render( {content:formOrder.render()});
});

events.on('buttonNextStep:clicked', () => {
    modal.render( {content:formContacts.render()});
});

// Формы 

let selectedPaymentMethod: 'card' | 'cash' | null = null;

events.on('customer:address-changed', (data) => {
    const addressFromForm = data.value.trim();
    console.log('Введен адрес', addressFromForm);
    customer.update ({
        address: addressFromForm
    });
    checkStepOneValidation();
});

events.on('payment:clicked', (data) => { 
    selectedPaymentMethod = data.method;
    console.log('Выбран способ оплаты:', selectedPaymentMethod)
    customer.update ({
        payment: selectedPaymentMethod
    });
    checkStepOneValidation();
});

function checkStepOneValidation(): boolean {
    const currentData = customer.getData();
    const address = currentData.address.trim();
    const hasPayment = currentData.payment !== '';
    let hasErrors = false;
    let errorMessage = '';
    if (!address) {
        hasErrors = true;
        errorMessage += 'Укажите адрес для доставки. ';
    }
    if (!hasPayment) {
        hasErrors = true;
        errorMessage += 'Необходимо выбрать способ оплаты. ';
    }
    formOrder.render({errors: errorMessage, buttonDisabled: hasErrors});
    // Возвращаем true, если всё ок (нет ошибок)
    return !hasErrors;
}

events.on('customer:email-changed', (data) => {
    const emailFromForm = data.value.trim();
    console.log('Введен email:', emailFromForm);
    customer.update ({
        email: emailFromForm
    });
    checkStepTwoValidation();
});

events.on('customer:phone-changed', (data) => {
    const phoneFromForm = data.value.trim();
    console.log('Введен phone:', phoneFromForm);
    customer.update ({
        phone: phoneFromForm
    });
    checkStepTwoValidation();
});

function checkStepTwoValidation(): boolean {
    const currentData = customer.getData();
    const email = currentData.email.trim();
    const phone = currentData.phone.trim();
    let hasErrors = false;
    let errorMessage = '';
    if (!email) {
        hasErrors = true;
        errorMessage += 'Необходимо указать e-mail. ';
    }
    if (!phone) {
        hasErrors = true;
        errorMessage += 'Необходимо указать номер телефона. ';
    }
    formContacts.render({errors: errorMessage, buttonDisabled: hasErrors});
    return !hasErrors;
}

events.on('buttonToPay:clicked', async () => {
    const customerData = customer.getData();
    console.log('Вот данные покупателя:', customerData);
    const finalItems = productsInCart.getItems();
    console.log('Вот данные о заказе:', finalItems);
    const successSum = productsInCart.getTotalPrice();
    const orderPayload: IOrderRequest = {
        email: customerData.email,
        phone: customerData.phone,
        address: customerData.address,
        payment: customerData.payment,
        total: successSum,
        //Отправляем только ID товаров, как требует интерфейс
        items: finalItems.map(item => item.id) 
    };

    try {

        console.log('Отправка заказа...', orderPayload);
        const response = await test.postOrder(orderPayload);
        console.log('Заказ успешно создан! ID:', response.id);
        productsInCart.clear();
        customer.clear();

        modal.render( {content:successForm.render({ totalsum: successSum})});
    } catch (error) {
        console.error('Ошибка при оформлении заказа:', error);
    }
});

events.on('success:closed', () => {
    modal.close();
})

