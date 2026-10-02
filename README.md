# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент, за отображение которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.


### Данные
В приложении используются две сущности, которые описывают данные, — товар и покупатель.

#### Интерфейс IProduct
Описывает структуру товара для отображения в каталоге и использования в корзине. 

interface IProduct {
  `id: string`; - уникальный идентификатор продукта.
  `description: string`; - описание продукта.
  `image: string`; - ссылка на изображение продукта.
  `title: string`; - название продукта.
  `category: string`; - категория продукта.
  `price: number | null`; - цена продукта. Поле price может быть null, если цена временно не указана.
}

#### Интерфейс IBuyer
Описывает данные покупателя, необходимые для оформления заказа. 

interface IBuyer {
  `payment: TPayment`; - способ оплаты.
  `email: string`; - адрес электронной почты. 
  `phone: string`; - телефон.
  `address: string`; - адрес.
} 

### Модели данных 

#### Класс ProductsCatalog
Класс хранения данных о каталоге товаров. Управляет состоянием списка товаров и выбранным элементом.
Эмитит события 'catalog:changed', 'selectedProduct:changed'.

Поля класса: 
`products: IProduct[]` - актуальный список всех товаров. 
`selectedProduct: IProduct | null` - товар, выбранный для подробного отображения.

Конструктор инициализирует внутреннее состояние каталога: `constructor() {this.products = []; this.selectedProduct = null }`.

Методы: 
`setProducts(products: IProduct[]): void` - метод сохранения данных в каталоге товаров.
`getProducts(): IProduct[]`- метод получения массива всех товаров.
`getProductById(id: string): IProduct | undefined` - метод получения одного товара по его id.
`setSelectedProduct(product: IProduct): void` - метод сохранения товара для подробного отображения.
`getSelectedProduct(): IProduct | null` - метод получения товара для подробного отображения. 

#### Класс ProductsCart
Класс хранения товаров, выбранных покупателем для покупки. Управляет состоянием этих товаров. 
Эмитит событие 'cart:changed'.

Поля класса: 
`items: IProduct[]` - актуальный список выбранных товаров. 

Конструктор: класс создаётся с пустым массивом товаров:`constructor() {this.items = [];}`.

Методы:
`getItems(): IProduct[]` - возвращает текущий список товаров в корзине. 
`addItem(product: IProduct): void` - добавляет товар в корзину. 
`removeItem(product: IProduct): void` - удаляет товар из корзины.
`clear(): void` — очистка корзины. 
`getTotalPrice(): number` - получение стоимости всех товаров в корзине. 
`getTotalCount(): number` - получение количества товаров в корзине.
`hasItem(id: string): boolean` - проверка наличия товара в корзине по его id.

### Класс Customer 
Отвечает за хранение и валидацию данных покупателя. Эмитит событие 'customer:updated'.

Поля класса: 
`payment: TPayment | ''` - способ оплаты.
`email: string` - email.
`phone: string` - телефон.
`address: string` - адреc.

Конструктор инициализирует состояние объекта безопасными значениями: 
`constructor() {
    this.payment = '';
    this.email = '';
    this.phone = '';
    this.address = '';
    }`

Методы: 
`update(data: Partial< IBuyer >): void` - сохранение данных.
`getData(): IBuyer` - получение всех данных покупателя.
`clear(): void` - очистка данных покупателя.
`validate(): Partial<Record<keyof IBuyer, string>> `- валидация данных. 
Метод Проверяет каждое обязательное поле на заполненность.
Если поле пустое или содержит только пробелы — добавляет в результат сообщение об ошибке.

### Слой коммуникации

#### Класс AppApi 
Класс для взаимодействия с API интернет-магазина. Реализует методы для получения каталога товаров и отправки заказов, используя композицию с базовым классом `Api`.

Конструктор: `constructor(api: IApi) {this.api = api;}`.

Поля класса:
`api: IApi` - поле, хранящее экземпляр API-клиента для выполнения запросов.

Методы: 
`getProducts(): Promise<IProductsResponse> {return this.api.get<IProductsResponse>('/product/')}`- получает список товаров из каталога.
`postOrder(orderData: IOrderRequest): Promise<IOrderResponse> {return this.api.post<IOrderResponse>('/order/', orderData)}` - отправляет данные заказа на сервер.


### Слой представления 

#### Класс Header 
Отвечает за отображение шапки сайта, управление кнопкой корзины и счётчиком товаров в ней. 

Конструктор инициализирует состояние объекта, находя необходимые DOM-элементы внутри контейнера и подписываясь на событие клика по кнопке корзины:
constructor(container: HTMLElement, events: IEvents) {
        super(container);

        this.counterElement = ensureElement<HTMLElement>('.header__basket-counter', this.container);
        this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', this.container);

        this.basketButton.addEventListener('click', () => {
            events.emit('basket:opened')
        })
    }

