const path = require('path');
const config = require('./config');
const { getWebpackMode } = require('./util');

module.exports = {
    entry: path.resolve(__dirname, '../index.js'),
    output: {
        path: config.electronMainOutputDir,
        filename: 'index.js'
    },
    mode: getWebpackMode(),
    target: 'electron-main'
};