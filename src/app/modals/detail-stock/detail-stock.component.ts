import { Component, inject, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';
import { ToastsContainer } from '../../services/toasts-container.component';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-detail-stock',
  standalone: true,
  imports: [FormsModule,CommonModule,ToastsContainer],
  templateUrl: './detail-stock.component.html',
  styleUrl: './detail-stock.component.scss'
})
export class DetailStockComponent implements OnInit {
  activeModal = inject(NgbActiveModal);
  @Input() data:any;
  amount:any =0;
  stockDetails:any;
  toastService = inject(ToastService);
  @ViewChild('standardTpl') standardTpl:any;
  @ViewChild('standardTpl2') standardTpl2:any;
  constructor(public service:ApiService){}
  ngOnInit(): void {
    this.service.getStockDetail(this.data.stock).subscribe((res:any) => {
      this.stockDetails = res.results[0];
    })
    this.service.getGraphDetail(this.data.stock).subscribe((res:any) => {
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
  close(){
    this.activeModal.close()
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
   this.close()
  }

  showSuccess(template: TemplateRef<any>) {
		this.toastService.show({ template, classname: 'bg-success text-light', delay: 10000 });
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