Поля класса:
counterElement: HTMLElement - элемент DOM, отображающий количество товаров в корзине.
basketButton: HTMLButtonElement - кнопка открытия корзины в шапке сайта.

Методы: 
set counter(value: number) {
        this.counterElement.textContent = String(value);
    } - обновляет текст счётчика товаров в корзине. 

#### Класс Gallery
Отвечает за отрисовку галереи товаров на странице.

Конструктор инициализирует состояние объекта, находя корневой элемент галереи внутри переданного контейнера:
constructor(container: HTMLElement) {
        super(container);

        this.catalogElement = ensureElement<HTMLElement>('.gallery');
    }

Поля класса: 
catalogElement: HTMLElement — контейнер внутри галереи, куда добавляются карточки товаров.

Методы класса: 
set catalog(items: HTMLElement[]): void — принимает массив готовых DOM-элементов (карточек товаров) и добавляет их в конец списка внутри контейнера .gallery.

#### Класс Modal
Отвечает за управление модальным окном.

Конструктор  инициализирует состояние объекта, находя необходимые DOM-элементы внутри контейнера и подписываясь на события закрытия:
constructor(container: HTMLElement) {
        super(container);

        this.closeButtonElement = ensureElement<HTMLButtonElement>('.modal__close', this.container);
        this.contentElement = ensureElement<HTMLElement>('.modal__content', this.container);
        this.windowElement = ensureElement<HTMLElement>('.modal__container', this.container);

        this.closeButtonElement.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('click', this.close.bind(this));
        this.windowElement.addEventListener('click', (event) => event.stopPropagation());
    }

Поля класса:
closeButtonElement: HTMLButtonElement — кнопка закрытия модального окна (крестик).
contentElement: HTMLElement — контейнер внутри модалки, куда вставляется основной контент (карточка товара, форма и т.д.).
windowElement: HTMLElement — внутренняя область модального окна (.modal__container), клик по которой не должен закрывать окно.

Методы класса: 
set content(value: HTMLElement): void — заменяет всё содержимое контейнера .modal__content на переданный элемент. 
open(): void — делает модальное окно видимым, добавляя CSS-класс modal_active к корневому контейнеру. 
close(): void — скрывает модальное окно, удаляя класс modal_active, и очищает внутренний контент (удаляет все дочерние элементы из .modal__content). 
render(data: IModalData): HTMLElement — стандартный метод отрисовки компонента. Принимает данные, вызывает базовый render, автоматически открывает окно и возвращает корневой контейнер.

#### Класс Success 
Отвечает за отображение экрана успешной оплаты (модального окна с подтверждением заказа).

Конструктор инициализирует состояние объекта, находя необходимые DOM-элементы внутри контейнера и подписываясь на событие клика по кнопке закрытия:
constructor(container: HTMLElement, events: IEvents) {
        super(container);

        this.descriptionElement = ensureElement('.order-success__description', this.container);
        this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

        this.closeButton.addEventListener('click', () => {
            events.emit('success:closed')
        });
    }

Поля класса: 
descriptionElement: HTMLElement — элемент, отображающий итоговую сумму списания.
closeButton: HTMLButtonElement — кнопка закрытия экрана.

Методы: 
set totalsum(value: number): void — обновляет текст в элементе описания.

#### Класс Form
Абстрактный класс, отвечает за базовую логику работы с формами.

Конструктор инициализирует состояние объекта, находя элемент для ошибок внутри переданного контейнера формы:
constructor(container: HTMLElement) { 
        super(container);

        this.errorsElement = ensureElement<HTMLElement>('.form__errors', this.container);
        this.buttonForm = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container)
    }

Поля класса: 
errorsElement: HTMLElement — элемент DOM внутри формы, предназначенный для вывода текстовых сообщений об ошибках валидации.
buttonForm: HTMLButtonElement - кнопка отправки формы. 

Методы:
set errors(message: string): void — устанавливает текстовое сообщение об ошибке в элемент errorsElement.
set buttonDisabled(isDisabled) - блокирует или разблокирует кнопку отправки (disabled атрибут).

#### Класс FormContacts
Отвечает за отображение и обработку формы ввода контактных данных (email и телефон) на этапе оформления заказа.

Конструктор инициализирует состояние объекта, находя необходимые DOM-элементы внутри контейнера формы, и подписывается на события ввода данных и клика по кнопке:
constructor(container: HTMLElement, events: IEvents) {
        super(container);

        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
        this.buttonToPay = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);

        this.emailInput.addEventListener('input', (e) => {
            const value = (e.target as HTMLInputElement).value;
            // Эмитим событие: "Пользователь изменил email"
            events.emit('customer:email-changed', { value });
        });

        this.phoneInput.addEventListener('input', (e) => {
            const value = (e.target as HTMLInputElement).value;
            // Эмитим событие: "Пользователь изменил телефон"
            events.emit('customer:phone-changed', { value });
        });

        this.buttonToPay.addEventListener('click', (e) => {
            e.preventDefault();
            events.emit('buttonToPay:clicked')
        });
    }

