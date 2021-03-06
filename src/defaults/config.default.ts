import { Message } from "discord.js";

interface IDingyConfigRole {
    name: string;
    power: number;
    assignable: boolean;
    check: (msg: Message) => boolean;
}

interface IDingyConfig {
    prefix: string;
    token: string;
    dataPersisted: {
        dir: string;
        files: string[];
    };
    roles: IDingyConfigRole[];
    options: {
        enableDefaultCommands: boolean;
        namesAreCaseSensitive: boolean;
        validQuotes: string[];

        answerToMissingCommand: boolean;
        answerToMissingArgs: boolean;
        answerToMissingPerms: boolean;

        sendFilesForLongReply: boolean;

        logLevel: string;
    };
}

const configDefault: IDingyConfig = {
    prefix: "myPrefix", // Prefix to respond to: prefix:'foo' => responds to "foo help"
    token: "#botToken#", // Bot-token, should be secret! (Using ENV-vars to store this is recommended)
    dataPersisted: {
        dir: "./data/", // Directory to store JSON files, relative from base directory
        files: [] // File names, "foo" will be saved as "foo.json" and can be accessed with bot.dataPersisted.foo
    },
    roles: [
        {
            name: "Admin",
            power: 10,
            assignable: false,
            check: (msg: Message) => ["yourIdHere"].includes(msg.author.id)
        },
        {
            name: "User",
            power: 1,
            assignable: true,
            check: () => true
        }
    ],
    options: {
        enableDefaultCommands: true, // If the built-in "about", "help" and "eval" commands should be active
        namesAreCaseSensitive: false, // cli-ngy: If false, "#botPrefix# hElP" will work too
        validQuotes: ["\""], // cli-ngy: List of characters to support enclosing quotedStrings for.

        answerToMissingCommand: false, // If a message should be that the command requested doesn't exist
        answerToMissingArgs: true, // If a message should be sent indicating that arguments were missing
        answerToMissingPerms: true, // If a message should be sent indicating that permissions were missing

        sendFilesForLongReply: true, // If replies over 2000 chars should be sent as file instead

        logLevel: "info" // Winston log level
    }
};

export { configDefault, IDingyConfig, IDingyConfigRole };
