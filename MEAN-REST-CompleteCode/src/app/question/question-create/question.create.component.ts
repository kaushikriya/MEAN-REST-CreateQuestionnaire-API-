import {Component,OnInit} from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {Ques} from '../question.model'
import {QuesService} from '../question.service'
import { ActivatedRoute, ParamMap } from '@angular/router';
import {mimeType} from './mime-type.validator'

@Component({
    selector: 'question-create',
    templateUrl: './question.create.component.html',
    styleUrls: ["./question.create.component.css"]
})

export class QuestionCreateComponent implements OnInit{
    private quesId: string;
    public isloading=false
    private mode:string= 'create';
    public ques: Ques
    imagePreview: string
    form: FormGroup;

    constructor(public QuesService: QuesService, public route: ActivatedRoute){}

    ngOnInit(){
        this.form= new FormGroup({
            que: new FormControl(null,{validators:[Validators.required,Validators.minLength(3)]}),
            ans: new FormControl(null,{validators:[Validators.required]}),
            image: new FormControl(null,{validators:[Validators.required], asyncValidators:[mimeType]})
            });

        this.route.paramMap.subscribe((paramMap: ParamMap)=>{
            if (paramMap.has('quesId')){
                this.mode='edit'
                this.quesId=paramMap.get('quesId')
                this.isloading=true;
                this.QuesService.getQue(this.quesId).subscribe(quesData=>{
                    this.isloading=false;
                    this.ques ={_id: quesData._id, que:quesData.que, ans: quesData.ans, imagePath: quesData.imagePath, creator: quesData.userId}
                },
                error=>{console.log(error)},
                ()=>{ this.form.setValue({
                    que: this.ques.que,
                    ans: this.ques.ans,
                    image: this.ques.imagePath})

                });
            }
            else{
                this.mode='create';
                this.quesId=null;

            }
        })
    }

    onImagePicked(event: Event){
    const file= (event.target as HTMLInputElement).files[0]
    this.form.patchValue({
        image: file
    })
    this.form.get('image').updateValueAndValidity();
    const reader= new FileReader();
    reader.onload=()=>{
        this.imagePreview=reader.result as string
        
    }
    reader.readAsDataURL(file)
      
    }
    onAddQues(){
        if(this.form.invalid){
            return;
        } 
        this.isloading=true
        const newQues: Ques={_id: null,
                        que: this.form.value.que, 
                       ans: this.form.value.ans,
                       imagePath: null,
                       creator: null
                    };
        if(this.mode==='create'){
            this.QuesService.addQues(newQues, this.form.value.image);
        }
        else{
            const newQues: Ques={_id: this.quesId,
               que: this.form.value.que, 
               ans: this.form.value.ans,
               imagePath: null,
               creator: null};
            this.QuesService.updateQues(this.quesId,newQues,this.form.value.image);
        }
        this.form.reset();
        
    };
    
}