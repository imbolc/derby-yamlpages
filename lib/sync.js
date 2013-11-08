var fs = require("fs");
var crypto = require('crypto');
var marked = require('marked');
require('js-yaml');


module.exports = function (cfg) {
    var contentDir = cfg.contentDir || __dirname + '/../../../content/yamlpages/';
    var converters = cfg.converters || defaultConverters;
    var fsPages = getFsPages(contentDir, converters);
    cfg.model.fetch('yamlpages', function () {
        updatePages(cfg.model, fsPages);
        deletePages(cfg.model, fsPages);
    });
};


var defaultConverters = {
    default: function (data) {
       data.body = marked(data.body);
    }
};


function updatePages(model, fsPages) {
    fsPages.forEach(function (fsPage) {
        var pages = model.filter('yamlpages', function (page) {
            return fsPage.url == page.url;
        }).get();
        if (pages.length) {
            var page = pages[0];
            if (page.hash != fsPage.hash) {
                console.log('~ yamlpage update:', page.url);
                fsPage.id = page.id; // DERBY BUG ?
                model.set('yamlpages.' + page.id, fsPage);
            } else {
                console.log('. yamlpage skip:', page.url);
            }
        } else {
            console.log('+ yamlpage add:', fsPage.url);
            model.add('yamlpages', fsPage);
        }
    });
}


function deletePages(model, fsPages) {
    var urls = fsPages.map(function (page) {
        return page.url;
    });
    model.filter('yamlpages').get()
        .forEach(function (page) {
            if (!~urls.indexOf(page.url)) {
                console.log('- yamlpage delete:', page.url);
                model.del('yamlpages.' + page.id);
            }
        });
}


function getFsPages(contentDir, converters) {
    return fs.readdirSync(contentDir).map(function (fname) {
        if (fname[0] != '|') {
            return;
        }
        var path = contentDir + fname;
        var text = fs.readFileSync(path);
        var url = fname.slice(0, -4).replace(/\|/g, '\/');
        var hash = crypto.createHash('md5').update(text).digest("hex");
        var data = require(path);
        var converter = converters[data.__converter || 'default'];
        converter(data);
        return {
            fname: fname,
            hash: hash,
            url: url,
            data: data
        };
    });
}

