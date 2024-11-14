const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
const DISCORD_TOKEN = 'MTI5NTcwMjQ4NTEwOTA1MTQ3NA.GKDLcP.NofPLIvFkT92OlPYj77pG8imhrsnXqyeK-fHmQ'; // הכנס את טוקן הבוט שלך כאן

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

// הגדרות חיבור ו-Webhook
const roleId = '1295725876742328352'; // ID של הרול "מרצה"
const textChannelId = '1295725750028079124'; // ID של הערוץ הטקסטואלי
const voiceChannelId = '1295725714871550032'; // ID של החדר הקולי

const WEBHOOK_URL = "https://discord.com/api/webhooks/1295736303333412925/DTy9VeShNGvMsMZcNopp_alXItbymfgdTd2a-zzrD5edO_QC7ykULyv-7A9iCfhoBGJZ"; // הכנס את ה-Webhook שלך כאן


client.on('ready', () => {
    console.log(`הבוט מחובר כ: ${client.user.tag}`);
});

// אירוע עלייה לשידור של המרצה בחדר הקולי
client.on('voiceStateUpdate', (oldState, newState) => {
    const member = newState.member;
    const channel = newState.channelId;

    // בודק אם המשתמש נכנס לחדר הקולי עם הרול הנכון
    if (channel === voiceChannelId && member.roles.cache.has(roleId)) {
        const textChannel = client.channels.cache.get(textChannelId);
        const username = member.user.username;

        // שליחת הודעה על העלייה לשידור
        textChannel.send(`שימו לב: <@here> סוחר היומי שלנו ${username} עלה ללייב! אל תפספסו את השידור!`);
    }
});

// פונקציה לשליחת הודעת מסחר דרך ה-Webhook
function postTradeAlert(botname, INS, amount, command, price) {
    console.log("bot--- ", botname, INS, amount, command, price);
    let message;

    if (command=="Flat"){
        message= `${botname} יצא מהפוזיציה. נכס ${INS} `
    }
    else{
        if (command === 'BUY'){
            message=`שימו לב ${botname} נכנס לונג בטרייד. בחוזה ${INS} ובכמות ${amount}`
        }else{
            message=`שימו לב ${botname} נכנס שורט בטרייד. בחוזה ${INS} ובכמות ${amount}`
        }
    }
   // const message =` ${command === "Flat" ? "סגר פוזיציה" : command === 'BUY' ? 'נכנס' : 'יצא'}  מטרייד בחוזה ${INS} בכמות של ${amount}  `

    axios.post(WEBHOOK_URL, {
        username: botname,
        content: message
    })
    .then(() => console.log('message', botname, INS, amount, command, price))
    .catch((error) => {
        console.error('שגיאה בשליחת הודעה:', error.response ? error.response.data : error.message);
    });
}

//postTradeAlert("Botname", "NQ", 3, "Buy", 20000 )
// התחברות לדיסקורד
client.login(DISCORD_TOKEN);

module.exports = {
    postTradeAlert
};
