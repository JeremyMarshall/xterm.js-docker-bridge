import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { XtermComponent } from './xterm/xterm.component';
import { PostsService } from './posts.service';
import { PostsComponent } from './posts/posts.component';


// Define the routes
const ROUTES = [
  {
    path: '',
    redirectTo: 'posts',
    pathMatch: 'full'
  },
  {
    path: 'posts',
    component: PostsComponent
  },
  {
    path: 'xterm',
    component: XtermComponent
  },
];

@NgModule({
  declarations: [
    AppComponent,
    PostsComponent,
    XtermComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES) // Add routes to the app
  ],
  providers: [PostsService], // Add the posts service
  bootstrap: [AppComponent]
})
export class AppModule { }
