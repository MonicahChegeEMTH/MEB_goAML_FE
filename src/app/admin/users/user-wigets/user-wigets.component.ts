import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "src/app/core/service/auth.service";
import { Account } from "../models/account";

@Component({
  selector: "app-user-wigets",
  templateUrl: "./user-wigets.component.html",
  styleUrls: ["./user-wigets.component.scss"],
})
export class UserWigetsComponent implements OnInit {
  activeAccounts: Account[] = [];
  lockedAccounts: Account[] = [];
  deletedAccounts: Account[] = [];
  allAccounts: Account[] = [];

  constructor(private accountService: AuthService, private router: Router) {
  }

  ngOnInit(): void {
    this.getActiveUserAccounts();
    this.getLockedAccounts();
    this.getAllAccounts();
    this.getDeletedAccounts();
  }

  getActiveUserAccounts() {
    this.accountService.allActiveUsers().subscribe(
        (res) => {
          this.activeAccounts = res;
        },
        (err) => {
          console.log(err);
        }
      );
  }

  getLockedAccounts() {
    this.accountService.allLockedUserAccounts().subscribe(
        (res) => {
          this.lockedAccounts = res;
        },
        (err) => {
          console.log(err);
        }
      );
  }

  getDeletedAccounts() {
    this.accountService.allDeletedUserAccounts().subscribe(
        (res) => {
          this.deletedAccounts = res;
        },
        (err) => {
          console.log(err);
        }
      );
  }

  getAllAccounts() {
    this.accountService.allUsers().subscribe(
        (res) => {
          this.allAccounts = res;
        },
        (err) => {
          console.log(err);
        }
      );
  }
}