var express = require('express');
const request = require('request');
const cheerio = require('cheerio');

var router = express.Router();

/* 取得天氣 */
function getWeatherData(){
    return new Promise((resolve, reject)=>{
        const weatherURL = {
            method: 'GET',
            url: 'https://www.cwb.gov.tw/V7/forecast/f_index.htm?_=1520066649682'
        };
        let data = {};
        request(weatherURL, function (error, response, body) {
            if (error) reject();
            var $ = cheerio.load(body);
            data.modifyedDate = $('.modifyedDate').text();
            data.area = [];
            $('div[class$="Area"], .Archipelagoes table').map((index, item) => {
                let obj = {};
                obj.title = $(item).find('th').text();
                obj.region = [];
                $(item).find('tr').has('td').map((i, m) => {
                    let region = {};
                    region.county = $(m).find("td").eq(0).text();
                    region.temperature = $(m).find("td").eq(1).text();
                    region.probability = $(m).find("td").eq(2).text();
                    region.icon = $(m).find("img").attr('title');
                    obj.region.push(region);
                });
                data.area.push(obj);
            });
            resolve(data);
        });
    }); 
}

/* GET home page. */
router.get('/', function(req, res, next) {
    getWeatherData()
    .then((data)=>{
        res.render('index', { title: '天氣預報', data: data });
    })
    .catch((error)=>{

    });
});


module.exports = router;
