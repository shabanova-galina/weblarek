import { IBuyer } from '../../types/index';
import { TPayment } from '../../types/index';
import { ValidationError } from '../../types/index';
import { IEvents } from '../base/Events';

export class Customer {
    private events: IEvents;
    private payment: TPayment;
    private email: string;
    private phone: string;
    private address: string;

    constructor(events: IEvents) {
        this.events = events;
        this.payment = '';
        this.email = '';
        this.phone = '';
        this.address = '';
    }
    
    update(data: Partial<IBuyer>): void {
        let hasChanged = false;
        if (data.payment !== undefined && data.payment !== this.payment) {
            this.payment = data.payment;
            hasChanged = true;
        }
        if (data.email !== undefined && data.email !== this.email) {
            this.email = data.email;
            hasChanged = true;
        }
        if (data.phone !== undefined && data.phone !== this.phone) {
            this.phone = data.phone;
            hasChanged = true;
        }
        if (data.address !== undefined && data.address !== this.address) {
            this.address = data.address;
            hasChanged = true;
        }
        if (hasChanged) {
            this.events.emit('customer:updated', this.getData());
        }     
    }

    getData(): IBuyer {
        return {
            payment: this.payment,
            email: this.email,
            phone: this.phone,
            address: this.address
        };
    }

    clear(): void {
        const oldData = this.getData();

        this.payment = '';
        this.email = '';
        this.phone = '';
        this.address = '';

        this.events.emit('customer:updated', this.getData()
        );
    }

    validate(): ValidationError {
        const errors: ValidationError = {};

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

