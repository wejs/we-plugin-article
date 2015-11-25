/**
 * We.js article plugin config
 */

module.exports = function loadPlugin(projectPath, Plugin) {
  var plugin = new Plugin(__dirname);

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
      }
  });

  return plugin;
};
