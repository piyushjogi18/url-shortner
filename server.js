const express = require('express');
const mongoose = require('mongoose');
const urlModel = require('./models/urlModel');

//initialize app
const app = express();

//connect with db

   const dbconnection =  mongoose.connect('mongodb://localhost:27017',{
    dbName:'urlshortner', useNewUrlParser: true, useUnifiedTopology: true
    })
    .then((db)=>{console.log('db connected')})
    .catch((e)=>{ console.log('error in connecting db',e); })

//we are using ejs templating langugage
app.set('view engine','ejs')

//to use full property of inputy type = url form field
app.use(express.urlencoded({extended:false}))

//routes

app.get('/',async (req,res)=>{
    try{
        let limit_  = parseInt(req.query.limit) || 5;
        let skip_records = req.query.skip || 0;
        let filter = req.query.clicks || 'all';
        let filter_obj;
        switch(filter){
            case 'all' : filter_obj={$gt:-1}; break;
            case 'less' : filter_obj={$lte:2}; break;
            case 'greater' :filter_obj={$gt:2}; break;
            default : filter_obj={$gt:-1};
        }
        let search_query = req.query.search || '';
        let regex = new RegExp(search_query);
        const urls = await urlModel.find({clicks:filter_obj,full:regex}).sort({_id:-1}).limit(limit_).skip(skip_records);
        let total_records =  (await urlModel.find({clicks:filter_obj,full:regex})).length;

        // const data = await urlModel.find();
        // console.log(data);
        // let pipeline = [
        //     {
        //         $match : {
        //            'clicks' : 2
        //         }  
        //     },
        //     {
        //        $limit :  limit_
        //     },
        //     {
        //         $sort : {
        //             _id : -1
        //         }
        //     }
        // ];
        // console.log(urlModel.aggregate(pipeline));
        // let urls = data.length;
        // let total_records = data.length;
        
        let num_of_pages =  Math.abs(total_records%limit_==0? total_records/limit_ :total_records/limit_+1); 
        res.render('index',{allUrls:urls,num_of_pages:num_of_pages,limit_:limit_,skip_:skip_records,search:search_query,clicks:filter});
    }
    catch(e){
        console.log(e);
    }    
})

app.post('/shortUrls',async (req,res)=>{
    try{
        await urlModel.create({full:req.body.fullurl});
        res.redirect('/');
    }
    catch(e){
        console.log(e);
    }    

})

app.get('/:shorturl',async (req,res)=>{
    try{
        const shortUrl = await urlModel.findOne({short:req.params.shorturl});
        if(shortUrl == null)
        return res.sendStatus(404);

        //else
        shortUrl.clicks++;
        shortUrl.save();
        res.redirect(shortUrl.full);
    }
    catch(e){
        console.log(e);
    } 
})

//listening
app.listen(process.env.PORT||5000);