Поля класса: 
emailInput: HTMLInputElement — поле ввода для email-адреса.
phoneInput: HTMLInputElement — поле ввода для номера телефона. 
buttonToPay: HTMLButtonElement — кнопка подтверждения («Оплатить»), которая может блокироваться/разблокироваться в зависимости от валидности данных.

Методы: 
set email (value: string) - метод для валидации ошибок. 
set phone (value: string) - метод для валидации ошибок.


#### Класс FormOrder
Отвечает за отображение и обработку формы выбора способа оплаты и ввода адреса доставки. 
Предоставляет поля для ввода адреса, кнопки выбора способа оплаты (карта/наличные) и кнопку перехода к следующему шагу. Отслеживает изменения в реальном времени, эмитит соответствующие события и управляет доступностью кнопки «Далее». 

Конструктор инициализирует состояние объекта, находя необходимые DOM-элементы внутри контейнера формы, и подписывается на события ввода данных, выбора способа оплаты и клика по кнопке перехода:
    constructor(container: HTMLElement, events: IEvents) {
        super(container);

        this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);
        this.cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
        this.cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
        this.nextStepButton = ensureElement<HTMLButtonElement>('.order__button', this.container);

        this.addressInput.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            const value = target.value;
            // Эмитим событие: "Пользователь изменил адрес"
            events.emit('customer:address-changed', { value });
        });

        this.cardButton.addEventListener('click', (e) => {
            e.preventDefault();
            events.emit('payment:clicked', { method: 'card' }); // Одно событие, разные данные
        });

        this.cashButton.addEventListener('click', (e) => {
            e.preventDefault();
            events.emit('payment:clicked', { method: 'cash' }); // Одно событие, разные данные
        }); 
        
        this.nextStepButton.addEventListener('click', (e) => {
            e.preventDefault();
            events.emit('nextStepButton:clicked')
        });
    }

Поля класса: 
addressInput: HTMLInputElement — поле ввода для адреса доставки. 
cardButton: HTMLButtonElement — кнопка выбора оплаты картой. 
cashButton: HTMLButtonElement — кнопка выбора оплаты наличными. 
buttonNextStep: HTMLButtonElement — кнопка перехода к следующему шагу («Далее»), которая может блокироваться/разблокироваться в зависимости от валидности данных.

Методы: 
set address(value: string) — метод для валидации ошибок.
setPayment(type: 'card' | 'cash') - метод для валидации ошибок.

#### Класс Card
Абстрактный класс, отвечает за базовую структуру и логику отображения карточки товара: установку заголовка и цены. 

Конструктор инициализирует состояние объекта, находя необходимые элементы внутри контейнера карточки:
 constructor(container: HTMLElement) {
    super(container);// Передаем найденный элемент родителю

    this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
    this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);
    }

    protected set title(value: string) {
        this.titleElement.textContent = String(value);
    }

    protected set price(value: number | null) {
        if (value !== null && value !== undefined) {
        this.priceElement.textContent = `${value} синапсов`;
        }
        else {
            this.priceElement.textContent = `Бесценно`;
        }
    }

Поля класса: 
titleElement: HTMLElement — элемент DOM, отображающий заголовок товара. 
priceElement: HTMLElement — элемент DOM, отображающий цену товара.

Методы: 
set title(value: string): void — устанавливает текст заголовка карточки. 
set price(value: number | null): void — устанавливает цену товара.

#### Класс CardInCatalog
Отвечает за отображение карточки товара в каталоге. Управляет переключением CSS-классов для визуального выделения категории. Может принимать внешний обработчик клика. 

Конструктор инициализирует состояние объекта, находя необходимые DOM-элементы внутри контейнера карточки, и при необходимости подписывается на событие клика через переданный объект действий:
constructor(container: HTMLElement, actions?: ICardActions) {
        super(container); 
        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
        if (actions?.onClick) {
            this.container.addEventListener('click', actions.onClick);
        }       
    }

Поля класса: 
imageElement: HTMLImageElement — элемент изображения товара. 
categoryElement: HTMLElement — элемент отображения категории товара.

Методы: 
set image(value: string): void — устанавливает источник изображения для карточки. 
et category(value: string): void — устанавливает текст категории и переключает CSS-классы для визуального выделения. 

#### Класс CardPreview
Отвечает за отображение карточки товара в модальном окне (превью).

