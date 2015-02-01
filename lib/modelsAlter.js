/**
 * modelsAlter hook
 *
 * run after we.js load all plugin resources and after sails.js process the model schemes
 * use it to alter a model or insert extra attributes in other plugin module
 *
 * @param  {object}   sails current sails.js object
 * @param  {Function} cb    callback
 */
module.exports = function modelsAlter(sails, cb) {
  // models scheme are avaible in sails.models['model-name']

  // --- REQUIRED MODEL CHECK
  var errMsg;
  if (!sails.models.user) {
    errMsg = 'User model is required for we-plugin-article';
    sails.log.error(errMsg, Object.keys(sails.models));
    return cb(errMsg);
  }

  if (!sails.models.images) {
    errMsg = 'Images model is required for post model in we-plugin-article';
    sails.log.error(errMsg, Object.keys(sails.models));
    return cb(errMsg);
  } else {
    // add post relationship in image model
    sails.models.images.attributes.inArticle = {
      model: 'article',
      via: 'images'
    }

    sails.models.images.attributes.inArticleFeatured = {
      collection: 'article',
      via: 'featuredImage'
    }
  }

  // --- ASSOCIATIONS
  //
  if (sails.models.comment) {
    // add comments relationship in post
    sails.models.comment.attributes.article = {
      model: 'article',
      via: 'comments'
    };

  } else {
    sails.log.verbose('Cant set comments relatinship for article comments '+
      '| Sails.js comments model not found in sails models:', Object.keys(sails.models));
  }

  // terms
  sails.models.term.attributes.inArticleCategory = {
    collection: 'article',
    via: 'category'
  }
  sails.models.tag.attributes.inArticleTag = {
    collection: 'article',
    via: 'tag'
  }


  // Always remember to run the callback
  cb();
};