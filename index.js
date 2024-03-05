const Bot = require("./Bot");

const TagEveryone = require("./plugins/TagEveryone");
const Roles = require("./plugins/Roles");
const Needlecasts = require("./plugins/Needlecasting");

const { botConfig, pluginsConfig } = require("./config");

const plugins = [
  new TagEveryone(pluginsConfig.tagEveryone),
  new Roles(pluginsConfig.roles),
  new Needlecasts(pluginsConfig.needlecasts),
];

const bot = new Bot(plugins, botConfig);

(async () => {
  await bot.connect();
  await bot.run();
})();
