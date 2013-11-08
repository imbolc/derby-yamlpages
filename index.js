exports.router = require('./lib/router');
exports.sync = function (cfg) {
    eval("require('./lib/sync')(cfg);");
};
