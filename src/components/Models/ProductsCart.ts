import { IProduct } from '../../types/index';
import { IEvents } from '../base/Events'

export class ProductsCart {
    private items: IProduct[];

    constructor(protected events: IEvents) {
        this.items = [];
    }

    getItems(): IProduct[] {
        return this.items;
    }


    getTotalPrice(): number {
        return this.items.reduce((sum, item) => {
            const price = item.price ?? 0; // Если item.price === null, используем 0.
            return sum + price;
        }, 0);
    }
    
    getTotalCount(): number {
        return this.items.length;
    }
    

    hasItem(id: string): boolean {
        return this.items.some(item => item.id === id);
    } 


    addItem(product: IProduct): void {
        this.items.push(product);
        this.events.emit('cart:changed', { 
            item: product, 
            totalCount: this.items.length,
            totalPrice: this.getTotalPrice()
        });
    }

    removeItem(product: IProduct): void {
        const index = this.items.findIndex(item => item.id === product.id);
        if (index !== -1) {
            this.items.splice(index, 1);
        }
        this.events.emit('cart:changed', { 
                item: product, 
                totalCount: this.items.length,
                totalPrice: this.getTotalPrice()
            });
        }

      clear(): void {
        const removedItems = [...this.items];
        this.items = [];
        this.events.emit('cart:changed', { 
            removedItems, 
            totalCount: 0,
            totalPrice: 0
        });
    }
}

