import { dingyCommandFn } from "../../command";

/**
 * Evaluates
 *
 * @private
 * @param {Array<any>} args
 * @param {Message} msg
 * @param {App} app
 * @returns {false}
 */
const commandCoreEval: dingyCommandFn = args => {
    let result = "";

    try {
        // tslint:disable-next-line:no-eval
        result = eval(<string>args.code);
    } catch (err) {
        result = err;
    }

    // tslint:disable-next-line:no-console
    console.log(result);

    return "Done.";
};

export { commandCoreEval };
