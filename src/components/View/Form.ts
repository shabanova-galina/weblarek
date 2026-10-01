import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface IForm {
    errors: string;
}

export abstract class Form<T = object> extends Component<IForm & T> { 
    protected errorsElement: HTMLElement;

    constructor(container: HTMLElement) { 
        super(container);

        this.errorsElement = ensureElement<HTMLElement>('.form__errors', this.container)
    }

    protected set errors(message: string) {
        this.errorsElement.textContent = message;
    }
}
