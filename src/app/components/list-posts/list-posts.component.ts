import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Observable, Subscription } from 'rxjs';
import { Posts } from 'src/app/models/posts.model';
import { PostsService } from 'src/app/services/posts.service';
// import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';

@Component({
  selector: 'app-list-posts',
  templateUrl: './list-posts.component.html',
  styleUrls: ['./list-posts.component.css']
})
export class ListPostsComponent implements OnInit, OnDestroy {

  @ViewChild('dt') dt: Table | undefined;
  postsDialog: boolean = false;

  posts: Posts[] = [];

  post: Posts | null = null;

  selectedPosts: Posts[] = [];

  submitted: boolean = false;

  statuses: any[] = [];

  subscriptions: Subscription[] = [];
  isNew = false;
  statusOptions: any[] =[];

  // public Editor = ClassicEditor;

  constructor(private postsService: PostsService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.getPosts();
    this.statusOptions = [{label: 'הסתיים', value: 'הסתיים'}, {label: 'פתוח', value: 'פתוח'}];
    this.statuses = [
        {label: 'פתוח', value: 'OPEN'},
        {label: 'בתהליך', value: 'IN_PROGRESS'},
        {label: 'הסתיים', value: 'DONE'}
    ];
  }

  // public onChange( { editor }: ChangeEvent ) {
  //   const data = editor.getData();

  //   console.log( data );
  // }

  getPosts() {
    let subscriptionPosts: Subscription;
    subscriptionPosts = this.postsService.getPostsByUser()
    .subscribe(posts => {
      // console.log(posts);
			this.posts = posts;
		});
    this.subscriptions.push(subscriptionPosts);
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt?.filterGlobal(($event.target as HTMLInputElement).value, 'contains');
  }

  openNew() {
    this.post = {title:'', description:''};
    this.submitted = false;
    this.postsDialog = true;
    this.isNew = true;
  }

  deleteSelectedPosts() {
      this.confirmationService.confirm({
          message: 'האם אתה בטוח שברצונך למחוק?',
          header: 'אישור',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.selectedPosts.forEach(p => {
              let subscriptionDeletePost: Subscription;
              subscriptionDeletePost = this.postsService.deletePosts(p.id!)
              .subscribe(p => {
              });
              this.subscriptions.push(subscriptionDeletePost);

            });
            this.posts = this.posts.filter(val => !this.selectedPosts.includes(val));
            this.selectedPosts = [];
            this.messageService.add({severity:'success', summary: 'Successful', detail: 'נמחק בהצלחה', life: 3000});
          }
      });
  }

  editPosts(posts: Posts) {
      this.post = {...posts};
      // console.log(this.post);
      this.postsDialog = true;
      this.isNew = false;
  }

  deletePosts(post: Posts) {
      this.confirmationService.confirm({
          message: 'האם אתה בטוח שברצונך למחוק ' + post.title + '?',
          header: 'אישור',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            let subscriptionDeletePosts: Subscription;
            subscriptionDeletePosts = this.postsService.deletePosts(post.id!)
            .subscribe(p => {
              this.posts = this.posts.filter(val => val.id !== post.id);
              this.post = null;
              this.messageService.add({severity:'success', summary: 'Successful', detail: 'נמחק בהצלחה', life: 3000});
            });
            this.subscriptions.push(subscriptionDeletePosts);
          }
      });
  }

  hideDialog() {
      this.postsDialog = false;
      this.submitted = false;
  }

  savePosts() {
      this.submitted = true;

      let subscriptionSavePosts: Subscription;
      if (this.post!.title.trim()) {
        let obs: Observable<Posts>;
          if (this.post!.id) {
            subscriptionSavePosts = this.postsService.updatePosts(this.post!.id, this.post!)
            .subscribe(p => {
              this.posts[this.findIndexById(p.id)] = p;
              this.messageService.add({severity:'success', summary: 'Successful', detail: 'עודכן בהצלחה', life: 3000});
            });
          }
          else {
            subscriptionSavePosts = this.postsService.addPosts(this.post!.title, this.post!.description)
            .subscribe(p => {
              this.posts.push(p);
              this.messageService.add({severity:'success', summary: 'Successful', detail: 'נוסף בהצלחה', life: 3000});
            });
          }
          this.subscriptions.push(subscriptionSavePosts);
          this.posts = [...this.posts];
          this.postsDialog = false;
          this.post = null;
      }
  }

  findIndexById(id: string): number {
      let index = -1;
      for (let i = 0; i < this.posts.length; i++) {
          if (this.posts[i].id === id) {
              index = i;
              break;
          }
      }

      return index;
  }

  ngOnDestroy() {
    if (this.subscriptions) {
      this.subscriptions.forEach(s => s.unsubscribe());
    }
  }

}
