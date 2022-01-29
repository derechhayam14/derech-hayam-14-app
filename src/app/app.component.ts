import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'derech-hayam14';
  pdfSrc: string = `D:\\Pini\\Dev\\Angular\\vaad-bait\\derech-hayam14\\src\\assets\\images\\protokol.pdf`;
  isUserUpdate = false;
  username= '';

  constructor(private domSanitizer : DomSanitizer,
    private router: Router,
    private auth: AuthService,
    private sanitizer: DomSanitizer) {}

  ngOnInit() {
    // this.domSanitizer.bypassSecurityTrustUrl(this.pdfSrc);
    // this.domSanitizer.bypassSecurityTrustResourceUrl(this.pdfSrc);
    this.auth.autoLogin();
    this.isLoginUser()
  }
  sanitize(url:string){
    console.log(url);
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  onSignIn() {
    localStorage.removeItem('userData');
    this.isUserUpdate = false;
    this.router.navigate(['/auth']);
    this.isLoginUser();
  }

  onSignOut() {
    localStorage.removeItem('userData');
    this.isUserUpdate = false;
    this.auth.user.next(null);
    this.isLoginUser();
    this.username = '';
  }

  goHome() {
    this.router.navigate(['/']);
    // this.router.navigate(['/home']);
  }

  onAddData() {
    this.router.navigate(['/posts']);
  }

  isLoginUser() {
    this.auth.user.subscribe(u => {
      // console.log(u);
      if (u) {
        this.isUserUpdate = true;
        // this.username = u.username;
        // this.username = `שלום ${u.username}`;
      }
    });
  }
}
