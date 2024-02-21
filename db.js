const mongoose = require('mongoose')
const chalk = require('chalk')

const uri = 'mongodb+srv://ryanfredericksuni:ryanfredericks1324@user.nlhfhky.mongodb.net/cooltechDB'

mongoose.Promise = global.Promise;

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true, 
});

mongoose.connection.on('error', (error) => {
    console.error(chalk.red('Could not connect to the database:', error));
    process.exit(1);
});

mongoose.connection.once('open', () => {
    console.log(chalk.blue('Successfully connected to the database'));
});

module.exports = mongoose;