import { Component, OnInit } from '@angular/core';

import { Router } from "@angular/router";

import  { AuthService } from "../providers/auth.service";

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {

  constructor(public authService: AuthService, private router:Router) { }

  ngOnInit() {
  }

  login() {
    this.authService.loginWithGoogle().then((data) => {
      this.router.navigate(['']);
    })
  }

}
