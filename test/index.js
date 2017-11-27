"use strict";

const Dingy = require("../index");
const loadAttachment = require("../lib/util/loadAttachment")


const config = {
    token: process.env.DISCORD_TOKEN_TEST,
    prefix: "$$",
    options: {
        logLevel: "debug"
    },
    roles: [{
        name: "Admin",
        power: 10,
        assignable: false,
        check: (member) => ["128985967875850240"].includes(member.user.id)
    }, {
        name: "User",
        power: 1,
        assignable: true,
        check: () => true
    }],
};

const commands = {
    test: {
        fn: () => "foo",
        sub: {
            weirdtype: {
                fn: () => true
            },
            async: {
                fn: () => new Promise(resolve => setTimeout(() => {
                    resolve(["success", "yaml"]);
                }, 2000))
            },
            long: {
                fn: () => "a".repeat(3000),
            },
            admin: {
                fn: () => "success",
                powerRequired: 10,
            },
            adminMax: {
                fn: () => "success",
                powerRequired: 11,
            },
            args: {
                fn: () => "success",
                args: [{
                    name: "foo",
                    required: true
                }]
            },
            attachment: {
                fn: () => ["success", false, ["http://lorempixel.com/output/food-q-c-640-480-10.jpg"]],
            },
            attachmentLoad: {
                fn: (args, msg) => new Promise((resolve, reject) => {
                    const attachments = msg.attachments.array();

                    if (attachments.length < 1) {
                        reject("No attachment found");
                    } else {
                        loadAttachment(attachments[0])
                            .then(console.log)
                            .catch(console.log);

                        resolve("OK!");
                    }
                }),
            },
            event: {
                fn: () => ["baaaaaaa", false, [], {
                    onSend: msg => msg.react("128985967875850240")
                }],
                alias: ["events"]
            },
        }
    },
};

const bot = new Dingy(config, commands);

bot.connect();
