/**
 * article
 *
 * @module      :: Model
 * @description :: article model
 *
 */

module.exports = function articleModel(we) {
  var model = {
    // define you model here
    // see http://docs.sequelizejs.com/en/latest/docs/models-definition
    definition: {
      active: {
        type: we.db.Sequelize.BOOLEAN,
        defaultValue: true,
        formFieldType: null
      },
      published: {
        type: we.db.Sequelize.BOOLEAN,
        defaultValue: true,
        formFieldType: null
      },
      title: {
        type: we.db.Sequelize.STRING,
        allowNull: false
      },
      about: {
        type: we.db.Sequelize.TEXT,
        allowNull: false,
        formFieldType: 'textarea',
      },
      body: {
        type: we.db.Sequelize.TEXT,
        allowNull: false,
        formFieldType: 'html',
        formFieldHeight: 400
      }
    },
    // Associations
    // see http://docs.sequelizejs.com/en/latest/docs/associations
    associations: {
      creator: {
        type: 'belongsTo',
        model: 'user'
      }
    },
    options: {
      // title field, for default title record pages
      titleField: 'title',

      termFields: {
        tags: {
          vocabularyName: null,
          canCreate: true,
          formFieldMultiple: true,
          onlyLowercase: true
        },
        category: {
          vocabularyName: 'Category',
          canCreate: false,
          formFieldMultiple: false
        }
      },

      imageFields: {
        featuredImage: { formFieldMultiple: false },
        images: { formFieldMultiple: true }
      },

      fileFields: {
        attachment: { formFieldMultiple: true }
      },

      // Class methods for use with: we.db.models.[yourmodel].[method]
      classMethods: {
        // suport to we.js url alias feature
        urlAlias: function urlAlias(record) {
          return {
            alias: '/'+ we.i18n.__('articles') +'/' + record.id + '-'+  we.utils
              .string( record.title ).slugify().s,
            target: '/article/' + record.id,
          }
        }

      },
      // record method for use with record.[method]
      instanceMethods: {},
      // Sequelize hooks
      // See http://docs.sequelizejs.com/en/latest/api/hooks
      hooks: {}
    }
  };

  return model;
};