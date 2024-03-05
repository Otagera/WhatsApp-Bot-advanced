// Contains the default configuration for Bot & Plugins
// Any attribute not given in the configuration will take its default value

const botConfig = {
  authFolder: "auth",
  selfReply: false,
  logMessages: false,
};

const pluginsConfig = {
  roles: {
    dataFile: "./roles.json",
    prefix: "!role ",
    updateOnAdd: false,
    updateOnRemove: false,
  },
  needlecasts: {
    dataFile: "./needlecast.json",
    prefix: "!needlecast "
  },
  tagEveryone: {
    membersLimit: 100,
    trigger: "all",
  },
};

module.exports = { botConfig, pluginsConfig };
