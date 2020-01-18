const jwt=require('jsonwebtoken')

module.exports=(req,res,next)=>{
    try{
        const token=req.headers.authorization.split(" ")[1]
        decodedToken= jwt.verify(token,'long_long_reallyLong_string');
        req.userData={email: decodedToken.email, userId: decodedToken.userId}
        next();
    }catch(err){
       res.status(401).json({error: err})
    }
   
}