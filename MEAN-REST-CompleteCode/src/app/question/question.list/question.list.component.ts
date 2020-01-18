import {Component, OnInit,OnDestroy} from '@angular/core'
import {Subscription} from 'rxjs';
import {QuesService} from '../question.service'

import {Ques} from '../question.model'
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app/Auth/auth-service';

@Component({
    selector: 'question-list',
    templateUrl: './question.list.component.html',
    styleUrls: ['./question.list.component.css']
})

export class QuestionListComponent implements OnInit,OnDestroy{
    ques: Ques []=[];
    totalQues=10;
    quesPerPage=2
    currentPage=1
    pageSizeOptions=[1,2,4,8,10]
    public userId: string;
    public isAuthenticated=false;
    public isLoading=false
    private quesSub=new Subscription();
    private authSub: Subscription;
    
    constructor( public QuesService: QuesService,
                 private authService: AuthService){}
    ngOnInit(){
        this.isLoading=true;
        this.userId=this.authService.getuserId()
        this.QuesService.getQues(this.quesPerPage,this.currentPage);
        this.quesSub= this.QuesService.quesUpdateListner().subscribe((quesData: {ques:Ques[], quesNum: number})=>{
        this.isLoading=false;
        this.ques=quesData.ques;
        console.log(this.ques)
        });
        this.isAuthenticated=this.authService.getIsAuth()

        this.authSub=this.authService.getauthStatus().subscribe(autheication=>{
            this.isAuthenticated=autheication;
            this.userId=this.authService.getuserId()
        })
    
    }

    ngOnDestroy(){
        this.quesSub.unsubscribe();
    }

    onChangedPage(pageData: PageEvent){
        this.isLoading=true
        this.currentPage=pageData.pageIndex+1
        this.quesPerPage=pageData.pageSize
        this.QuesService.getQues(this.quesPerPage,this.currentPage);
    }

    onDelete(QuesId:string){
        this.isLoading=true;
        this.QuesService.deleteQues(QuesId).subscribe(()=>{
         this.QuesService.getQues(this.quesPerPage,this.currentPage)
     })
    }
}


