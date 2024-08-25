import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-history.component.html',
  styleUrl: './view-history.component.scss'
})
export class ViewHistoryComponent implements OnInit {
  constructor(public service: ApiService){}
  ngOnInit(): void {
    let v:any = localStorage.getItem('history')
    let data = JSON.parse(v) ;
    this.service.historyStocks = data; 
  }
}
