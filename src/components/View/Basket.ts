import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface IBasket {
    basketList: HTMLElement[];
    price: number;
    isDisabled: boolean;
}

export interface ICardActions {
    onClick?: () => void;
} 

export class Basket extends Component<IBasket> {
    protected basketElement: HTMLElement;
    protected orderButton: HTMLButtonElement; 
    protected priceElement: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this.basketElement = ensureElement<HTMLElement>('.basket__list', this.container);
        this.orderButton = ensureElement<HTMLButtonElement>('.basket__button',this.container);
        this.priceElement = ensureElement<HTMLElement>('.basket__price', this.container);

        if (actions?.onClick) {
            this.orderButton.addEventListener('click', actions.onClick);
        };
    }

    set basketList(items: HTMLElement[]) {
        this.basketElement.replaceChildren(...items);
    }

    set price(value: number) {
        this.priceElement.textContent = `${value} синапсов`;
    };

    set isDisabled(value: boolean) {
        this.orderButton.disabled = value;
    }
}


