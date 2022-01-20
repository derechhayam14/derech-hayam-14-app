import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Posts } from '../models/posts.model';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private http: HttpClient) { }
  getPosts() {
    return this.http.get<any>(`${environment.apiUrl}posts/with-user?status=פתוח`);
    // .pipe(
    //   map(data => {
    //     return data.map((p: any) => {
    //         return {
    //           id: p.id,
    //           title: p.title,
    //           description: p.description.replace('\n', '<br />'),
    //           status: p.status,
    //           date: p.date,
    //           user: p.user
    //         };
    //     });
    //   })
    // );
  }

  getPostsByUser() {
    return this.http.get<any>(`${environment.apiUrl}posts/user`);
  }

  addPosts(title: string, description: string) {
    return this.http.post<any>(`${environment.apiUrl}posts`,{title, description});
  }
  updatePosts(id: string, post: Posts) {
    const {title, description, status} = post;
    return this.http.put<any>(`${environment.apiUrl}posts/${id}`,{title, description, status});
  }
  deletePosts(id: string) {
    return this.http.delete<any>(`${environment.apiUrl}posts/${id}`);
  }
}
