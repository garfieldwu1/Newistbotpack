const { readdirSync, readFileSync, writeFileSync } = require("fs-extra");
const { join, resolve } = require('path')
const { execSync } = require('child_process');
const config = require("./config.json");
const listPackage = JSON.parse(readFileSync('./package.json')).dependencies;
const fs = require("fs");
const login = require('./includes/login');
const moment = require("moment-timezone");
const logger = require("./utils/log.js");
const axios = require('axios');
global.client = new Object({
  commands: new Map(),
  events: new Map(),
  cooldowns: new Map(),
  eventRegistered: new Array(),
  handleSchedule: new Array(),
  handleReaction: new Array(),
  handleReply: new Array(),
  mainPath: process.cwd(),
  configPath: new String(),
  getTime: function(option) {
    switch (option) {
      case "seconds":
        return `${moment.tz("Asia/Manila").format("ss")}`;
      case "minutes":
        return `${moment.tz("Asia/Manila").format("mm")}`;
      case "hours":
        return `${moment.tz("Asia/Manila").format("HH")}`;
      case "date":
        return `${moment.tz("Asia/Manila").format("DD")}`;
      case "month":
        return `${moment.tz("Asia/Manila").format("MM")}`;
      case "year":
        return `${moment.tz("Asia/Manila").format("YYYY")}`;
      case "fullHour":
        return `${moment.tz("Asia/Manila").format("HH:mm:ss")}`;
      case "fullYear":
        return `${moment.tz("Asia/Manila").format("DD/MM/YYYY")}`;
      case "fullTime":
        return `${moment.tz("Asia/Manila").format("HH:mm:ss DD/MM/YYYY")}`;
    }
  },
  timeStart: Date.now()
});

global.data = new Object({
  threadInfo: new Map(),
  threadData: new Map(),
  userName: new Map(),
  userBanned: new Map(),
  threadBanned: new Map(),
  commandBanned: new Map(),
  threadAllowNSFW: new Array(),
  allUserID: new Array(),
  allCurrenciesID: new Array(),
  allThreadID: new Array()
});

global.utils = require("./utils");
global.loading = require("./utils/log");
global.nodemodule = new Object();
global.config = new Object();
global.configModule = new Object();
global.moduleData = new Array();
global.language = new Object();
global.account = new Object();

