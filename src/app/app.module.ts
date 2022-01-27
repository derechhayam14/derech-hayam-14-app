import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { CarouselModule } from 'primeng/carousel';
import { GalleriaModule } from 'primeng/galleria';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { RippleModule } from 'primeng/ripple';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SelectButtonModule } from 'primeng/selectbutton';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { PostsComponent } from './components/posts/posts.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { AuthModule } from './auth/auth.module';
import { AuthInterceptorService } from './auth-interceptor-service';
import { AuthComponent } from './auth/auth.component';
import { AddPostsComponent } from './components/add-posts/add-posts.component';
import { AuthGuard } from './services/auth-guard.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { LinebreaksPipe } from './linebreaks.pipe';
import { ListPostsComponent } from './components/list-posts/list-posts.component';
import { TruncatePipe } from './truncate.pipe';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { SafeUrlPipe } from './safe-url.pipe';

const routes: Routes = [
  // { path: '', redirectTo: '/home', pathMatch: 'full' },
  // { path: 'home', component: HomeComponent },
  { path: '', component: HomeComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'add-posts', component: AddPostsComponent, canActivate: [AuthGuard] },
  { path: 'posts', component: ListPostsComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/not-found' },
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AuthComponent,
    PostsComponent,
    AddPostsComponent,
    LinebreaksPipe,
    ListPostsComponent,
    TruncatePipe,
    SafeUrlPipe,
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    // AuthModule,
    // PdfViewerModule,
    NgxExtendedPdfViewerModule,
    TableModule,
    ScrollingModule,
    ToastModule,
    InputTextModule,
    InputTextareaModule,
    ButtonModule,
    InputNumberModule,
    DropdownModule,
    ToolbarModule,
    CarouselModule,
    GalleriaModule,
    RippleModule,
    DialogModule,
    ConfirmDialogModule,
    SelectButtonModule,
    CKEditorModule,
  ],
  providers: [MessageService, ConfirmationService, {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
