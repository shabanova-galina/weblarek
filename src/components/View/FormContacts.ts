import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Form } from "./Form";

interface IFormContacts {
    email: string;
    phone: string;
}

export class FormContacts extends Form <IFormContacts>{
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;
    protected buttonToPay: HTMLButtonElement;

    constructor(container: HTMLElement,  events:IEvents) {
        super(container);

        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
        this.buttonToPay = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);

        this.emailInput.addEventListener('input', (e) => {
            const email = (e.target as HTMLInputElement).value;
            // Эмитим событие: "Пользователь изменил email"
            events.emit('customer:email-changed', { email });
        });
        this.phoneInput.addEventListener('input', (e) => {
            const phone = (e.target as HTMLInputElement).value;
            // Эмитим событие: "Пользователь изменил телефон"
            events.emit('customer:phone-changed', { phone });
        });

        this.buttonToPay.addEventListener('click', (e) => {
            e.preventDefault();
            events.emit('buttonToPay:clicked')
        });
    }

    set email (value: string) {
        this.emailInput.value = value;
    }
    
    set phone (value: string) {
        this.phoneInput.value = value;
    }

}
