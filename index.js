const TelegramBot = require('node-telegram-bot-api');

const token = 'telegram bot token';

console.log("starting")

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

bot.onText(/start/, (msg, match) => {
    console.log(msg, match)
    const opts = {
        reply_markup: {
            keyboard: [
                [
                    {
                        text: 'Enkazdayım',
                        request_location: true,
                        callback_data: 'edit'
                    },
                    {
                        text: 'Erzak İhtiyacım var',
                        request_location: true,
                        callback_data: 'edit'
                    }
                ]
            ]
        }
    };

    bot.sendMessage(msg.from.id, 'Durumunuzu paylaşabilir misiniz?', opts);
});

bot.on('location', async (locationMessage) => {
    const opts = {
        reply_markup: {
            keyboard: [
                [
                    {
                        text: 'İletişim bilgimi paylaş',
                        request_contact: true,
                        callback_data: 'edit'
                    }
                ]
            ]
        }
    };


    let message = await bot.sendMessage(locationMessage.from.id, 'İletişim bilgilerinizi paylaşabilir misiniz?', opts);

    bot.onReplyToMessage(locationMessage.chat.id, message.message_id, (contactMessage) => {
        bot.sendMessage(locationMessage.chat.id, "Bilgileriniz alınmıştır. Teşekkürler!")
    })
});

bot.on("message", (msg) => {
    console.log(msg)
})