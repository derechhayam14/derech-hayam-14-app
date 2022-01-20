import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-add-posts',
  templateUrl: './add-posts.component.html',
  styleUrls: ['./add-posts.component.css']
})
export class AddPostsComponent implements OnInit, OnDestroy {
  subscription: Subscription | undefined;

  constructor(private srv: PostsService,
    private router: Router,
    private messageService: MessageService) { }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const title = form.value.title;
    const description = form.value.description;

    this.subscription = this.srv.addPosts(title, description)
      .subscribe(
      resData => {
        this.messageService.add({severity:'success', summary: 'Success', detail:'עודכן בהצלחה'});
        this.router.navigate(['/home']);
      },
      errorMessage => {
        console.log(errorMessage);
        this.messageService.add({severity:'error', summary: 'Error', detail:'משתמש או סיסמא לא תקינים'})
      }
    );

    form.reset();
  }

  onCancel() {
    this.router.navigate(['/home']);
  }

  ngOnDestroy() {
    if(this.subscription)
      this.subscription.unsubscribe();
  }

}
