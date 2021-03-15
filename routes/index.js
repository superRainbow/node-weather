const express = require('express');
const cheerio = require('cheerio');
const phantom = require('phantom');
const router = express.Router();
const baseURL = 'https://www.cwb.gov.tw';

let content;

/* 取得天氣 */
async function getWeatherData () {
    const instance = await phantom.create();
    const page = await instance.createPage();
    const status = await page.open('https://www.cwb.gov.tw/V8/C/W/OBS_Map.html');
    content = await page.property('content');
    await instance.exit();
};

/* 處理資料 */
async function handelData(){
    let data = {};
    var $ = cheerio.load(content);
    data.date = $('#preestimate').text();
    data.area = [];
    $('#town li').map((index, item) => {
        let obj = {};
        obj.title = $(item).find('.city').text();
        obj.temperature = $(item).find('.tem-C').text() ? $(item).find('.tem-C').text() + '˚C' : '查無資料';
        obj.icon = baseURL + $(item).find('img').attr('src');
        data.area.push(obj); 
    });
    return data;
}

/* GET home page. */
router.get('/', async (req, res) => {
    await getWeatherData();
    const data = await handelData();
    res.render('index', { title: '天氣預報', data: data });
});

router.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).send('Service Error');
}); 


module.exports = router;
