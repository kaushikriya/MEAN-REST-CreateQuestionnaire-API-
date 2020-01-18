import {RouterModule,Routes} from '@angular/router';
import {NgModule} from '@angular/core';

import { QuestionListComponent } from './question/question.list/question.list.component';
import { QuestionCreateComponent } from './question/question-create/question.create.component';
import { loginComponent } from './Auth/Login/login.component';
import { signUpComponent } from './Auth/SignUp/signUp.component';
import { authGuard } from './Auth/auth.guard';

const routes: Routes=[
    {path: '', component: QuestionListComponent},
    {path:'create', component: QuestionCreateComponent, canActivate:[authGuard]},
    {path:'edit/:quesId', component: QuestionCreateComponent, canActivate:[authGuard] },
    {path: 'login', component: loginComponent},
    {path: 'signup', component: signUpComponent}
]

@NgModule({
imports: [RouterModule.forRoot(routes)],
exports: [RouterModule],
providers: [authGuard]

})

export class AppRoutingModule{}