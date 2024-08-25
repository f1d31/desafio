import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../services/api.service';
import { FormsModule } from '@angular/forms';
import { DetailStockComponent } from '../modals/detail-stock/detail-stock.component';
import { ToastService } from '../services/toast.service';
import { ToastsContainer } from '../services/toasts-container.component';
//import { Chart } from 'chart.js';
import { Chart } from 'chart.js/auto';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,FormsModule,ToastsContainer],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit,OnDestroy {
  showRightPanel:boolean = false;
  stockList:any=[];
  stockDetails:any;
  amount:any = 0;
  @ViewChild('standardTpl') standardTpl:any;
  @ViewChild('standardTpl2') standardTpl2:any;
  private modalService = inject(NgbModal);
  toastService = inject(ToastService);
  showContent:boolean = false;
  constructor(public service: ApiService){}
  ngOnInit(): void {
    this.service.getStocks().subscribe((res:any) =>{
      
      this.stockList = res.stocks;
    })
    let v:any = localStorage.getItem('history')
    let data = JSON.parse(v) ;
    if(data){
      this.service.historyStocks = data; 
    }
    this.checkScreenSize(window.innerWidth);
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    const width = (event.target as Window).innerWidth;
    this.checkScreenSize(width);
  }
  private checkScreenSize(width: number): void {
    if (width <= 992) {
      this.showRightPanel =  false;
      this.showContent =  false;
     } 
  }
  ngOnDestroy(): void {
		this.toastService.clear();
	}
  showPanel(stock:any){
    //this.showRightPanel =  false;
    this.showContent = false;
    this.stockDetails = [];
  this.service.getStockDetail(stock.stock).subscribe((res:any) => {
    this.stockDetails = res.results[0]
    this.showContent = true;
    this.showRightPanel =  true;
  })

 this.service.getGraphDetail(stock.stock).subscribe((res:any) => {
 const stockPrices = res.results[0].historicalDataPrice.map((item: any) => item.close);
  const dates = res.results[0].historicalDataPrice.map((item: any) => this.convertUnixTimestamp(item.date));
  setTimeout(() => {
    this.renderChart(dates, stockPrices);
  }, 1000);
  
})

  }
  convertUnixTimestamp(timestamp:any) {
    const date = new Date(timestamp * 1000);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  }
  hidePanel(){
    this.showRightPanel =  false;
    this.stockDetails =[];
  }
  stockP(value:any){
    let obj = {
      id: this.stockDetails.symbol,
      stock : this.stockDetails.shortName,
      amount: this.amount,
      stockStatus:value,
      timestamp:new Date(),
    }
    this.amount = 0;
    if (!Array.isArray(this.service.historyStocks)){
      this.service.historyStocks =[]
    }
    this.service.historyStocks.push(obj);
    let data = JSON.stringify(this.service.historyStocks)
    localStorage.setItem('history',data)
  if(value == 'comprado'){
    this.showSuccess(this.standardTpl)
  }
  else{
    this.showSuccess(this.standardTpl2)
  }
  }

  openModal(stock:any){
   const modalRef =  this.modalService.open(DetailStockComponent, { size:'md', centered: true });
      modalRef.componentInstance.data = stock;
  }

  showSuccess(template: TemplateRef<any>) {
		this.toastService.show({ template, classname: 'bg-success text-light', delay: 10000 });
	}

	showDanger(template: TemplateRef<any>) {
		this.toastService.show({ template, classname: 'bg-danger text-light', delay: 15000 });
	}

  renderChart(labels: string[], data: number[]): void {
    new Chart('stockChart', {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Preço da ação',
            data: data,
            borderColor: 'white',
            borderWidth: 2,
            fill: false
          }
        ]
      },
      options: {
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              color: 'white'  
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.2)'  // Optional: Set y-axis grid lines to a lighter white
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: 'white'  
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.2)'  // Optional: Set y-axis grid lines to a lighter white
            }
          }
        }
      }
    });
  }
}
