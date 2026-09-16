import { IApi, IProductsResponse, IOrderRequest, IOrderResponse } from "../../types";

export class AppApi {

  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  getProducts(): Promise<IProductsResponse> {
    return this.api.get<IProductsResponse>('/product/');
  }

  postOrder(orderData: IOrderRequest): Promise<IOrderResponse> {
    return this.api.post<IOrderResponse>('/order/', orderData);
  }
}