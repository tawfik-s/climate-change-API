const port=process.env.PORT||3000;
const express=require('express');
const cheerio=require('cheerio');
const axios=require('axios');
const {response} = require("express");

const app=express();
const articles=[];
const dataSources=[
    {
        name: 'cityam',
        url: 'https://www.cityam.com/london-must-become-a-world-leader-on-climate-change-action/',
        base: ''
    },
    {
        name: 'thetimes',
        url: 'https://www.thetimes.co.uk/environment/climate-change',
        base: ''
    },
    {
        name: 'guardian',
        url: 'https://www.theguardian.com/environment/climate-crisis',
        base: '',
    },
    {
        name: 'telegraph',
        url: 'https://www.telegraph.co.uk/climate-change',
        base: 'https://www.telegraph.co.uk',
    },
    {
        name: 'nyt',
        url: 'https://www.nytimes.com/international/section/climate',
        base: '',
    },
    {
        name: 'latimes',
        url: 'https://www.latimes.com/environment',
        base: '',
    },
    {
        name: 'smh',
        url: 'https://www.smh.com.au/environment/climate-change',
        base: 'https://www.smh.com.au',
    },
    {
        name: 'un',
        url: 'https://www.un.org/climatechange',
        base: '',
    },
    {
        name: 'bbc',
        url: 'https://www.bbc.co.uk/news/science_and_environment',
        base: 'https://www.bbc.co.uk',
    },
    {
        name: 'es',
        url: 'https://www.standard.co.uk/topic/climate-change',
        base: 'https://www.standard.co.uk'
    },
    {
        name: 'sun',
        url: 'https://www.thesun.co.uk/topic/climate-change-environment/',
        base: ''
    },
    {
        name: 'dm',
        url: 'https://www.dailymail.co.uk/news/climate_change_global_warming/index.html',
        base: ''
    },
    {
        name: 'nyp',
        url: 'https://nypost.com/tag/climate-change/',
        base: ''
    }

];

dataSources.forEach(dataSource=>{
    axios.get(dataSource.url).then((response)=>{
        const html=response.data;
        const $=cheerio.load(html);
        $('a:contains("climate")',html).each(function(){
            const title=$(this).text();
            const url=$(this).attr('href')
            articles.push({
                title,
                url:dataSource.base+url,
                source:dataSource.name
            })
        })
    }).catch(err=>console.log(err));
})

app.get('/',(req,res)=>{
    res.json('welcome to my climate chane news API');
})

app.get('/news',(req,res)=>{

    res.json(articles);
})

app.get('/news/:newspaperId', (req,res)=>{
    const newspaperId=req.params.newspaperId;
    const news=articles.filter(data=>data.source===newspaperId);
    //console.log(news);
    res.json(news);
})

app.get('/available_newspaper',(req,res)=>{
    const names=[];
    dataSources.forEach(dataSource=>{
        names.push(dataSource.name);
    });
    res.json(names);
})

app.listen(port,()=>console.log(`server running on port ${port}`));