import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Form } from "./Form";

interface IFormOrder {
    address: string;
    setPayment():void;
    
}

export class FormOrder extends Form <IFormOrder>{
    protected addressInput: HTMLInputElement;
    protected cardButton: HTMLButtonElement;
    protected cashButton: HTMLButtonElement;
    protected nextStepButton: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);

        this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);
        this.cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
        this.cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
        this.nextStepButton = ensureElement<HTMLButtonElement>('.order__button', this.container);

        this.addressInput.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            const address = target.value;
            // Эмитим событие: "Пользователь изменил адрес"
            events.emit('customer:address-clicked', { address });
        });

        this.cardButton.addEventListener('click', (e) => {
            e.preventDefault();
            events.emit('payment:clicked', { payment: 'card' }); // Одно событие, разные данные
        });

        this.cashButton.addEventListener('click', (e) => {
            e.preventDefault();
            events.emit('payment:clicked', { payment: 'cash' }); // Одно событие, разные данные
        }); 

        this.nextStepButton.addEventListener('click', () => {
            events.emit('nextStepButton:clicked')
        });

    }
        
    set address(value: string) {
        const safeValue = String(value || '');
        this.addressInput.value = safeValue;
    }

    setPayment(type: 'card' | 'cash') {
        
        this.cardButton.classList.remove('button_alt-active');
        this.cashButton.classList.remove('button_alt-active');

        if (type === 'card') {
            this.cardButton.classList.add('button_alt-active');
      
        } else if (type === 'cash') {
            this.cashButton.classList.add('button_alt-active');
        }
        }
    }




