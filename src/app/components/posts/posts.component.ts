import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Posts } from 'src/app/models/posts.model';
import { PostsService } from 'src/app/services/posts.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  posts = new BehaviorSubject<Posts[] | null>(null);
  isCircular = true;
  interval = 10000;
  length = 0;
  idTimer: any;
  intervalTime = 30;
  constructor(private postsService: PostsService,
    private sanitizer:DomSanitizer) { }

  ngOnInit(): void {
    this.getPosts();
    this.idTimer = setInterval(() => {
      this.getPosts();
    }, this.intervalTime * 1000);
  }

  sanitize(url:string){
    console.log(url);
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  getPosts() {
    let subscriptionPosts: Subscription;
    subscriptionPosts = this.postsService.getPosts()
    .subscribe(posts => {
      // console.log(posts);
      posts.sort((a: Posts ,b: Posts ) => (a.date! > b.date!) ? 1 : ((b.date! > a.date!) ? -1 : 0))
      // console.log(posts);
			this.posts.next(posts);
      this.length = posts.length;
      // console.log('length: ', this.length);
		});
    this.subscriptions.push(subscriptionPosts);
  }

  ngOnDestroy() {
    if (this.subscriptions) {
      this.subscriptions.forEach(s => s.unsubscribe());
    }
    if (this.idTimer) {
      clearInterval(this.idTimer);
    }
  }

}
