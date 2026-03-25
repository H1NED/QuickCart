const express = require('express');
const router = express.Router();

const User = require('./../models/User');

const bcrypt = require('bcrypt');

router.post('/signup', (req, res) => {
    let {name, email, password} = req.body;
    name = name.trim();
    email = email.trim();
    password = password.trim();

    if(name == "" || email == "" || password == "") {
        res.json({
            status: "FAILED",
            message: "Пустые поля ввода!"
        })
    } else if (!/^[a-zA-Zа-яА-Я ]*$/.test(name)) {
        res.json({
            status: "FAILED",
            message: "Введено неверное имя"
        });
    } else if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        res.json({
            status: "FAILED",
            message: "Введен неверный адрес электронной почты"
        })
    } else if(password.length < 8) {
        res.json({
            status: "FAILED",
            message: "Пароль слишком короткий!"
        })
    } else {
        User.find({email}).then(result => {
            if(result.length) {
                res.json({
                    status: "FAILED",
                    message: "Пользователь с указанным адресом электронной почты уже существует"
                })
            } else {
                const saltRounds = 10;
                bcrypt.hash(password, saltRounds).then(hashedPassword => {
                    const newUser = new User({
                        name,
                        email,
                        password: hashedPassword,
                    });

                    newUser.save().then(result => {
                        res.json({
                            status: "SUCCESS",
                            message: "Регистрация прошла успешно",
                            data: {
                                username: result.name,
                            },
                        });
                    }).catch(err => {
                        res.json({
                            status: "FAILED",
                            message: "Произошла ошибка при сохранении учетной записи пользователя!"
                        });
                    });
                }).catch(err => {
                    res.json({
                        status: "FAILED",
                        message: "Произошла ошибка при хешировании пароля!"
                    })
                })
            }
        }).catch(err => {
            console.log(err);
            res.json({
                status: "FAILED",
                message: "Произошла ошибка при проверке существующего пользователя!"
            })
        }) 
    }
})

router.post('/signin', (req, res) => {
    let {email, password} = req.body;
    email = email.trim();
    password = password.trim();

    if(email == "" || password == "") {
        res.json({
            status: "FAILED",
            message: "Предоставлены пустые учетные данные"
        })
    } else {
        User.find({email}).then(data => {
            if(data.length) {
                const hashedPassword = data[0].password;
                bcrypt.compare(password, hashedPassword).then(result => {
                    if(result) {
                        res.json({
                            status: "SUCCESS",
                            message: "Вход успешен",
                            data: {
                                username: data[0].name,
                            },
                        });
                    } else {
                        res.json({
                            status: "FAILED",
                            message: "Введен неверный пароль!"
                        });
                    }
                }).catch(err => {
                    res.json({
                        status: "FAILED",
                        message: "Произошла ошибка при сравнении паролей."
                    });
                });
            } else {
                res.json({
                    status: "FAILED",
                    message: "Введены неверные учетные данные!"
                })
            }
        }).catch(err => {
            res.json({
                status: "FAILED",
                message: "Произошла ошибка при проверке существующего пользователя."
            })
        })
    }
})

module.exports = router;

