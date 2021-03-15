const express = require('express');
const path = require('path');

// express
const index = require('./routes/index');
let app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index);

// 404 設定
app.use((res,req,next)=>{
    req.status(404).send('很抱歉，您的頁面找不到！');
});

// 程式錯誤：500畫面設定
app.use(function(err, req, res, next) {
    // render the error page
    req.status(500).send('程式有問題，請稍候嘗試！');
});

let port = process.env.PORT || 3000;
app.listen(port);
module.exports = app;