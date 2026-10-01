import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Form } from "./Form";

interface IFormContacts {
    buttonDisabled: boolean
}

export class FormContacts extends Form <IFormContacts>{
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;
    protected buttonToPay: HTMLButtonElement;

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

    set buttonDisabled(isDisabled: boolean) {
        this.buttonToPay.disabled = isDisabled;
  }
}
