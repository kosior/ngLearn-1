import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs/Observable';
import {ShoppingCartService} from '../shopping-cart/shopping-cart.service';

@Injectable()
export class OrderService {
  private saveOrderUrl = environment.apiBaseUrl + 'orders/';

  constructor(private http: HttpClient, private cartService: ShoppingCartService) { }

  placeOrder(order): Observable<any> {
    return this.http.post(this.saveOrderUrl, order)
      .do(() => this.cartService.clearCart());
  }

}
