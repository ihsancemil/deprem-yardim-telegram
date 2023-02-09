const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_TOKEN;

console.log("starting")

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

bot.onText(new RegExp("start", "i"), async (welcomeMessage) => {
    const opts = {
        reply_markup: {
            force_reply: true
        }
    };

    let statusMessageRequest = await bot.sendMessage(welcomeMessage.from.id, 'Durumunuzu paylaşabilir misiniz?', opts);
    bot.onReplyToMessage(welcomeMessage.chat.id, statusMessageRequest.message_id, async (statusMessage) => {
        const opts = {
            reply_markup: {
                keyboard: [
                    [
                        {
                            text: 'Konum paylaş',
                            request_location: true
                        }
                    ]
                ]
            }
        };

        let locationMessageRequest = await bot.sendMessage(statusMessage.from.id, 'Konum bilgilerinizi paylaşabilir misiniz?', opts);
        bot.onReplyToMessage(statusMessage.chat.id, locationMessageRequest.message_id, async (locationMessage) => {
            const opts = {
                reply_markup: {
                    one_time_keyboard: true,
                    keyboard: [
                        [
                            {
                                text: 'Telefon paylaş',
                                request_contact: true,
                            }
                        ]
                    ]
                }
            };

            let contactMessageRequest = await bot.sendMessage(locationMessage.chat.id, "İletişim bilgilerinizi paylaşabilir misiniz?", opts)
            bot.onReplyToMessage(locationMessage.chat.id, contactMessageRequest.message_id, async (contactMessage) => {
                console.log(statusMessage.text, locationMessage.location, contactMessage.contact)
                await bot.sendMessage(contactMessage.chat.id, "Bilgileriniz alınmıştır teşekkürler.")
            })
        })
    })
});

