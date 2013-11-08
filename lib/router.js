module.exports = function (page, model, params, next) {
    var url = page.params.url;
    var query = model.query('yamlpages', {url: url});
    model.fetch(query, function (err) {
        var docs = model.filter('yamlpages', function (p) {
            return p.url == url;
        }).get();
        if (docs.length) {
            var doc = docs[0];
            model.set('_page.data', doc.data);
            page.render(doc.data.__template || 'yamlpage__default');
        } else {
            next();
        }
    });
};
