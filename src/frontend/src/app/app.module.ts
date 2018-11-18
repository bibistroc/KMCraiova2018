import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppComponent } from './app.component';
import { MaterialModule } from './material-module';
import { RouterModule, Routes } from '@angular/router';
import { DrawComponent } from './draw/draw.component';
import { UserService } from './user/user.service';
import { SignalRService } from './signalr/signalr.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ChatComponent } from './chat/chat.component';
import { Chatervice } from './chat/chat.service';
import { EmailComponent } from './email/email.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmailService } from './email/email.service';


const appRoutes: Routes = [
  { path: 'draw', component: DrawComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'email', component: EmailComponent },
  { path: '',
    redirectTo: '/draw',
    pathMatch: 'full'
  }
  // , { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    DrawComponent,
    ChatComponent,
    EmailComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes
    ),
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    UserService,
    {
      provide: APP_INITIALIZER,
      useFactory: (userService: UserService) => () => userService.init(),
      deps: [UserService],
      multi: true
    },
    SignalRService,
    {
      provide: APP_INITIALIZER,
      useFactory: (signalR: SignalRService) => () => signalR.init(),
      deps: [SignalRService, HttpClient],
      multi: true
    },
    Chatervice,
    {
      provide: APP_INITIALIZER,
      useFactory: (chatService: Chatervice) => () => chatService.getHistory(),
      deps: [Chatervice, HttpClient, UserService, SignalRService],
      multi: true
    },
    EmailService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
