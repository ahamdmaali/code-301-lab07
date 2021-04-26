'use stric'

require('dotenv').config();

const express = require('express');
const server = express();

const PORT = process.env.PORT || 4500;
const cors = require('cors');
server.use(cors());
 
server.listen(PORT,()=>{})

const superagent = require('superagent');





server.get('/location',locationHandler) 
server.get('/weather',weatherHandler)
server.get('/park',parkHandler)
function locationHandler(req, res) {

    let cityName = req.query.city;
    let key =  process.env.LOCATION_KEY;
    let URL = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${cityName}&format=json`

    superagent.get(URL) 
        .then(geoData=>{
            let gData = geoData.body;
            let locationData = new Location(cityName,gData);
            res.send(locationData);
            
        })
          .catch(error=>{
            res.send(error);
        })
   
 
  
};
 
function weatherHandler (request, response){
    let cityName = request.query.city;
    let key = process.env.WEATHER_KEY;
    let WURL = `api.openweathermap.org/data/2.5/forecast?q={cityName}&appid={key}`
   
    superagent.get(WURL) 
        .then(weathData=>{
            console.log(weathData);
            let wData = weathData.body;
            let weatherData = wData.map((item,i)=>{
             return  new Weather (item);
            })
           
            response.send(weatherData);
            
        })
      
        .catch(error=>{
            response.send(error);
        }) 
 };



 function parkHandler(req,res){
    let cityName = req.query.city;
    let key = process.env.PARK_KEY;
    let pURL = `https://developer.nps.gov/api/v1/parks?parkCode=${cityName}&api_key=${key}`
   
    superagent.get(pURL) 
        .then(parkData=>{

            console.log(parkData);
            let pData = parkData.body;
            let park_Data = new Park (pData);
            res.send(park_Data);
            
        })
      
        .catch(error=>{
            response.send(error);
        }) 
 }

 server.get('*', (req, res) => {
    res.status(500).send('Sorry, something went wrong');
  })



let Location= function(cityName,locObj){
    this.search_query=cityName;
    this.formatted_query= locObj[0].display_namey;
    this.latitude= locObj[0].lat;
    this.longitude= locObj[0].lon;
  };

let Weather= function(waetherObj){
    
   this.forecast=waetherObj[0].weather.description;
   this.time=waetherObj[0].valid_date;
   
  };


let Park= function(parkObj){
    this.name= parkObj[0].name;
    this.address= parkObj[0].address;
    this.fee=parkObj[0].fee;
    this.description=parkObj[0].description;
    this.url=parkObj[0].url;
}
