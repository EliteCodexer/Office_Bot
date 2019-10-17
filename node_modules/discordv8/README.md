<p align="center">
  <a href="https://hydrabolt.github.io/discord.js">
    <img alt="discord.js" src="http://hydrabolt.github.io/discord.js/res/logo.png" width="546">
  </a>
</p>

[![Build Status](https://travis-ci.org/macdja38/discord.js.svg)](https://travis-ci.org/macdja38/discord.js) [![Documentation Status](https://readthedocs.org/projects/discordjs/badge/?version=latest)](http://discordjs.readthedocs.org/en/latest/?badge=latest)

[![NPM](https://nodei.co/npm/discordv8.png?downloads=true&stars=true)](https://nodei.co/npm/discordv8/)


discordv8 is a node module used as a way of interfacing with [Discord](https://discordapp.com/). It is a very useful module for creating bots.

### Installation

**Requires node 0.12+**

`npm install --save discordv8`

If you don't need voice support:

`npm install --save --no-optional discordv8`

---

### Example: ping-pong
```js
var Discord = require("discordv8");

var mybot = new Discord.Client();

mybot.on("message", function(message) {
	if(message.content === "ping") {
		mybot.reply(message, "pong");
    }
});

mybot.loginWithToken("token");
// If you still need to login with email and password, use mybot.login("email", "password");
```
---

### Contributing

Feel free to contribute! Just clone the repo and edit the files in the **src folder, not the lib folder.**

Whenever you come to making a pull request, make sure it's to the *indev* branch and that you have built the lib files by running `grunt --dev`

---

### Related Projects

A list of other Discord API libraries [can be found here](https://discordapi.com/unofficial/libs.html)

---

### Links
**[Documentation](http://discordjs.readthedocs.org/en/latest/)**

**[GitHub](https://github.com/macdja38/discord.js)**

**[Wiki](https://github.com/macdja38/discord.js/wiki)**

---

### Contact

If you have an issue or want to know if a feature exists, [read the documentation](http://discordjs.readthedocs.org/en/latest/) before contacting me about any issues! If it's badly/wrongly implemented, let me know!

If you are having issues with this library and don't have a project that is already highly integrated with it you should try [the new version](https://discord.js.org/#/) their are much more resources for helping new users to the library and language.

If you would like to contact me, you can create an issue on the GitHub repo.

Alternatively, you could just send a DM to **macdja38** in [**Discord API**](https://discord.gg/0SBTUU1wZTYd2XyW).
