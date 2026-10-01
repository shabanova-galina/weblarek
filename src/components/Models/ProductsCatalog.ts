import { IProduct } from '../../types/index';
import { IEvents } from '../base/Events';

export class ProductsCatalog {
    private products: IProduct[];
    private selectedProduct: IProduct | null;

    constructor(protected events: IEvents) {
        this.products = [];
        this.selectedProduct = null;
    }

    setProducts(products: IProduct[]): void {
        this.products = products;
        this.events.emit('catalog:changed', { products: this.products });
    }

    getProducts(): IProduct[] {
        return this.products;
    }

    getProductById(productId: string): IProduct | undefined {
        return this.products.find(p => p.id === productId);
    }

    setSelectedProduct(product: IProduct): void {
    this.selectedProduct = product;
    this.events.emit('selectedProduct:changed', { product: this.selectedProduct });
    }

    getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
    }
}


/*
events.on('catalog:updated', (data) => {
    // data — это тот самый объект { items: [...] }, который мы передали!
    
    console.log('Я получил новые товары:', data.items); 
    
    // Теперь мы можем сразу использовать эти данные, не спрашивая модель заново
    this.galleryView.renderList(data.items);
}); 


    events.on('selectedItem:changed', (data) => {
        // data.item — это уже готовый объект товара!
        this.modalView.open();
        this.modalView.setContent(data.item); // Передаем сразу
    });
    

*/