const adminAuth = (req,res,next)=>{
    const token = req.query.token;
    const authorised = token === "paritosh";
    if(authorised){
        next()
    }else{
        res.status(403).send("not authorised")
    }
}

module.exports ={
    adminAuth,
}