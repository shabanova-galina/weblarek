import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface IForm {
    errors: string;
    buttonDisabled: boolean;
}

export abstract class Form<T = object> extends Component<IForm & T> { 
    protected errorsElement: HTMLElement;
    protected buttonForm: HTMLButtonElement;

    constructor(container: HTMLElement) { 
        super(container);

        this.errorsElement = ensureElement<HTMLElement>('.form__errors', this.container);
        this.buttonForm = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
    }

    set errors(message: string) {
        this.errorsElement.textContent = message;
    }

    set buttonDisabled(isDisabled: boolean) {
        this.buttonForm.disabled = isDisabled;
  }
}
