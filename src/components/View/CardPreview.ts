import { ensureElement } from "../../utils/utils";
import { Card } from "./Card";

export interface ICardPreview {
    text: string;
    anotherTextButton: string;
    setDisabled: boolean;
}

export class CardPreview extends Card <ICardPreview> {
    protected textElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;
    private onButtonClick: () => void;

    constructor(container: HTMLElement, initialHandler: () => void) {
        super(container); 
        this.textElement = ensureElement<HTMLElement>('.card__text', this.container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);
        this.onButtonClick = initialHandler;

        this.buttonElement.addEventListener('click', (e) => {
            e.preventDefault();
            this.onButtonClick();
        });
    }

    public setOnClickHandler(handler: () => void): void {
        this.onButtonClick = handler;
    }

    set anotherTextButton(value: string) {
        this.buttonElement.textContent = value;
    }
    
    set text(value: string) {
        this.textElement.textContent = String(value);
    }

    set setDisabled(value: boolean) {
        this.buttonElement.disabled = value;
    }
}