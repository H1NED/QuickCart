const express = require('express');
const app = express();
const port = 3000;

require('./config/db');

const UserRouter = require('./api/User');
const ReviewsRouter = require('./api/Reviews');

const bodyParser = require('express').json;
app.use(bodyParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) => {
    return res.redirect("templates/landing.html");
});

app.use('/user', UserRouter);
app.use('/reviews', ReviewsRouter);

app.delete('/reviews/:id', ReviewsRouter);

app.listen(port, () => {
    console.log(`Сервер запустился на порту: ${port}`);
}); 