derby-yamlpages
===============

Install
-------
    npm install derby-yamlpages

Add to the end of the `lib/server/index.js`: 

    require('derby-yamlpages').sync({
        model: store.createModel()
    });

Add to the end of the `lib/app/index.js`:

    app.get('*', require('derby-yamlpages').router);


Put your content to the `content/yamlpages/`.
Note that you need to replace `/` in page url to `|` in its file name.
For example: `/my/page/` => `|my|page|.yml`

Put your templates to the `views/app/' directory.


Content example
---------------
Content files uses yaml syntax and it can contains any variables, for example:

    title: my page
    body: |
        # Page
        You can use `markdown` syntax.

Templates
---------
Default template named `yamlpage__default.html`. Put it to the `views/app/` directory:

    <Title:>
      {{_page.data.title}}

    <Body:>
      {{unescaped _page.data.body}}

You can change template with `__template` variable in content file.

Converters
----------
Converters uses for data transformations.
For example, `default` converter transforms body from markdown to html.
You can pass your own converters to the `derby-yamlpages.sync`.
