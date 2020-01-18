const express= require("express");

const router=express.Router()

const Que=require('../Model/QuesDB')

const multer=require('multer')

const checkAuth=require('../Middleware/check-auth')

const MIME_TYPE_MAP={
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
}

const storage=multer.diskStorage({
    destination: (req,file,cb)=>{
        const isValid=MIME_TYPE_MAP[file.mimetype];
        let error= new Error("invalid mime type")
        if(isValid){
            error=null
        }

        cb(error,'backend/images');
    },
    filename: (req,file,cb)=>{
        const name= file.originalname.toLowerCase().split('').join('-')
        const ext =MIME_TYPE_MAP[file.mimetype];
        cb(null, name+'-'+Date.now()+'.'+ext);
    }
});

router.post("",checkAuth, multer({storage: storage}).single("image"), (req, res, next) => {
    console.log('Logged in and creating posts')
    const url= req.protocol+'://' + req.get("host");
    const ques=new Que({
        que: req.body.que,
        ans: req.body.ans,
        imagePath: url + '/images/' + req.file.filename,
        creator: req.userData.userId
    })
    ques.save().then(result=>{
        console.log('Saving ques in database')
        res.status(201).json({
            message: 'Post added successfully',
            ques: {
             ...result,
             quesId: result._id
            }
            
          });
    })
   
  });

router.get('',(req,res,next)=>{
    pageSize=+req.query.pagesize;
    currentPage=+req.query.currentpage;
    const quesQuery= Que.find();
    let fetchedQues;
    if(pageSize && currentPage){
        quesQuery.skip(pageSize*(currentPage-1)).limit(pageSize)
    }
    quesQuery
    .then(documents=>{
        fetchedQues=documents;
        return Que.count();
       }).then(count=>{
        res.status(200).json({
            message: 'Ques fetched properly',
            ques: fetchedQues,
            maxQues:count
            // que: fetchedQues.que,
            // ans: fetchedQues.ans,
            // id:fetchedQues._id,
            // imagePath: fetchedQues.imagePath,
            // creator: fetchedQues.creator,
        });
       });
});

router.put('/:id',checkAuth, multer({storage: storage}).single("image"),(req,res,next)=>{
    let imagePath=req.body.imagePath;
    if(req.file){
        const url= req.protocol+'://' + req.get("host");
        imagePath=url + '/images/' + req.file.filename;
    }
    console.log()
    console.log('reached server')
    const que= new Que({
        que: req.body.que,
        ans: req.body.ans,
        _id: req.body._id,
        imagePath: imagePath,
        creator: req.userData.userId
    
    })
    console.log(que)
    Que.updateOne({_id:req.params.id, creator: req.userData.userId},que).then(response=>{
        if(response.nModified>0){
            Que.find().then(documents=>{
                res.status(200).json({imagePath: imagePath})
            })
        }
        else{
            res.status(401).json({message: "Not Authorised!"})
        }
 
    })
})

router.get('/:id',(req,res,next)=>{
    console.log('Reached dynamic get server side')
    Que.findById(req.params.id).then(resultQues=>{
        if(resultQues){
            res.status(200).json(resultQues)
        }
        else{
            res.status(404).json('Ques not found')
        }
    })
})

router.delete('/:_id',checkAuth, (req,res,next)=>{
console.log('Deleting posts from database')
console.log(req.params._id)
Que.deleteOne({_id : req.params._id, creator: req.userData.userId}).then(result=>{
    if(result.n>0){
        Que.find().then(documents=>{
            res.status(200).json({message:"Deletion successfull"})
        })
    }
    else{
        res.status(401).json({message: "Not Authorised!"})
    }
})
});

module.exports= router