import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { XtermComponent } from './xterm/xterm.component';


// Define the routes
const ROUTES = [
  {
    path: '',
    redirectTo: 'xterm',
    pathMatch: 'full'
  },
  {
    path: 'xterm',
    component: XtermComponent
  },
  {
    path: 'xterm2',
    component: XtermComponent
  },
];

@NgModule({
  declarations: [
    AppComponent,
    XtermComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES) // Add routes to the app
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
