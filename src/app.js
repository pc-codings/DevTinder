const express = require('express');

const app = express();


app.use("/test",function(req, res) {
    res.send("hello from here");
    }
)
app.listen(3000,()=>{
    console.log('listening on 3000')
});