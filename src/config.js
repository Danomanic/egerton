require('dotenv').config();

module.exports = Object.freeze({
	DB_URI: process.env.DB_URI,
	STDLIB_SECRET_TOKEN: process.env.STDLIB_SECRET_TOKEN,
	TOKEN: process.env.BOT_TOKEN,
	CLIENT_ID: process.env.CLIENT_ID,
	GUILD_ID: process.env.GUILD_ID,
	CHANNEL_ID: process.env.CHANNEL_ID,
	CLOUDFRONT_DOMAIN: process.env.CLOUDFRONT_DOMAIN,
	EGERTON_IMAGES_API: process.env.EGERTON_IMAGES_API,
});
