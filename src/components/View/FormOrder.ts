import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Form } from "./Form";

interface IFormOrder {
    buttonDisabled: boolean;
}

export class FormOrder extends Form <IFormOrder>{
    protected addressInput: HTMLInputElement;
    protected cardButton: HTMLButtonElement;
    protected cashButton: HTMLButtonElement;
    protected buttonNextStep: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);

        this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);
        this.cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
        this.cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
        this.buttonNextStep = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);

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
        
        this.buttonNextStep.addEventListener('click', (e) => {
            e.preventDefault();
            events.emit('buttonNextStep:clicked')
        });
    }

    set buttonDisabled(isDisabled: boolean) {
        this.buttonNextStep.disabled = isDisabled;
  }

}
