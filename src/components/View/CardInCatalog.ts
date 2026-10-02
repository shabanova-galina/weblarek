import { IProduct } from "../../types";
import { categoryMap } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Card } from "./Card";

export interface ICardActions {
    onClick?: () => void;
} 

type CategoryKey = keyof typeof categoryMap;
export type ICardInCatalog = Pick<IProduct, 'image' | 'category'>;

export class CardInCatalog extends Card <ICardInCatalog> {
    protected imageElement: HTMLImageElement;
    protected categoryElement: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container); 

        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);

        if (actions?.onClick) {
            this.container.addEventListener('click', actions.onClick);
        }
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