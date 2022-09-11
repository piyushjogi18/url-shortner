const express = require('express');
const mongoose = require('mongoose');
const urlModel = require('./models/urlModel');

//initialize app
const app = express();

//connect with db
mongoose.connect('mongodb+srv://piyush_jogi1810:piyush_jogi1810@cluster0.nzs28.mongodb.net/?retryWrites=true&w=majority',{
   dbName:'urlshortner', useNewUrlParser: true, useUnifiedTopology: true
})

//we are using ejs templating langugage
app.set('view engine','ejs')

//to use full property of inputy type = url form field
app.use(express.urlencoded({extended:false}))

//routes

app.get('/',async (req,res)=>{
    const urls = await urlModel.find();
    res.render('index',{allUrls:urls});
})

app.post('/shortUrls',async (req,res)=>{
    await urlModel.create({full:req.body.fullurl});
    res.redirect('/');
})

app.get('/:shorturl',async (req,res)=>{
    const shortUrl = await urlModel.findOne({short:req.params.shorturl});
    if(shortUrl == null)
     return res.sendStatus(404);

    //else
    shortUrl.clicks++;
    shortUrl.save();
    res.redirect(shortUrl.full);
})

//listening
app.listen(process.env.PORT||5000);