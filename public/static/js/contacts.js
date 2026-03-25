const TOKEN = "5903751365:AAExdx8fzrVgF5rh3146hWHXpoex4E1LSlk";
const CHAT_ID = "-1001976383588";
const URI_API = `https://api.telegram.org/bot${ TOKEN }/sendMessage`;

document.getElementById('telegram').addEventListener('submit', function(e) {
    e.preventDefault();

    let message = `<b>Сообщение с QuickCart!</b>\n`;
    message += `<b>Имя:</b> ${ this.name.value }\n`;
    message += `<b>Электронная почта:</b> ${ this.email.value }\n`;
    message += `<b>Номер телефона:</b> ${ this.phone.value }\n`;
    message += `<b>Сообщение:</b> ${ this.message.value }`;

    axios.post(URI_API, {
        chat_id: CHAT_ID,
        parse_mode: `html`,
        text: message
    })
    .then((res) => {
        alert("Сообщение отправлено, ожидайте ответа.")
    })
    .catch((err) => {
        alert("Сообщение не отправлено, повторите попытку еще раз.")
    })
    .finally(() => {
        this.name.value = "";
        this.phone.value = "";
        this.email.value = "";
        this.message.value = "";
    })
});


