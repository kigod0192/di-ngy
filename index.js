"use strict";

const merge = require("lodash/merge");
const Log = require("log");
const Clingy = require("cli-ngy");
const Discord = require("discord.js");
const flatCache = require("flat-cache");

const configDefault = require("./lib/defaults/config.default");
const stringsDefault = require("./lib/defaults/strings.default");
const commandsDefault = require("./lib/defaults/commands.default");
const userEventsDefault = require("./lib/defaults/userEvents.default");

const onMessage = require("./lib/events/onMessage");

/**
 * Di-ngy class
 * @class
 */
module.exports = class {
    /**
     * Creates Di-ngy instance
     * {
     *   bot,           //Discord.js instance
     *   cli,           //Cli-ngy command parser
     *   log,           //Logger
     *
     *   strings,       //String object
     *   config,        //Config object
     *   userEvents     //Even object
     *
     *   data,          //Runtime Data
     *   dataPersisted  //Persisted Data (As JSON)
     * }
     * @constructor
     * @param {Object} config
     * @param {Object} commands
     * @param {Object} strings
     * @param {Object} userEvents
     */
    constructor(config, commands = {}, strings = {}, userEvents = {}) {
        const app = this;
        let commandsMerged;

        if (!config.token) {
            throw new Error("No token provided!");
        }
        if (!config.adminIds.length) {
            throw new Error("No admin-IDs provided!");
        }

        app.config = merge(configDefault, config);
        app.strings = merge(stringsDefault, strings);
        app.userEvents = merge(userEventsDefault, userEvents);

        if (app.config.options.enableDefaultCommands) {
            commandsMerged = merge(commandsDefault, commands);
        } else {
            commandsMerged = commands;
        }



        app.log = new Log(app.config.options.logLevel);
        app.log.debug("Init", "Loaded Config");

        app.cli = new Clingy(commandsMerged, {
            caseSensitive: app.config.options.commandsAreCaseSensitive,
            suggestSimilar: app.config.options.answerToMissingCommand,
        });
        app.log.debug("Init", "Created Clingy");

        app.bot = new Discord.Client();
        app.log.debug("Init", "Created Discord Client");

        app.data = {};
        app.dataPersisted = {};

        app.config.dataPersisted.files.forEach(fileName => {
            app.dataPersisted[fileName] = flatCache.load(`${fileName}.json`, app.config.dataPersisted.dir);
        });
        app.log.debug("Init", "Loaded Data");



        app.bot.on("message", msg => {
            onMessage(msg, app);
            app.userEvents.onMessage(msg, app);
        });

        app.log.info("Init", "Success");
        app.userEvents.onInit(app);
    }
    /**
     * Connect to the Discord API
     */
    connect() {
        const app = this;

        app.log.info("Connect", "Starting");

        app.bot
            .login(app.config.token)
            .then(() => {
                app.log.info("Connect", "Success");
                app.bot.user.setGame(app.strings.currentlyPlaying);
                app.userEvents.onConnect(app);
            })
            .catch(err => {
                app.log.error("Connect", "Failure");

                throw new Error("An error occured connecting to the Discord-API", err);
            });
    }
};
