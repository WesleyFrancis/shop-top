const chalk = require("chalk");
const log = console.log;

const main = {
    dbError(inputinfo)
    {
        log(chalk.red.underline(inputinfo));
    },
    generalError(inputinfo)
    {
        log(chalk.yellowBright(inputinfo));
    },
}
module.exports = main;