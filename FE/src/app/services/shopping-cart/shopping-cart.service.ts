import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Product} from '../../models/product.model';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs/Observable';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {Subject} from 'rxjs/Subject';
import {Cart} from '../../models/cart.model';
import {Items} from '../../models/item.model';


interface ApiCartResponse {
  uuid: string;
  user: number;
  created: string;
}


@Injectable()
export class ShoppingCartService {
  private cartsUrl = environment.apiBaseUrl + 'carts/';
  private cartSubject: Subject<Cart> = new ReplaySubject(1);
  public cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeCart();
  }

  private getItemsUrl(cartId: string): string {
    return this.cartsUrl + cartId + /items/;
  }

  private create() {
    return this.http.post<ApiCartResponse>(this.cartsUrl, {});
  }

  private initializeCart() {
    const cartId = localStorage.getItem('cartId');
    if (cartId) {
      this.http.get<Items>(this.getItemsUrl(cartId))
        .subscribe(items => this.cartSubject.next(new Cart(items)));
    }
  }

  private getOrCreateCartId(): Observable<string> {
    const cartId = localStorage.getItem('cartId');
    if (cartId) {
      return Observable.of(cartId);
    }

    return this.create()
      .switchMap(result => {
        localStorage.setItem('cartId', result.uuid);
        return result.uuid;
      });
  }

  private updateProductQuantity(productId: number, quantity: 1 | -1) {
    this.getOrCreateCartId()
      .take(1)
      .subscribe(cartId => {
        this.http.post<Items>(this.getItemsUrl(cartId), {product: productId, quantity: quantity})
          .do(items => { this.cartSubject.next(new Cart(items)); })
          .subscribe();
      });
  }

  addToCart(product: Product) {
    this.updateProductQuantity(product.id, 1);
  }

  removeFromCart(product: Product) {
    this.updateProductQuantity(product.id, -1);
  }
}
