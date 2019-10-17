//Load necessary files and apps
const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const Gamedig = require('gamedig');
var fs = require('fs'),
    request = require('request');
require('events').EventEmitter.defaultMaxListeners = 15;

//Turn on bot and let you know
client.on("ready", () => {
    console.log(' ');
    console.log('Bot is up');
    console.log(' ');
});

//Variable Declaration
var welcomechannel = 'the-lobby';
var statusbannerlink = 'https://cdn.battlemetrics.com/b/standardVertical/3379634.png?foreground=%23EEEEEE&linkColor=%231185ec&lines=%23333333&background=%23222222&chart=players%3A24H&chartColor=%23FF0700&maxPlayersHeight=300'; //Link to Battlemetrics banner
var adminfile = 'F:\\servers\\public\\SquadGame\\ServerConfig\\Admins.cfg'; //Path to the admin.cfg file for whitelisting.
var wlchannel = 'queue_skip_request'; //Name of channel you want the automatic whitelist to work in.

//Constant declaration
const prefix = config.prefix;  //Pull prefix from config,json file

//Set bot presence message
client.on("ready", () => {
    client.user.setPresence({
        game: {
            name: '!help for commands',//'!status for map/slots',
            type: 0
        }
    });
    console.log(`App created by Fender0246 with contribution from Github users`);
    console.log(`Logged in as ${client.user.username}!`);
    console.log('Please remember to spay and neuter your pets.  THANKS!');
    console.log(' ');
});

