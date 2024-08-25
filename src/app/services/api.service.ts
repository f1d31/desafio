import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
token:any='s5xiBYBZVsgQGwF2WaBTEB';
historyStocks:any =[];
  constructor(public http: HttpClient) { }

  getStocks(){
 let link = `https://brapi.dev/api/quote/list?limit=200&token=${this.token}`
 return this.http.get(link)
  }
  getStockDetail(id:any){
    //let link = `https://brapi.dev/api/quote/${id}?token=${this.token}`
   let link = `https://brapi.dev/api/quote/${id}?modules=summaryProfile&token=${this.token}`
    return this.http.get(link)
     }

     getGraphDetail(id:any){
     // let link = `https://brapi.dev/api/quote/${id},^BVSP?range=5d&interval=1d&fundamental=true&dividends=true&modules=balanceSheetHistory&token=${this.token}`
      let link = `https://brapi.dev/api/quote/${id}?range=5d&interval=1d&token=${this.token}`
      return this.http.get(link)
     }
}
