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
import { Form } from './components/View/Form';

const events = new EventEmitter();
const api = new Api(API_URL);
const appApiProject = new AppApi(api);
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

async function productsLoad() {
    try {
        const response = await appApiProject.getProducts();
        console.log('Ответ получен от сервера:', response);
        const productsArray = response.items;
        productsModel.setProducts(productsArray);
    } catch (error) {
        console.error('Ошибка при загрузке товаров:', error);
  }
}
productsLoad();

const CDN_URL = `${import.meta.env.VITE_API_ORIGIN}/content/weblarek`;

events.on('catalog:changed',() => {
    const itemCards = productsModel.getProducts().map((item) => {
        //console.log(item.image);
        const imageUrl = `${CDN_URL}/${item.image}`;
        const card = new CardInCatalog(cloneTemplate('#card-catalog'), {
            onClick: () => events.emit('card:clicked', item),
        });
        item.image = imageUrl;
        return card.render(item); 
    });

    mainGalery.render( { catalog: itemCards});
    });

events.on('card:clicked', (item) => {
    productsModel.setSelectedProduct(item);
});

const cardPrev = new CardPreview(cloneTemplate<HTMLElement>('#card-preview'), events);

events.on('selectedProduct:changed', () => {
    const selectedItem = productsModel.getSelectedProduct();
    const isInCart = productsInCart.hasItem(selectedItem.id); 
    const isPriceNull = selectedItem.price === null;
    let buttonText = ''; 
    let isDisabled = false;
    cardPrev.render(selectedItem);
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
    modal.render( {content:cardPrev.render({ anotherTextButton: buttonText, setDisabled: isDisabled})});
});

events.on('preview:clicked', () => {
    const currentProduct = productsModel.getSelectedProduct();
     if (!currentProduct) return;
     const isInCart = productsInCart.hasItem(currentProduct.id);
     if (isInCart) {
        productsInCart.removeItem(currentProduct);
    } else {
        productsInCart.addItem(currentProduct);
    }
    modal.close();
});

events.on('cart:changed', (data) => {
    header.render( {counter: data.totalCount}); 
    const itemInCards = productsInCart.getItems().map((item, index) => {
        const cardInCart = new CardInBasket(cloneTemplate<HTMLElement>('#card-basket'), index + 1, {
            onClick: () => events.emit('card:deleted', item),
        });
        return cardInCart.render(item);
    });
    const items = productsInCart.getItems();
    const check = items.length === 0;
    const itemPrice = productsInCart.getTotalPrice();
    basket.render({ basketList: itemInCards,  price: itemPrice, isDisabled: check });
});

events.on('basket:opened',() => {
    modal.render( {content:basket.render()
    });
});
    
events.on('card:deleted', (item) => {
    productsInCart.removeItem(item)
});

events.on('order:clicked', () => {
    customer.clear();
    modal.render( {content:formOrder.render()});
});

events.on('customer:address-clicked', (data) => {
    customer.update(data);
});

events.on('payment:clicked', (data)  => {
    customer.update(data);
});

events.on('customer:email-changed', (data) => {
     customer.update(data);
});

events.on('customer:phone-changed', (data) => {
     customer.update(data);
});

events.on('customer:updated', (data) => {
    formOrder.render(data);
    formOrder.setPayment(data.payment);
    formContacts.render( data );
    const errors = customer.validate();

    const isValidOrder = (!errors.payment && !errors.address);
    if (isValidOrder) {
       formOrder.render({buttonDisabled: !isValidOrder, errors:''});
}
    const isValidContacts = (!errors.email && !errors.phone);
    if (isValidContacts) {
       formContacts.render({buttonDisabled: !isValidContacts, errors:''});
}
    if (errors.payment) {
        formOrder.render({errors: errors.payment})
    };
    if (errors.address) {
        formOrder.render({errors: errors.address})
    };
    if (errors.email) {
        formContacts.render({errors: errors.email})
    };
    if (errors.phone) {
        formContacts.render({errors: errors.phone})
    };
});

events.on('nextStepButton:clicked', () => {
    modal.render( {content:formContacts.render()});
});

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
        items: finalItems.map(item => item.id) 
    };

    try {

        console.log('Отправка заказа...', orderPayload);
        const response = await appApiProject.postOrder(orderPayload);
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

