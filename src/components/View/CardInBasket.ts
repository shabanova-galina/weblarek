import { ensureElement } from "../../utils/utils";
import { Card } from "./Card";

export interface ICardBasket {
    index: number;
}

export interface ICardActions {
    onClick?: () => void;
} 

export class CardInBasket extends Card <ICardBasket> {
    protected indexElement: HTMLElement;
    protected deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement,  index: number, actions?: ICardActions) {
        super(container); 

        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

        this.index = index;

        if (actions?.onClick) {
            this.deleteButton.addEventListener('click', actions.onClick);
        };
    }

     set index(value: number) {
        this.indexElement.textContent = value.toString();
    }
}