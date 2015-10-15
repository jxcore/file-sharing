var path = require('path');
var jxcorePath = path.resolve(__dirname, './www/jxcore');

module.exports = {
    jxcorePath: jxcorePath,
    publicPath: path.resolve(__dirname, './public'),
    buildPath: path.resolve(jxcorePath, './build'),
    sharedPath: path.resolve(jxcorePath, './shared')
};