/**
 * ArticleModel
 *
 * @module      :: Model
 * @description :: [Add info about you model here]
 *
 */

module.exports = {
  schema: true,
  attributes: {

    active: {
      type: 'boolean',
      defaultsTo: true
    },

    published: {
      type: 'boolean',
      defaultsTo: false
    },

    title: {
      type: 'text',
      required: true
    },

    body: {
      type: 'text',
      required: true
    },

    // body without tags
    bodyClean: {
      type: 'text'
    },

    // body small body text version or description
    bodyTeaser: {
      type: 'text'
    },

    creator: {
      model: 'user',
      required: true
    },

    images: {
      collection: 'images',
      via: 'inArticle'
    },

    comment: {
      collection: 'comment',
      via: 'article'
    }

  },

  beforeCreate: function(record, next) {
    var originalBody = record.body;

    SanitizeHtmlService.sanitizeAllAttr(record);
    // create one tag clean text version
    record.bodyClean = S(originalBody).stripTags().s;
    // small teaser text
    record.bodyTeaser = record.bodyClean.substr(0, 100);

    next();
  },

  beforeUpdate: function(record, next) {
    var originalBody = record.body;

    SanitizeHtmlService.sanitizeAllAttr(record);
    // create one tag clean text version
    record.bodyClean = S(originalBody).stripTags().s;
    // small teaser text
    record.bodyTeaser = record.bodyClean.substr(0, 100);

    next();
  }
};
