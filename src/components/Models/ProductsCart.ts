import { IProduct } from '../../types/index'

export class ProductsCart {
    private items: IProduct[];

    constructor() {
        this.items = [];
    }

    getItems(): IProduct[] {
        return this.items;
    }

    addItem(product: IProduct): void {
        this.items.push(product);
    }

    removeItem(product: IProduct): void {
        const index = this.items.findIndex(item => item.id === product.id);
        if (index !== -1) {
            this.items.splice(index, 1);
        }
    }

    clear(): void {
        this.items = [];
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
}