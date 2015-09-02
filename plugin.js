/**
 * We.js article plugin config
 */

module.exports = function loadPlugin(projectPath, Plugin) {
  var plugin = new Plugin(__dirname);

  // set plugin configs
  // plugin.setConfigs({});

  // set plugin resource
  plugin.setResource({
    name: 'article'
  });

  return plugin;
};
