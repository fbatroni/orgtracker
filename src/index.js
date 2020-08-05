// Transpile all code following this line with babel and use '@babel/preset-env' (aka ES6) preset.
require('@babel/register');
require('@babel/polyfill');
const path = require('path');

module.exports = require(path.join(__dirname, '/app.js'));