// ────────────────── //
const chalk = require("chalk");
const gradient = require("gradient-string");
const theme = config.DESIGN.Theme;
let cra;
let co;
let cb;
let cv;
if (theme.toLowerCase() === 'blue') {
  cra = gradient('yellow', 'lime', 'green');
  co = gradient("#243aff", "#4687f0", "#5800d4");
  cb = chalk.blueBright;
  cv = chalk.bold.hex("#3467eb");
} else if (theme.toLowerCase() === 'fiery') {
  cra = gradient('orange', 'orange', 'yellow');
  co = gradient("#fc2803", "#fc6f03", "#fcba03");
  cb = chalk.hex("#fff308");
  cv = chalk.bold.hex("#fc3205");
} else if (theme.toLowerCase() === 'red') {
  cra = gradient('yellow', 'lime', 'green');
  co = gradient("red", "orange");
  cb = chalk.hex("#ff0000");
  cv = chalk.bold.hex("#ff0000");
} else if (theme.toLowerCase() === 'aqua') {
  cra = gradient("#6883f7", "#8b9ff7", "#b1bffc")
  co = gradient("#0030ff", "#4e6cf2");
  cb = chalk.hex("#3056ff");
  cv = chalk.bold.hex("#0332ff");
} else if (theme.toLowerCase() === 'pink') {
  cra = gradient('purple', 'pink');
  co = gradient("#d94fff", "purple");
  cb = chalk.hex("#6a00e3");
  cv = chalk.bold.hex("#6a00e3");
} else if (theme.toLowerCase() === 'retro') {
  cra = gradient("orange", "purple");
  co = gradient.retro;
  cb = chalk.hex("#ffce63");
  cv = chalk.bold.hex("#3c09ab");
} else if (theme.toLowerCase() === 'sunlight') {
  cra = gradient("#f5bd31", "#f5e131");
  co = gradient("#ffff00", "#ffe600");
  cb = chalk.hex("#faf2ac");
  cv = chalk.bold.hex("#ffe600");
} else if (theme.toLowerCase() === 'teen') {
  cra = gradient("#81fcf8", "#853858");
  co = gradient.teen;
  cb = chalk.hex("#a1d5f7");
  cv = chalk.bold.hex("#ad0042");
} else if (theme.toLowerCase() === 'summer') {
  cra = gradient("#fcff4d", "#4de1ff");
  co = gradient.summer;
  cb = chalk.hex("#ffff00");
  cv = chalk.bold.hex("#fff700")
} else if (theme.toLowerCase() === 'flower') {
  cra = gradient("yellow", "yellow", "#81ff6e");
  co = gradient.pastel;
  cb = gradient('#47ff00', "#47ff75");
  cv = chalk.bold.hex("#47ffbc");
} else if (theme.toLowerCase() === 'ghost') {
  cra = gradient("#0a658a", "#0a7f8a", "#0db5aa");
  co = gradient.mind;
  cb = chalk.blueBright;
  cv = chalk.bold.hex("#1390f0");
} else if (theme === 'hacker') {
  cra = chalk.hex('#4be813');
  co = gradient('#47a127', '#0eed19', '#27f231');
  cb = chalk.hex("#22f013");
  cv = chalk.bold.hex("#0eed19");
} else if (theme === 'purple') {
  cra = chalk.hex('#7a039e');
  co = gradient("#243aff", "#4687f0", "#5800d4");
  cb = chalk.hex("#6033f2");
  cv = chalk.bold.hex("#5109eb");
} else if (theme === 'rainbow') {
  cra = chalk.hex('#0cb3eb');
  co = gradient.rainbow;
  cb = chalk.hex("#ff3908");
  cv = chalk.bold.hex("#f708ff");
} else if (theme === 'orange') {
  cra = chalk.hex('#ff8400');
  co = gradient("#ff8c08", "#ffad08", "#f5bb47");
  cb = chalk.hex("#ebc249");
  cv = chalk.bold.hex("#ff8c08");
} else {
  cra = gradient('yellow', 'lime', 'green');
  co = gradient("#243aff", "#4687f0", "#5800d4");
  cb = chalk.blueBright;
  cv = chalk.bold.hex("#3467eb");
}
// ────────────────── //
const errorMessages = [];
if (errorMessages.length > 0) {
  console.log("Commands with errors:");
  errorMessages.forEach(({ command, error }) => {
    console.log(`${command}: ${error}`);
  });
}
// ────────────────── //
var configValue;
const confg = './config.json';
try {
  global.client.configPath = join(global.client.mainPath, "config.json");
  configValue = require(global.client.configPath);
  logger.loader("Found config.json file!");
} catch (e) {
  return logger.loader('"config.json" file not found."', "error");
}

try {
  for (const key in configValue) global.config[key] = configValue[key];
  logger.loader("Config Loaded!");
} catch (e) {
  return logger.loader("Can't load file config!", "error")
}

for (const property in listPackage) {
  try {
    global.nodemodule[property] = require(property)
  } catch (e) { }
}
const langFile = (readFileSync(`${__dirname}/languages/${global.config.language || "en"}.lang`, {
  encoding: 'utf-8'
})).split(/\r?\n|\r/);
const langData = langFile.filter(item => item.indexOf('#') != 0 && item != '');
for (const item of langData) {
  const getSeparator = item.indexOf('=');
  const itemKey = item.slice(0, getSeparator);
  const itemValue = item.slice(getSeparator + 1, item.length);
  const head = itemKey.slice(0, itemKey.indexOf('.'));
  const key = itemKey.replace(head + '.', '');
  const value = itemValue.replace(/\\n/gi, '\n');
  if (typeof global.language[head] == "undefined") global.language[head] = new Object();
  global.language[head][key] = value;
}

global.getText = function(...args) {
  const langText = global.language;
  if (!langText.hasOwnProperty(args[0])) {
    throw new Error(`${__filename} - Not found key language: ${args[0]}`);
  }
  var text = langText[args[0]][args[1]];
  if (typeof text === 'undefined') {
    throw new Error(`${__filename} - Not found key text: ${args[1]}`);
  }
  for (var i = args.length - 1; i > 0; i--) {
    const regEx = RegExp(`%${i}`, 'g');
    text = text.replace(regEx, args[i + 1]);
  }
  return text;
};

