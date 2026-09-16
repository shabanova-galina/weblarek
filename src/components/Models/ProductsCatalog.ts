import { IProduct } from '../../types/index'

export class ProductsCatalog {
    private products: IProduct[];
    private selectedProduct: IProduct | null;

    constructor() {
        this.products = [];
        this.selectedProduct = null;
    }

    setProducts(products: IProduct[]): void {
        this.products = products;
    }

    getProducts(): IProduct[] {
        return this.products;
    }

    getProductById(productId: string): IProduct | undefined {
        return this.products.find(p => p.id === productId);
    }

    setSelectedProduct(product: IProduct): void {
    this.selectedProduct = product;
    }

    getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
    }
}