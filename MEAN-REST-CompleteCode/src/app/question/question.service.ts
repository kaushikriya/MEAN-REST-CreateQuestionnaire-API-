import {Ques} from './question.model'
import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router'

@Injectable({providedIn: 'root'})
export class QuesService{
   private ques: Ques[]=[];
   private quesUpdated=new Subject<{ques: Ques[], quesNum: number}>();

constructor(private http:HttpClient, private router: Router){}

getQues(pageSize: number, currentPage: number){
    let quesNum: number
    const queryParams= `?pagesize=${pageSize}&currentpage=${currentPage}`
     this.http.get<{message: string,ques: Ques[], maxQues: number}>('http://localhost:3000/api/ques'+queryParams)
     .subscribe((quesData)=>{
        this.ques=quesData.ques
        console.log(this.ques)
        quesNum=quesData.maxQues
        this.quesUpdated.next({ques: [...this.ques], quesNum: quesNum});
     });
}

quesUpdateListner(){
    return this.quesUpdated.asObservable()
}

addQues(que: Ques, image: File){
    console.log('Logged in and adding ques')
   const quesData=new FormData();
   quesData.append('que',que.que)
   quesData.append('ans', que.ans)
   quesData.append('image', image, que.que)
   this.http.post<{message: string, ques: Ques}>('http://localhost:3000/api/ques',quesData)
   .subscribe(responseData=>{
     this.router.navigate(['/'])
   }
    )};

getQue(quesId: string){
   return(this.http.get<{_id: string, que: string, ans: string, imagePath: string, userId:string}>('http://localhost:3000/api/ques/'+quesId))
}

updateQues(id: string, ques: Ques, image: File|string){
    let quesData: Ques| FormData
    if(typeof(image)==='object'){
      quesData= new FormData
      quesData.append('_id', id)
      quesData.append("que", ques.que)
      quesData.append("ans", ques.ans)
      quesData.append("image", image, ques.que)
    }
    else{
      quesData={
            _id: id,
            que: ques.que,
            ans: ques.ans,
            imagePath: image,
            creator: null
        }
    }
    this.http.put('http://localhost:3000/api/ques/'+id, quesData).subscribe(response=>{
        // const updatedQues=[...this.ques]
        // const oldQuesIndex= updatedQues.findIndex(q=>q._id===id)
        // const Ques: Ques={
        //     _id: id,
        //     que: ques.que,
        //     ans: ques.ans,
        //     imagePath: ""
        // }
        // updatedQues[oldQuesIndex]=Ques;
        // this.ques=updatedQues;
        // console.log(this.ques);
        // this.quesUpdated.next({ques:[...this.ques], quesNum: null});
        this.router.navigate(['/']);
    })
}

deleteQues(quesId:string){
   return  this.http.delete('http://localhost:3000/api/ques/'+quesId)
}
 //.subscribe(result=>
//     {
//         const updatedQues= this.ques.filter(ques=> ques._id!=quesId)
//         this.ques=updatedQues
//         this.quesUpdated.next({ques:[...this.ques], quesNum: null})

//     })
// }

}