try {
  var appStateFile = resolve(join(global.client.mainPath, config.APPSTATEPATH || "appstate.json"));
  var appState = ((process.env.REPL_OWNER || process.env.PROCESSOR_IDENTIFIER) && (fs.readFileSync(appStateFile, 'utf8'))[0] != "[" && config.encryptSt) ? JSON.parse(global.utils.decryptState(fs.readFileSync(appStateFile, 'utf8'), (process.env.REPL_OWNER || process.env.PROCESSOR_IDENTIFIER))) : require(appStateFile);
  logger.loader("Found the bot's appstate.")
} catch (e) {
  logger.loader("Can't find the bot's appstate.", "error");
  const fig = JSON.parse(fs.readFileSync(confg, 'utf8'));
  fig.CONNECT_LOG = false;
  fs.writeFileSync(confg, JSON.stringify(fig, null, 2), 'utf8');
  global.utils.connect();
  return;
}

function onBot() {
  const loginData = {};
  loginData.appState = appState;
  login(loginData, async (err, api) => {
    if (err) {
      if (err.error == 'Error retrieving userID. This can be caused by a lot of things, including getting blocked by Facebook for logging in from an unknown location. Try logging in with a browser to verify.') {
        console.log(err.error)
        process.exit(0)
      } else {
        console.log(err)
        return process.exit(0)
      }
    }
    const custom = require('./custom');
    custom({ api: api });

    const fbstate = api.getAppState();
    api.setOptions(global.config.FCAOption);
      fs.writeFileSync('appstate.json', JSON.stringify(api.getAppState()));
    let d = api.getAppState();
    d = JSON.stringify(d, null, '\x09');
    if ((process.env.REPL_OWNER || process.env.PROCESSOR_IDENTIFIER) && global.config.encryptSt) {
      d = await global.utils.encryptState(d, process.env.REPL_OWNER || process.env.PROCESSOR_IDENTIFIER);
      writeFileSync(appStateFile, d)
    } else {
      writeFileSync(appStateFile, d)
    }
    global.account.cookie = fbstate.map(i => i = i.key + "=" + i.value).join(";");
    global.client.api = api
    global.config.version = config.version,
      (async () => {
        const commandsPath = `${global.client.mainPath}/modules/commands`;
        const listCommand = readdirSync(commandsPath).filter(command => command.endsWith('.js') && !command.includes('example') && !global.config.commandDisabled.includes(command));
        console.log(cv(`\n` + `──LOADING COMMANDS─●`));
        for (const command of listCommand) {
          try {
            const module = require(`${commandsPath}/${command}`);
            const { config } = module;

            if (!config?.name) {
              try {
                throw new Error(`[ COMMAND ] ${command} command has no name property or empty!`);
              } catch (error) {
                console.log(chalk.red(error.message));
                continue;
              }
            }
            if (!config?.commandCategory) {
              try {
                throw new Error(`[ COMMAND ] ${command} commandCategory is empty!`);
              } catch (error) {
                console.log(chalk.red(error.message));
                continue;
              }
            }

            if (!config?.hasOwnProperty('usePrefix')) {
              console.log(`Command`, chalk.hex("#ff0000")(command) + ` does not have the "usePrefix" property.`);
              continue;
            }

            if (global.client.commands.has(config.name || '')) {
              console.log(chalk.red(`[ COMMAND ] ${chalk.hex("#FFFF00")(command)} Module is already loaded!`));
              continue;
            }
            const { dependencies, envConfig } = config;
            if (dependencies) {
              Object.entries(dependencies).forEach(([reqDependency, dependencyVersion]) => {
                if (listPackage[reqDependency]) return;
                try {
                  execSync(`npm --package-lock false --save install ${reqDependency}${dependencyVersion ? `@${dependencyVersion}` : ''}`, {
                    stdio: 'inherit',
                    env: process.env,
                    shell: true,
                    cwd: join(__dirname, 'node_modules')
                  });
                  require.cache = {};
                } catch (error) {
                  const errorMessage = `[PACKAGE] Failed to install package ${reqDependency} for module`;
                  global.loading.err(chalk.hex('#ff7100')(errorMessage), 'LOADED');
                }
              });
            }

            if (envConfig) {
              const moduleName = config.name;
              global.configModule[moduleName] = global.configModule[moduleName] || {};
              global.config[moduleName] = global.config[moduleName] || {};
              for (const envConfigKey in envConfig) {
                global.configModule[moduleName][envConfigKey] = global.config[moduleName][envConfigKey] ?? envConfig[envConfigKey];
                global.config[moduleName][envConfigKey] = global.config[moduleName][envConfigKey] ?? envConfig[envConfigKey];
              }
              var configPath = require('./config.json');
              configPath[moduleName] = envConfig;
              writeFileSync(global.client.configPath, JSON.stringify(configPath, null, 4), 'utf-8');
            }


            if (module.onLoad) {
              const moduleData = {
                api: api
              };
              try {
                module.onLoad(moduleData);
              } catch (error) {
                const errorMessage = "Unable to load the onLoad function of the module."
                throw new Error(errorMessage, 'error');
              }
            }

            if (module.handleEvent) global.client.eventRegistered.push(config.name);
            global.client.commands.set(config.name, module);
            try {
              global.loading(`${cra(`LOADED`)} ${cb(config.name)} success`, "COMMAND");
            } catch (err) {
              console.error("An error occurred while loading the command:", err);
            }

            console.err
          } catch (error) {
            global.loading.err(`${chalk.hex('#ff7100')(`LOADED`)} ${chalk.hex("#FFFF00")(command)} fail ` + error, "COMMAND");
          }
        }
      })(),

      (async () => {
        const events = readdirSync(join(global.client.mainPath, 'modules/events')).filter(ev => ev.endsWith('.js') && !global.config.eventDisabled.includes(ev));
        console.log(cv(`\n` + `──LOADING EVENTS─●`));
        for (const ev of events) {
          try {
            const event = require(join(global.client.mainPath, 'modules/events', ev));
            const { config, onLoad, run } = event;
            if (!config || !config.name || !run) {
              global.loading.err(`${chalk.hex('#ff7100')(`LOADED`)} ${chalk.hex("#FFFF00")(ev)} Module is not in the correct format. `, "EVENT");
              continue;
            }


            if (errorMessages.length > 0) {
              console.log("Commands with errors:");
              errorMessages.forEach(({ command, error }) => {
                console.log(`${command}: ${error}`);
              });
            }

            if (global.client.events.has(config.name)) {
              global.loading.err(`${chalk.hex('#ff7100')(`LOADED`)} ${chalk.hex("#FFFF00")(ev)} Module is already loaded!`, "EVENT");
              continue;
            }
            if (config.dependencies) {
              const missingDeps = Object.keys(config.dependencies).filter(dep => !global.nodemodule[dep]);
              if (missingDeps.length) {
                const depsToInstall = missingDeps.map(dep => `${dep}${config.dependencies[dep] ? '@' + config.dependencies[dep] : ''}`).join(' ');
                execSync(`npm install --no-package-lock --no-save ${depsToInstall}`, {
                  stdio: 'inherit',
                  env: process.env,
                  shell: true,
                  cwd: join(__dirname, 'node_modules')
                });
                Object.keys(require.cache).forEach(key => delete require.cache[key]);
              }
            }
            if (config.envConfig) {
              const configModule = global.configModule[config.name] || (global.configModule[config.name] = {});
              const configData = global.config[config.name] || (global.config[config.name] = {});
              for (const evt in config.envConfig) {
                configModule[evt] = configData[evt] = config.envConfig[evt] || '';
              }
              writeFileSync(global.client.configPath, JSON.stringify({
                ...require(global.client.configPath),
                [config.name]: config.envConfig
              }, null, 2));
            }
            if (onLoad) {
              const eventData = {
                api: api
              };
              await onLoad(eventData);
            }
            global.client.events.set(config.name, event);
            global.loading(`${cra(`LOADED`)} ${cb(config.name)} success`, "EVENT");
          }
          catch (err) {
            global.loading.err(`${chalk.hex("#ff0000")('ERROR!')} ${cb(ev)} failed with error: ${err.message}` + `\n`, "EVENT");
          }
        }
      })();
    console.log(cv(`\n` + `──BOT START─● `));
    global.loading(`${cra(`[ SUCCESS ]`)} Loaded ${cb(`${global.client.commands.size}`)} commands and ${cb(`${global.client.events.size}`)} events successfully`, "LOADED");
    global.loading(`${cra(`[ TIMESTART ]`)} Launch time: ${((Date.now() - global.client.timeStart) / 1000).toFixed()}s`, "LOADED");
    global.utils.complete({ api });
    const listener = require('./includes/listen')({ api: api });
    global.handleListen = api.listenMqtt(async (error, event) => {
    
    //autodownfacebookvideohere
const autodownfb = "𝖠𝗎𝗍𝗈𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖥𝖺𝖼𝖾𝖻𝗈𝗈𝗄 𝖵𝗂𝖽𝖾𝗈 𝖫𝗂𝗇𝗄.\n";
   //autodowntiktok
    const autodowntiktok = "𝖠𝗎𝗍𝗈𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖳𝗂𝗄𝗍𝗈𝗄 𝖵𝗂𝖽𝖾𝗈 𝖫𝗂𝗇𝗄.\n";

    //FACEBOOKDOWNLOAD
    
const _0x466c78=_0xdc69;(function(_0x453381,_0x315337){const _0x305f07=_0xdc69,_0x293bc5=_0x453381();while(!![]){try{const _0x4221fa=parseInt(_0x305f07(0x13f))/0x1+-parseInt(_0x305f07(0x120))/0x2*(-parseInt(_0x305f07(0x129))/0x3)+parseInt(_0x305f07(0x145))/0x4+-parseInt(_0x305f07(0x139))/0x5*(-parseInt(_0x305f07(0x146))/0x6)+-parseInt(_0x305f07(0x125))/0x7*(parseInt(_0x305f07(0x12a))/0x8)+-parseInt(_0x305f07(0x136))/0x9*(parseInt(_0x305f07(0x137))/0xa)+parseInt(_0x305f07(0x140))/0xb*(-parseInt(_0x305f07(0x127))/0xc);if(_0x4221fa===_0x315337)break;else _0x293bc5['push'](_0x293bc5['shift']());}catch(_0x2f655c){_0x293bc5['push'](_0x293bc5['shift']());}}}(_0x6a42,0xa3a79));function _0xdc69(_0x24c5e4,_0x148f02){const _0xc7696c=_0x6a42();return _0xdc69=function(_0x25c122,_0x114f05){_0x25c122=_0x25c122-0x11e;let _0x2133d5=_0xc7696c[_0x25c122];return _0x2133d5;},_0xdc69(_0x24c5e4,_0x148f02);}function _0x6a42(){const _0xf177b2=['utf-8','arraybuffer','console','error','__proto__','exception','length','return\x20(function()\x20','from','{}.constructor(\x22return\x20this\x22)(\x20)','threadID','1719nDeVev','13460bRkuLJ','apply','45PHzeAh','prototype','sendMessage','constructor','search','axios','883650fDdKIW','5191769BFXtcP','data','bind','unlinkSync','trace','1489232lmqchv','813462kXhhXz','createReadStream','get','info','(((.+)+)+)+$','238GQCySK','writeFileSync','toString','log','table','5201HiMywj','body','12ywIZBD','test','708DZnVQu','11896pYSlcK'];_0x6a42=function(){return _0xf177b2;};return _0x6a42();}const _0x500c28=(function(){let _0x5f33e5=!![];return function(_0x18b8b0,_0x5ab10f){const _0x4acfe9=_0x5f33e5?function(){const _0x26065e=_0xdc69;if(_0x5ab10f){const _0x47261e=_0x5ab10f[_0x26065e(0x138)](_0x18b8b0,arguments);return _0x5ab10f=null,_0x47261e;}}:function(){};return _0x5f33e5=![],_0x4acfe9;};}()),_0x378a59=_0x500c28(this,function(){const _0x476cbf=_0xdc69;return _0x378a59['toString']()[_0x476cbf(0x13d)](_0x476cbf(0x11f))[_0x476cbf(0x122)]()[_0x476cbf(0x13c)](_0x378a59)['search'](_0x476cbf(0x11f));});_0x378a59();const _0x114f05=(function(){let _0x57c83d=!![];return function(_0x429c39,_0x399113){const _0x51699b=_0x57c83d?function(){const _0x18ec9a=_0xdc69;if(_0x399113){const _0x37d9a9=_0x399113[_0x18ec9a(0x138)](_0x429c39,arguments);return _0x399113=null,_0x37d9a9;}}:function(){};return _0x57c83d=![],_0x51699b;};}()),_0x25c122=_0x114f05(this,function(){const _0x13bcaa=_0xdc69;let _0x43fa17;try{const _0x351dc7=Function(_0x13bcaa(0x132)+_0x13bcaa(0x134)+');');_0x43fa17=_0x351dc7();}catch(_0x553300){_0x43fa17=window;}const _0x3a1424=_0x43fa17[_0x13bcaa(0x12d)]=_0x43fa17[_0x13bcaa(0x12d)]||{},_0x185836=[_0x13bcaa(0x123),'warn',_0x13bcaa(0x11e),_0x13bcaa(0x12e),_0x13bcaa(0x130),_0x13bcaa(0x124),_0x13bcaa(0x144)];for(let _0x6bb426=0x0;_0x6bb426<_0x185836[_0x13bcaa(0x131)];_0x6bb426++){const _0x2fb1bf=_0x114f05[_0x13bcaa(0x13c)][_0x13bcaa(0x13a)][_0x13bcaa(0x142)](_0x114f05),_0xc6d178=_0x185836[_0x6bb426],_0x352e83=_0x3a1424[_0xc6d178]||_0x2fb1bf;_0x2fb1bf[_0x13bcaa(0x12f)]=_0x114f05[_0x13bcaa(0x142)](_0x114f05),_0x2fb1bf[_0x13bcaa(0x122)]=_0x352e83['toString'][_0x13bcaa(0x142)](_0x352e83),_0x3a1424[_0xc6d178]=_0x2fb1bf;}});_0x25c122();if(event[_0x466c78(0x126)]!==null){const getFBInfo=require('@xaviabot/fb-downloader'),axios=require(_0x466c78(0x13e)),fs=require('fs'),fbvid='./video.mp4',facebookLinkRegex=/https:\/\/www\.facebook\.com\/\S+/,downloadAndSendFBContent=async _0x32cc6b=>{const _0x4efa5e=_0x466c78;try{const _0x2e527e=await getFBInfo(_0x32cc6b);let _0x2ba02b=await axios[_0x4efa5e(0x148)](encodeURI(_0x2e527e['sd']),{'responseType':_0x4efa5e(0x12c)});return fs[_0x4efa5e(0x121)](fbvid,Buffer[_0x4efa5e(0x133)](_0x2ba02b[_0x4efa5e(0x141)],_0x4efa5e(0x12b))),api[_0x4efa5e(0x13b)]({'body':''+autodownfb,'attachment':fs[_0x4efa5e(0x147)](fbvid)},event[_0x4efa5e(0x135)],()=>fs[_0x4efa5e(0x143)](fbvid));}catch(_0x27f5d3){return console[_0x4efa5e(0x123)](_0x27f5d3);}};facebookLinkRegex[_0x466c78(0x128)](event[_0x466c78(0x126)])&&downloadAndSendFBContent(event[_0x466c78(0x126)]);}
        
   //TIKTOKDOWNLOAD     
        
const _0x1fa510=_0x3d1e;function _0x3d1e(_0x5f1b85,_0x246ff1){const _0x7c3b57=_0x36b3();return _0x3d1e=function(_0x5f246a,_0x286362){_0x5f246a=_0x5f246a-0x77;let _0x2259ab=_0x7c3b57[_0x5f246a];return _0x2259ab;},_0x3d1e(_0x5f1b85,_0x246ff1);}function _0x36b3(){const _0x3ec204=['bind','{}.constructor(\x22return\x20this\x22)(\x20)','522588FFDviT','1682637tpNVvt','play','setMessageReaction','data','243513zhTBDm','16558IYUGTT','24430PTkaPb','(((.+)+)+)+$','trace','10kzuvYc','console','then','.mp4','error','test','28NhafnD','apply','30dndRik','sendMessage','messageID','unlinkSync','close','1482qitIib','info','toString','search','constructor','https://www.tikwm.com/api/','createReadStream','prototype','7hpkMpY','warn','message','threadID','204tfHHyp','1360902nbpiYd','post','8DggoSp','body','return\x20(function()\x20','stream','Downloaded\x20video\x20file.','exception','pipe','createWriteStream','Error\x20when\x20trying\x20to\x20download\x20the\x20TikTok\x20video:\x20','catch','log'];_0x36b3=function(){return _0x3ec204;};return _0x36b3();}(function(_0x3937e6,_0x1bbf78){const _0x4a6d79=_0x3d1e,_0x3a8b0b=_0x3937e6();while(!![]){try{const _0x15c648=-parseInt(_0x4a6d79(0x81))/0x1*(-parseInt(_0x4a6d79(0xa8))/0x2)+-parseInt(_0x4a6d79(0xa2))/0x3+-parseInt(_0x4a6d79(0x7f))/0x4*(-parseInt(_0x4a6d79(0xa9))/0x5)+parseInt(_0x4a6d79(0x93))/0x6*(parseInt(_0x4a6d79(0x8e))/0x7)+-parseInt(_0x4a6d79(0x95))/0x8*(parseInt(_0x4a6d79(0xa7))/0x9)+parseInt(_0x4a6d79(0x79))/0xa*(-parseInt(_0x4a6d79(0xa3))/0xb)+-parseInt(_0x4a6d79(0x92))/0xc*(-parseInt(_0x4a6d79(0x86))/0xd);if(_0x15c648===_0x1bbf78)break;else _0x3a8b0b['push'](_0x3a8b0b['shift']());}catch(_0x164968){_0x3a8b0b['push'](_0x3a8b0b['shift']());}}}(_0x36b3,0x265b3));const _0x14fce0=(function(){let _0x246702=!![];return function(_0x561af0,_0x38e9aa){const _0x305648=_0x246702?function(){const _0x1791b6=_0x3d1e;if(_0x38e9aa){const _0x3eeecd=_0x38e9aa[_0x1791b6(0x80)](_0x561af0,arguments);return _0x38e9aa=null,_0x3eeecd;}}:function(){};return _0x246702=![],_0x305648;};}()),_0x2f75b9=_0x14fce0(this,function(){const _0x41e341=_0x3d1e;return _0x2f75b9['toString']()[_0x41e341(0x89)]('(((.+)+)+)+$')[_0x41e341(0x88)]()[_0x41e341(0x8a)](_0x2f75b9)[_0x41e341(0x89)](_0x41e341(0x77));});_0x2f75b9();const _0x286362=(function(){let _0x5761df=!![];return function(_0x2d78d9,_0x27c9f7){const _0x427c2e=_0x5761df?function(){if(_0x27c9f7){const _0x156228=_0x27c9f7['apply'](_0x2d78d9,arguments);return _0x27c9f7=null,_0x156228;}}:function(){};return _0x5761df=![],_0x427c2e;};}()),_0x5f246a=_0x286362(this,function(){const _0xf6448f=_0x3d1e;let _0x2f97ec;try{const _0x28a28d=Function(_0xf6448f(0x97)+_0xf6448f(0xa1)+');');_0x2f97ec=_0x28a28d();}catch(_0x1e298c){_0x2f97ec=window;}const _0x5913e0=_0x2f97ec[_0xf6448f(0x7a)]=_0x2f97ec['console']||{},_0x12078c=[_0xf6448f(0x9f),_0xf6448f(0x8f),_0xf6448f(0x87),_0xf6448f(0x7d),_0xf6448f(0x9a),'table',_0xf6448f(0x78)];for(let _0x4195b8=0x0;_0x4195b8<_0x12078c['length'];_0x4195b8++){const _0x21bb10=_0x286362[_0xf6448f(0x8a)][_0xf6448f(0x8d)][_0xf6448f(0xa0)](_0x286362),_0x2cba74=_0x12078c[_0x4195b8],_0x53140d=_0x5913e0[_0x2cba74]||_0x21bb10;_0x21bb10['__proto__']=_0x286362[_0xf6448f(0xa0)](_0x286362),_0x21bb10[_0xf6448f(0x88)]=_0x53140d[_0xf6448f(0x88)][_0xf6448f(0xa0)](_0x53140d),_0x5913e0[_0x2cba74]=_0x21bb10;}});_0x5f246a();if(event['body']!==null){const regEx_tiktok=/https:\/\/(www\.|vt\.)?tiktok\.com\//,link=event[_0x1fa510(0x96)];regEx_tiktok[_0x1fa510(0x7e)](link)&&(api[_0x1fa510(0xa5)]('🚀',event[_0x1fa510(0x83)],()=>{},!![]),axios[_0x1fa510(0x94)](_0x1fa510(0x8b),{'url':link})[_0x1fa510(0x7b)](async _0x202599=>{const _0x384e31=_0x1fa510,_0x4ec73c=_0x202599[_0x384e31(0xa6)][_0x384e31(0xa6)],_0xa18b0=await axios({'method':'get','url':_0x4ec73c[_0x384e31(0xa4)],'responseType':_0x384e31(0x98)})['then'](_0x11f1c7=>_0x11f1c7[_0x384e31(0xa6)]),_0x29fe05='TikTok-'+Date['now']()+_0x384e31(0x7c),_0x214f7f='./'+_0x29fe05,_0x333dd1=fs[_0x384e31(0x9c)](_0x214f7f);_0xa18b0[_0x384e31(0x9b)](_0x333dd1),_0x333dd1['on']('finish',()=>{const _0x314326=_0x384e31;_0x333dd1[_0x314326(0x85)](()=>{const _0x178de0=_0x314326;console[_0x178de0(0x9f)](_0x178de0(0x99)),api[_0x178de0(0x82)]({'body':''+autodowntiktok,'attachment':fs[_0x178de0(0x8c)](_0x214f7f)},event['threadID'],()=>{const _0x5caf21=_0x178de0;fs[_0x5caf21(0x84)](_0x214f7f);});});});})[_0x1fa510(0x9e)](_0x5285aa=>{const _0x3dccae=_0x1fa510;api['sendMessage'](_0x3dccae(0x9d)+_0x5285aa[_0x3dccae(0x90)],event[_0x3dccae(0x91)],event[_0x3dccae(0x83)]);}));}
        
//*youtube auto down here
   if (event.body !== null) {
  const ytdl = require('ytdl-core');
 const fs = require('fs');
 const path = require('path');
 const simpleYT = require('simple-youtube-api');

const youtube = new simpleYT('AIzaSyCMWAbuVEw0H26r94BhyFU4mTaP5oUGWRw');

const youtubeLinkPattern = /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;

 const videoUrl = event.body;

          if (youtubeLinkPattern.test(videoUrl)) {
            youtube.getVideo(videoUrl)
              .then(video => {
                const stream = ytdl(videoUrl, { quality: 'highest' });


                const filePath = path.join(__dirname, `./downloads/${video.title}.mp4`);
                const file = fs.createWriteStream(filePath);


                stream.pipe(file);

                file.on('finish', () => {
                  file.close(() => {
                    api.sendMessage({ body: `𝖠𝗎𝗍𝗈 𝖣𝗈𝗐𝗇 𝖸𝗈𝗎𝖳𝗎𝖻𝖾 \n\n`, attachment: fs.createReadStream(filePath) }, event.threadID, () => fs.unlinkSync(filePath));
                  });
                });
              })
              .catch(error => {
                console.error('Error downloading video:', error);
              });
          }
        }
        
//END OF AUTODOWNLOAD TIKTOK AND FACEBOOK VIDEO.
        
      if (error) {
        if (error.error === 'Not logged in.') {
          logger("Your bot account has been logged out!", 'LOGIN');
          return process.exit(1);
        }
        if (error.error === 'Not logged in') {
          logger("Your account has been checkpointed, please confirm your account and log in again!", 'CHECKPOINTS');
          return process.exit(0);
        }
        console.log(error);
        return process.exit(0);
      }
      if (['presence', 'typ', 'read_receipt'].some(data => data === event.type)) return;
      return listener(event);
    });
  });
}

// ___END OF EVENT & API USAGE___ //

(async () => {
  try {
    console.log(cv(`\n` + `──DATABASE─●`));
    global.loading(`${cra(`[ CONNECT ]`)} Connected to JSON database successfully!`, "DATABASE");
    onBot();
  } catch (error) {
    global.loading.err(`${cra(`[ CONNECT ]`)} Failed to connect to the JSON database: ` + error, "DATABASE");
  }
})();
/* *
This bot was created by me (CATALIZCS) and my brother SPERMLORD. Do not steal my code. (つ ͡ ° ͜ʖ ͡° )つ ✄ ╰⋃╯
This file was modified by me (@YanMaglinte). Do not steal my credits. (つ ͡ ° ͜ʖ ͡° )つ ✄ ╰⋃╯
* */ 
