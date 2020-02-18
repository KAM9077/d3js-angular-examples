import { Injectable } from '@angular/core';
// import { ApiEnv } from '../utils';
// import { HandelAPIsRequestService } from './handel-apis-request.service';
// import { AuthenticationService } from './authentication.service';
import {retry, catchError, tap, map } from 'rxjs/operators';
import { HttpClient, HttpEvent, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class DataService {
  
//   private urlRouteCartItems = new ApiEnv().getURlRouteCartItems();
  
  constructor(
    private http: HttpClient
    ) { 
  }

  getData(){
        return this.http.get("https://jsonplaceholder.typicode.com/todos")
            .pipe(map(data => {
            //   catchError(this.handel.handleError);
            let aaa = data;
            // console.log(data)
              return aaa;
            }
            ));
  };

//   editCartItems (cart){
//     return this.http.put<any>(this.urlRouteCartItems.edit, cart)
//     .pipe(map(data => {
//         catchError(this.handel.handleError);
//         return this.handel.extractData(data);
//       }));
//   };

//   addCartItem(cartItem){
//     return this.http.post<any>(this.urlRouteCartItems.add, cartItem)
//     .pipe(map(data => {
//       catchError(this.handel.handleError);
//       return this.handel.extractData(data);
//     }));    
//   }

//   removeCartItemCode(ids){
//     const options = {
//       headers: new HttpHeaders({
//         'Content-Type': 'application/json',
//       }),
//       body: {
//         cart_item_id: ids,
//       },
//     }
//     return this.http.delete<any>(this.urlRouteCartItems.removeVoucherFromCartItem, options)
//     .pipe(map(data=>{
//       catchError(this.handel.handleError);
//       return this.handel.extractData(data);
//     }));
//   };
}