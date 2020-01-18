import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http'
import {
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatToolbarModule,
  MatExpansionModule,
  MatProgressSpinnerModule,
  MatListModule,
  MatPaginatorModule,
} from "@angular/material";

import { AppComponent } from "./app.component";
import { HeaderComponent } from "./header/header.component";
import {QuestionCreateComponent} from './question/question-create/question.create.component';
import {QuestionListComponent} from './question/question.list/question.list.component';
import {loginComponent} from './Auth/Login/login.component'
import { RouterModule } from "@angular/router";
import { AppRoutingModule } from "./app-routing";
import { signUpComponent } from "./Auth/SignUp/signUp.component";
import { AuthInterceptor } from "./Auth/auth-interceptor";


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    QuestionCreateComponent,
    QuestionListComponent,
    loginComponent,
    signUpComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatPaginatorModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi:true} ],
  bootstrap: [AppComponent]
})
export class AppModule {}
