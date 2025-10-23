import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements OnInit {

  reports = [
    { date: "12/03/2025", account: "1234567890", type: "Deposit", amount: "USD 10,000.00" },
    { date: "09/02/2025", account: "1234567890", type: "Withdrawal", amount: "USD 2,500.00" },
    { date: "28/01/2025", account: "1234567890", type: "Transfer", amount: "USD 5,000.00" },
    { date: "15/01/2025", account: "1234567890", type: "Deposit", amount: "USD 8,000.00" },
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
