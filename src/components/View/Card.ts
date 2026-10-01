import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface ICardData {
    title: string;
    price: number | null;
} 

export abstract class Card<T = object> extends Component<ICardData & T> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;

    constructor(container: HTMLElement) {
    super(container);// Передаем найденный элемент родителю

    this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
    this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);
    }

    protected set title(value: string) {
        this.titleElement.textContent = String(value);
    }

    protected set price(value: number | null) {
        if (value !== null && value !== undefined) {
        this.priceElement.textContent = `${value} синапсов`;
        }
        else {
            this.priceElement.textContent = `Бесценно`;
        }
    }
}