Конструктор инициализирует состояние объекта, находя необходимые DOM-элементы внутри контейнера, сохраняет начальный обработчик клика и вешает слушатель на кнопку:
    constructor(container: HTMLElement, events: IEvents) {
        super(container); 
        this.textElement = ensureElement<HTMLElement>('.card__text', this.container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);

        this.buttonElement.addEventListener('click', () => {
            events.emit('preview:clicked')
        });
    }

Поля класса:
textElement: HTMLElement — элемент DOM, отображающий текстовое описание товара. 
buttonElement: HTMLButtonElement — кнопка действия внутри карточки.
imageElement: HTMLImageElement - элемент DOM для управления изображением.
categoryElement: HTMLElement -элемент DOM для управления категорией.

Методы: 
set description(value: string) - обновляет описание карточки. 
set anotherTextButton(value: string) — обновляет текст на кнопке действия. 
set setDisabled(value: boolean) — блокирует или разблокирует кнопку действия.
set image - управляет ссылкой на изображение. 
set category - управляет категорией.

#### Класс CardInBasket
Отвечает за отображение карточки товара внутри корзины (в списке выбранных товаров). 

Конструктор инициализирует состояние объекта, находя необходимые DOM-элементы внутри контейнера карточки, устанавливает начальный порядковый номер и при необходимости подписывается на событие клика по кнопке удаления:
constructor(container: HTMLElement,  index: number, actions?: ICardActions) {
        super(container); 

        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

        this.index = index;

        if (actions?.onClick) {
            this.deleteButton.addEventListener('click', actions.onClick);
        };
    }

Поля класса: 
indexElement: HTMLElement — элемент DOM, отображающий порядковый номер товара в корзине. 
deleteButton: HTMLButtonElement — кнопка удаления товара из корзины.

Методы: 
set index(value: number): void — устанавливает и отображает порядковый номер товара в списке корзины.

#### Класс Basket
Отвечает за отображение и управление состоянием блока корзины (список товаров, итоговая цена, кнопка оформления заказа).

Конструктор инициализирует состояние объекта, находя необходимые DOM-элементы внутри контейнера блока корзины, и при необходимости подписывается на событие клика по кнопке оформления заказа:
constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this.basketElement = ensureElement<HTMLElement>('.basket__list', this.container);
        this.orderButton = ensureElement<HTMLButtonElement>('.basket__button',this.container);
        this.priceElement = ensureElement<HTMLElement>('.basket__price', this.container);

        if (actions?.onClick) {
            this.orderButton.addEventListener('click', actions.onClick);
        };
    }

Поля класса: 
basketElement: HTMLElement — контейнер для списка товаров в корзине. 
orderButton: HTMLButtonElement — кнопка оформления заказа. 
priceElement: HTMLElement — элемент отображения итоговой стоимости.

Методы: 
set basketList(items: HTMLElement[]): void — заменяет всё содержимое списка товаров в корзине на переданный массив DOM-элементов (карточек товаров). 
set price(value: number): void — устанавливает и отображает итоговую стоимость заказа. 
set isDisabled(value: boolean): void — блокирует или разблокирует кнопку оформления заказа. 

### Cобытия
События каталога товаров и карточки:
- 'catalog:updated' - эмитится моделью данных (ProductsCatalog) при изменении списка товаров.
Информирует о том, что список товаров изменился. Слушатели обязаны перерисовать галерею карточек.
- 'card:clicked' - генерируется компонентом представления (CardInCatalog) при клике пользователя на карточку товара в галерее.Сообщает о выборе конкретного товара. 
- 'selectedProduct:changed' - эмитится в ProductsCatalog. Сообщает об изменении выбранного товара.
- 'preview:clicked' - эмитится в CardPreview. Сообщает о том, что пользователь нажал кнопку действия (Добавить/Удалить) в превью.

События корзины:
- 'cart:changed' - генерируется в ProductsCart (после add/remove/clear).
- 'basket:opened' - генерируется при клике на кнопку корзины в шапке сайта (Header).
- 'card:deleted' - генерируется в CardInBasket (кнопка удаления в корзине).

Оформление заказа (Customer & Forms):

- 'customer:address-changed' - генерируется в FormOrder при каждом изменении текста в поле ввода адреса.
- 'payment:clicked' - генерируется в FormOrder при клике на кнопку выбора способа оплаты.
- 'customer:email-changed' - генерируется в FormContacts при каждом изменении текста в поле Email.
- 'customer:phone-changed' - генерируется в FormContacts при каждом изменении текста в поле Phone.
- 'customer:updated' - генерируется в Customer (внутри метода update, если данные изменились).
- 'nextStepButton:clicked' - генерируется в FormOrder (кнопка «Далее»).
- 'buttonToPay:clicked' - генерируется в FormContacts (кнопка «Оплатить»).
- 'success:closed' - генерируется в Success (кнопка закрытия окна успеха).
