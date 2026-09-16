import './scss/styles.scss';
import { ProductsCatalog } from './components/Models/ProductsCatalog';
import { ProductsCart } from './components/Models/ProductsCart';
import { Customer } from './components/Models/Customer';
import { apiProducts } from '../src/utils/data';
import { API_URL} from '../src/utils/constants';
import { Api } from './components/base/Api';
import { AppApi } from './components/Models/AppApi'

//Проверка методов класса ProductsCatalog

const productsModel = new ProductsCatalog();
productsModel.setProducts(apiProducts.items); 
console.log(`Массив товаров из каталога:`, productsModel.getProducts());
console.log(`Продукт, найденный по id`, productsModel.getProductById('854cef69-976d-4c2a-a18c-2aa45046c390'));
productsModel.setSelectedProduct(apiProducts.items[0]);
console.log(`Выбранный товар для подробного отображения:`, productsModel.getSelectedProduct());

//Проверка методов класса ProductsCart

const productsCartModel = new ProductsCart();
console.log(`Текущий список товаров в корзине`, productsCartModel.getItems());
productsCartModel.addItem(apiProducts.items[0]);
productsCartModel.addItem(apiProducts.items[1]);
productsCartModel.addItem(apiProducts.items[2]);
console.log(`Корзина с добавленными товарами`, productsCartModel.getItems());
productsCartModel.removeItem(apiProducts.items[0]);
console.log(`Корзина с удаленным товаром`, productsCartModel.getItems());
console.log(`Стоимость всех товаров в корзине`, productsCartModel.getTotalPrice());
console.log(`Количество всех товаров в корзине`, productsCartModel.getTotalCount());
console.log(`Есть товар с таким id?:`, productsCartModel.hasItem('854cef69-976d-4c211111111111'));
productsCartModel.clear();
console.log(`Корзина после очистки`, productsCartModel.getItems());

//Проверка методов класса Customer

const firstCustomer = new Customer();
firstCustomer.update( {
    payment:'',
    address:'',
    email:'ag@yandex.ru',
    phone:'98798'
})
console.log(`Получаем сохраненные данные покупателя`, firstCustomer.getData());
firstCustomer.clear();
console.log(`Получаем данные покупателя после очистки`, firstCustomer.getData());
const secondCustomer = new Customer();
secondCustomer.update( {
    payment:'',
    address:'Spb',
    email:'yg@yandex.ru',
    phone:'565555'
})
console.log(`Проверяем поля на заполненность`, secondCustomer.validate());

//Проверка класса AppApi

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
