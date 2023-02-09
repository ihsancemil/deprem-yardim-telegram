const TelegramBot = require('node-telegram-bot-api');

const needs = [
    "yemek", "çadır", "bebek bezi", "ilaç", "su", "elektrik"
]

async function handleInitialMessage(initialMessage) {
    const pollOptions = {
        allows_multiple_answers: true,
        is_anonymous: false
    };

    await bot.sendPoll(initialMessage.from.id, "İhtiyacınızı belirtiniz", needs, pollOptions)

}

async function handleStatusMessage(statusMessage) {
    const opts = {
        reply_markup: {
            keyboard: [[
                {text: 'Konum paylaş', request_location: true}
            ]]
        }
    };

    let locationMessageRequest = await bot.sendMessage(statusMessage.user.id, 'Konum bilgilerinizi paylaşabilir misiniz?', opts);
    bot.onReplyToMessage(
        statusMessage.user.id,
        locationMessageRequest.message_id,
        (locationMessage) => handleLocationMessage(statusMessage, locationMessage)
    )
}

async function handleLocationMessage(statusMessage, locationMessage) {
    const opts = {
        reply_markup: {
            one_time_keyboard: true,
            keyboard: [
                [
                    {text: 'Telefon paylaş', request_contact: true}
                ]
            ]
        }
    };

    let contactMessageRequest = await bot.sendMessage(locationMessage.chat.id, "İletişim bilgilerinizi paylaşabilir misiniz?", opts)
    bot.onReplyToMessage(
        locationMessage.chat.id,
        contactMessageRequest.message_id,
        (contactMessage) => handleContactMessage(statusMessage, locationMessage, contactMessage)
    )
}

async function handleContactMessage(statusMessage, locationMessage, contactMessage) {
    selected_needs = statusMessage.option_ids.map(i => needs[i])
    console.log(selected_needs, locationMessage.location, contactMessage.contact)
    await bot.sendMessage(
        contactMessage.chat.id,
        "Bilgileriniz alınmıştır teşekkürler."
    )
}

const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token, {polling: true});
bot.on("poll_answer", handleStatusMessage)
bot.onText(new RegExp("start", "i"), handleInitialMessage);
