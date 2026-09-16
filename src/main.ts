import './scss/styles.scss';
import { ProductsCatalog } from './components/Models/ProductsCatalog';
import { ProductsCart } from './components/Models/ProductsCart';
import { Customer } from './components/Models/Customer';
import { apiProducts } from '../src/utils/data';
import { API_URL} from '../src/utils/constants';
import { Api } from './components/base/Api';
import { AppApi } from './components/Models/AppApi'


const productsModel = new ProductsCatalog();
productsModel.setProducts(apiProducts.items); 

console.log(`Массив товаров из каталога:`, productsModel.getProducts());
console.log(`Продукт, найденный по id`, productsModel.getProductById('854cef69-976d-4c2a-a18c-2aa45046c390'));

const newProduct = {
    "id": "854cef69-976d-4c2a-a18c-2aa45046c489",
    "description": "Новый продукт!!!",
    "image": "/5_Dots.svg",
    "title": "Новенький",
    "category": "софт-скил",
    "price": 700
}

productsModel.setSelectedProduct(newProduct);
console.log(`Новый продукт:`, productsModel.getSelectedProduct());

const productsCartModel = new ProductsCart();
console.log(`Что в корзине`, productsCartModel.getItems());
productsCartModel.addItem(newProduct);
console.log(`Что в корзине теперь`, productsCartModel.getItems());
const secondnewProduct = {
    "id": "854cef69-976d-4c2111111111111",
    "description": "Апельсин",
    "image": "/5_Dots.svg",
    "title": "Апельсин",
    "category": "софт-скил",
    "price": 10
}
productsCartModel.addItem(secondnewProduct);
console.log(`Что в корзине на этот раз`, productsCartModel.getItems());
console.log(`есть такой товар?:`, productsCartModel.hasItem('854cef69-976d-4c211111111111'))

//productsCartModel.removeItem(newProduct);

const firstCustomer = new Customer ();
firstCustomer.update( {
    payment:'',
    address:'',
    email:'ag@yandex.ru',
    phone:'98798'
})

console.log(firstCustomer.getData());
//firstCustomer.clear();
console.log(firstCustomer.validate());

const api = new Api(API_URL);
const test = new AppApi(api);
const secondProductsModel = new ProductsCatalog();

async function testLoad() {
    try {
        const response = await test.getProducts();
        console.log('Ответ получен от сервера:', response);
        const productsArray = response.items;
        secondProductsModel.setProducts(productsArray);
        console.log('Содержимое каталога):', secondProductsModel.getProducts());
    } catch (error) {
        console.error('Ошибка при загрузке товаров:', error);
  }
}
testLoad();