//Get file info for status download
var download = function(uri, filename, callback) {
    request.head(uri, function(err, res, body) {
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);

        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};

//Auto Whitelist in Whitelist channel
// client.on('message', message => {
//     if (message.channel.name == wlchannel) {
//
//         var input = message.content;
//         var userInput = input + '\r\n';
//
//         var admin = input.substr(0, 6);
//         var number = input.substr(6, 17);
//         var whitelist = input.substr(23, 10);
//
//         if (admin == "Admin=" && number < 76561200000000000 && number > 76561190000000000 && whitelist == ":Whitelist") {
//
//             var fs = require('fs');
//             fs.readFile(adminfile, function(err, data) {
//                 if (err) throw err;
//                 if (data.indexOf(number) < 0) {
//                     var fs = require('fs');
//                     fs.appendFile(adminfile, userInput, function(err) {
//                         if (err) throw err;
//                         console.log("Added " + number + " to the whitelist");
//                         message.channel.send('User (' + number + ') has sucessfully been added to the whitelist.');
//                     });
//                 } else {
//                     console.log(number + " is already in the whitelist.");
//                     message.channel.send("This 64ID is already in the whitelist.");
//                 }
//             })
//
//         }
//
//     }
// });

//Bot respond to message with prefix "!".
client.on('message', message => {
    if (message.author.bot && message.channel.type !== 'text' && !message.content.startsWith(prefix)) return;  //Ignore messages by bots, messages not in text channels, and messages that do not begin ! prefix

    //Help
    if (message.content.startsWith(prefix + 'help')) {
      message.channel.send('Here are the current bot commands: ```!status - Display Squad Server Status``` ```!TS or !ts - Display Teamspeak Connection Information```')
      console.log('Help requested.');  //Echo in log
      console.log(' ');
    }

    // Battlemetrics server status banner post
    if (message.content.startsWith(prefix + 'status')) {
         download(statusbannerlink, 'status.png', function() {  //Download banner from link variable and save as status.png
               console.log('Status banner posted');  //Echo in log
               console.log(' ');
               message.channel.send({  //Send status banner image
                   files: [{
                       attachment: './status.png',
                       name: 'status.png'
                   }]
               });
           });
       }

    //TeamSpeak Info RichEmbed
    if (message.content.toLowerCase().startsWith(`${prefix}ts`)) {
      Gamedig.query({
        type: 'teamspeak3',
        host: '104.238.135.16',
        port: 9160,
        teamspeakQueryPort: 9100,
      })
        .then(state => {

          const {players, raw} = state;
          const clientCount = players.length;
          const {channels} = raw;
          const activeClients = channels
            .filter(({ channel_name }) => channel_name != 'AFK')
            .reduce((current, next) => current + parseInt(next.total_clients, 10), -1);

          console.log('TS info sent.'); //Echo in log
          console.log(`There are currently ${activeClients} players online`); //Echo in log
          console.log(' ');
          const embed = new Discord.RichEmbed() //Create TS info embed
            .setColor('#FF0000')
            .setTitle('The most TOXIC TeamSpeak in the USA!')
            .setAuthor("The Doctor's Office")
            .setThumbnail('https://cdn.discordapp.com/icons/323631246255325196/f7ca22011d2155936500304b4a39b906.png?size=128')
            .addField('Teamspeak Address:', 'ts3.docsoffice.net:9160', true)
            .addField(
              `There are currently **${activeClients}** players online`,
              'Download TeamSpeak [-->HERE<--](https://teamspeak.com/en/downloads/)',
              true,
            );
          message.channel.send({ embed }); //Send TS info embed in channel where command was sent
        })
        .catch(error => {
          console.log(error);
        });
    }

    //Round Info UNFINISHED
    if (message.content.startsWith(prefix + 'round')) {
      const embed = new Discord.RichEmbed()
      .setColor('#FF0000')
      .setTitle('The Doctor\'s Office | Cincinnati')
      .setThumbnail('https://cdn.discordapp.com/icons/323631246255325196/f7ca22011d2155936500304b4a39b906.png?size=128')
      .addField('Current Map:', '```OP First Light```')
      .addField('Player Count:', '```94 / 100```', true)
      .addField('Time Left:', '```4:20```', true)
      .setFooter('UNDER CONSTRUCTION STILL YOU MORONS')
      console.log('Round info posted');  //Echo in log
      console.log(' ');
      message.channel.send({embed});  //Send round info embed in channel where command was sent

    }

});

//New Discord User Welcome with Teamspeak Embed
client.on('guildMemberAdd', member => {
  const channel = member.guild.channels.find(ch => ch.name === 'the-lobby');  //Send welsome message in channel 'the-lobby'
  if (!channel) return;  //If Discord join channel is not 'the-lobby', ignore
    channel.send(`Welcome to The Doctor\'s Office, ${member}.  We use Teamspeak!`);  //Send welcome message to user that joined
    console.log('User ' + member.user.tag + ' has joined the server.'); //Output to log that a user has join and that user's username.
    console.log('TS info sent to new user.');  //Echo in log
    console.log(' ');

    Gamedig.query({
      type: 'teamspeak3',
      host: '104.238.135.16',
      port: 9160,
      teamspeakQueryPort: 9100,
    })
      .then(state => {

        const {players, raw} = state;
        const clientCount = players.length;
        const {channels} = raw;
        const activeClients = channels
          .filter(({ channel_name }) => channel_name != 'AFK')
          .reduce((current, next) => current + parseInt(next.total_clients, 10), -1);

        console.log('TS info sent.'); //Echo in log
        console.log(`There are currently ${activeClients} players online`); //Echo in log
        console.log(' ');
        const embed = new Discord.RichEmbed() //Create TS info embed
          .setColor('#FF0000')
          .setTitle('The most TOXIC TeamSpeak in the USA!')
          .setAuthor("The Doctor's Office")
          .setThumbnail('https://cdn.discordapp.com/icons/323631246255325196/f7ca22011d2155936500304b4a39b906.png?size=128')
          .addField('Teamspeak Address:', 'ts3.docsoffice.net:9160', true)
          .addField(
            `There are currently **${activeClients}** players online`,
            'Download TeamSpeak [-->HERE<--](https://teamspeak.com/en/downloads/)',
            true,
          );
        message.channel.send({ embed }); //Send TS info embed in channel where command was sent
      })
      .catch(error => {
        console.log(error);
      });

    //channel.send({embed}); //Send the embed message in current channel

});

client.login(config.token);  //Bot Login to Discord.  Token is bot unique.  Can be reset.
