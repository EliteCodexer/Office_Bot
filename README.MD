# Office_Bot
Discord Bot for Squad Server, Teamspeak, and Discord admininistration for The Doctor's Office. **THIS ONLY WORKS FOR WINDOWS!!**

**INSTALLATION OF REQUIRED FILES AND BOT INITIAL SETUP**

1) Install NodeJs on host. https://nodejs.org/en/
2) Create the discord bot and get the token. (https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token)
3) Open the config.json with text editor in the bot's files and change the TOKEN_PLACEHOLDER with the proper token.
4) Open the console.bat and run this commmand:
```
npm install --save --msvs_version=2015 discordv8
```
5) Open CMD prompt and run
```
npm install pm2 -g
```

**SETTING UP THE BOT**

1) In the bot's files, open main.js with a text editor and update file paths to the proper directories, enter whitelist channel name, and specify the channel you would like the auto-welcome to ping new server joins.
2) Execute the start.bat to initialize the bot.
3) Execute the stop.bat to kill the bot.

**DEFAULT COMMANDS**

- *!help*: Displays current availble commands in Discord.  Available in any channel with bot access.
- *!status*: Displays server status and banner. Available in any channel with bot access.
- *!ts*: Displays Teamspeak Server information including server address, current active players, and a link to download Teamspeak 3.

**NOTE**

The automatic whitelist only works in the channel you specified under 'wlchannel'.
