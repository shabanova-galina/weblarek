import { ensureElement } from "../../utils/utils";
import { Card } from "./Card";
import { IEvents } from "../base/Events";
import { categoryMap } from "../../utils/constants";

export interface ICardPreview {
    description: string;
    anotherTextButton: string;
    setDisabled: boolean;
    image: string;
    category: string;
}

type CategoryKey = keyof typeof categoryMap;

export class CardPreview extends Card <ICardPreview> {
    protected textElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;
    protected imageElement: HTMLImageElement;
    protected categoryElement: HTMLElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container); 
        this.textElement = ensureElement<HTMLElement>('.card__text', this.container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);

        this.buttonElement.addEventListener('click', () => {
            events.emit('preview:clicked')
        });
    }
    set description(value: string) {
        this.textElement.textContent = String(value);
    }

    set anotherTextButton(value: string) {
        this.buttonElement.textContent = value;
    }

    set setDisabled(value: boolean) {
        this.buttonElement.disabled = value;
    }

    set image(value: string) {
        this.imageElement.src = value;
    }

    set category(value: string) {
        this.categoryElement.textContent = value;

        for (const key in categoryMap) {
            this.categoryElement.classList.toggle(
                categoryMap[key as CategoryKey],
                key === value
            );
        }
    }
}