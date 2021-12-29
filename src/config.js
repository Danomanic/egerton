require('dotenv').config();

module.exports = Object.freeze({
	DB_URI: process.env.DB_URI,
	STDLIB_SECRET_TOKEN: process.env.STDLIB_SECRET_TOKEN,
	TOKEN: process.env.BOT_TOKEN,
	CLIENT_ID: process.env.CLIENT_ID,
	GUILD_ID: process.env.GUILD_ID,
	CHANNEL_ID: process.env.CHANNEL_ID,
	GAMER_TAGS : process.env.GAMER_TAGS.split(','),
});