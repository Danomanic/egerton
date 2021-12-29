require('dotenv').config();
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const Discord = require("discord.js");

const client = new Discord.Client({intents: ["GUILDS", "GUILD_MESSAGES"]});

const HaloAPI = lib.halo.infinite['@0.3.3'];


const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const commands = [{
  name: 'ping',
  description: 'Replies with Pong!'
}]; 

const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(925520980619694132, 872719039422672896),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();


const getLastMatch = async () => {
    let result = await HaloAPI.stats.matches.list({
    gamertag: `danoidx`,
    limit: {
        'count': 1,
        'offset': 0
    },
    mode: 'matchmade'
    });
    return result.data[0].id;
}

const getMatchData = async (matchId) => {

    let result = await HaloAPI.stats.matches.retrieve({
        id: matchId
    });

    return result.data;
}

const main = async () => {
    const lastMatch = await getLastMatch();
    const matchData = await getMatchData(lastMatch);
    //console.log(matchData);
}

main();