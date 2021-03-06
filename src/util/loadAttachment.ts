import { MessageAttachment } from "discord.js";
import fetch from "make-fetch-happen";

const nodeFetch = fetch.defaults({
    cacheManager: "./.cache/"
});

/**
 * Loads an attachment and returns contents
 *
 * @private
 * @param {MessageAttachment} attachment
 * @returns {Promise}
 */
const loadAttachment = (attachment: MessageAttachment): Promise<string> =>
    new Promise((resolve, reject) => {
        nodeFetch(attachment.url)
            .then(response => response.text())
            .then(resolve)
            .catch(reject);
    });

export { loadAttachment };
