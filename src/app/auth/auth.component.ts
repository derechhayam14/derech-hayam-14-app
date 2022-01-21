import { NgForm } from '@angular/forms';
import { Component, OnInit, ComponentFactoryResolver, ViewChild, OnDestroy } from '@angular/core';
import { AuthService } from './../services/auth.service';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {

  isLoginMode = true;
  isLoading = false;
  error: string | null = null;
  subscription: Subscription | undefined;

  constructor(private authService: AuthService,
              private router: Router,
              private messageService: MessageService) { }

  ngOnInit(): void {

  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    this.isLoading = true;

    this.subscription = this.authService.login(email, password)
      .subscribe(
      resData => {
        // console.log(resData);
        this.isLoading = false;
        // this.router.navigate(['/home']);
        this.router.navigate(['/']);
      },
      errorMessage => {
        console.log(errorMessage);
        this.messageService.add({severity:'error', summary: 'Error', detail:'משתמש או סיסמא לא תקינים'})
        this.error = errorMessage;
        this.isLoading = false;
      }
    );

    form.reset();
  }

  ngOnDestroy() {
    if(this.subscription)
      this.subscription.unsubscribe();
  }

}
