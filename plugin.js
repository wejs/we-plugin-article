/**
 * We.js article plugin main file
 */

module.exports = function loadPlugin(projectPath, Plugin) {
  const plugin = new Plugin(__dirname);

  plugin.setConfigs({
    perissions: {
      'access_articles_unpublished': {
        'title': 'Access unpublished articles'
      }
    }
  });

  // set plugin resource
  plugin.setResource({
    name: 'article',
    findAll: {
      search: {
        published: {
          parser: 'equalBoolean',
          target: {
            type: 'field',
            field: 'published'
          }
        }
      }
    },
    findOne: {
      metatagHandler: 'articleFindOne'
    }
  });

  plugin.events.on('we:after:load:plugins', function (we) {
    if (we.router.metatag) {
      we.router.metatag.add('articleFindOne', function metatagArticleFindOne(req, res, next) {
        if (!res.locals.data) return next();

        const hostname = we.config.hostname;

        res.locals.metatag +=
          '<meta property="og:url" content="'+hostname+req.urlBeforeAlias+'" />'+
          '<meta property="og:title" content="'+res.locals.title+'" />' +
          '<meta property="og:site_name" content="'+res.locals.appName+'" />'+
          '<meta property="og:type" content="profile" />';

          if (res.locals.data.about) {
            const description = we.utils.string(res.locals.data.about).stripTags().truncate(200).s;
            res.locals.metatag += '<meta property="og:description" content="'+
              description+
            '" />';
            res.locals.metatag += '<meta content="'+description+'" name="description">';
          }

          if (res.locals.data.featuredImage && res.locals.data.featuredImage[0]) {
            let img = res.locals.data.featuredImage[0];

            res.locals.metatag +=
              '<meta property="og:image" content="'+img.urls.large+'" />'+
              '<meta property="og:image:type" content="'+img.mime+'" />'+
              '<meta property="og:image:width" content="'+we.config.upload.image.styles.large.width+'" />'+
              '<meta property="og:image:height" content="'+we.config.upload.image.styles.large.height+'" />';
          }

          if (res.locals.data.tags && res.locals.data.tags.length) {
            res.locals.metatag +=
              '<meta name="keywords" content="'+res.locals.data.tags.join(',')+'" />';
          }

        next();
      });
    }
  });

  return plugin;
};
