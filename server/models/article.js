/**
 * Article model
 *
 * @module      :: Model
 * @description :: article model
 */

module.exports = function articleModel(we) {
  const model = {
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
      publishedAt: {
        type: we.db.Sequelize.DATE,
        formFieldType: null, // hide this field
        allowNull: true
      },
      highlighted: {
        type: we.db.Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        formFieldType: null
      },
      showInLists: {
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
    associations: {
      creator: {
        type: 'belongsTo',
        model: 'user'
      }
    },
    options: {
      // title field, for default title record pages
      titleField: 'title',
      tableName: 'articles',

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
        urlAlias(record) {
          let slugPart1 = we.utils.stripTagsAndTruncate(we.i18n.__('articles'), 30, '');
          let slugPart2 = we.utils.stripTagsAndTruncate(record.id + '-'+ record.title, 30, '');

          return {
            alias: '/'+ slugPart1 +'/' + slugPart2,
            target: '/article/' + record.id,
          };
        }
      },
      instanceMethods: {
        setPublishDates(record) {
          if (record.published && !record.publishedAt) {
            record.publishedAt = new Date();
          }
        }
      },
      hooks: {
        beforeValidate(record) {
          if (!record.highlighted) {
            record.highlighted = 0;
          }
        },
        beforeCreate(record) {
          record.setPublishDates(record);
        },
        beforeUpdate(record) {
          record.setPublishDates(record);
        },

      }
    }
  };

  return model;
};