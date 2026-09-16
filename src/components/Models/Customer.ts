import { IBuyer } from '../../types/index'
import { TPayment } from '../../types/index'
import { ValidationErrors } from '../../types/index'

export class Customer {
    private payment: TPayment;
    private email: string;
    private phone: string;
    private address: string;

    constructor() {
        this.payment = '';
        this.email = '';
        this.phone = '';
        this.address = '';
    }
    
    update(data: Partial<{ 
        payment?: TPayment; 
        email?: string; 
        phone?: string; 
        address?: string 
    }>): void {
    if (data.payment !== undefined) this.payment = data.payment;
    if (data.email !== undefined) this.email = data.email;
    if (data.phone !== undefined) this.phone = data.phone;
    if (data.address !== undefined) this.address = data.address;
    }

    getData(): IBuyer | null {
        if (!this.email && !this.phone && !this.address && this.payment === '') {
            return null;
        }
        return {
            payment: this.payment,
            email: this.email,
            phone: this.phone,
            address: this.address
        };
    }

    clear(): void {
        this.payment = '';
        this.email = '';
        this.phone = '';
        this.address = '';
    }

    validate(): ValidationErrors {
        const errors: ValidationErrors = {};

        if (!this.email.trim()) {
            errors.email = 'Укажите емэйл';
        }
        if (!this.phone.trim()) {
            errors.phone = 'Укажите телефон';
        }
        if (!this.address.trim()) {
            errors.address = 'Укажите адрес для доставки';
        }
        if (!this.payment) {
            errors.payment = 'Необходимо выбрать способ оплаты';
        }
        return errors;
    }

}

