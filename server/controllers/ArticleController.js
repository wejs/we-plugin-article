/**
 * ArticleController
 *
 * @module    :: Controller
 * @description :: Contains logic for handling requests.
 */

// we.js controller utils
var actionUtil = require('we-helpers').actionUtil;
var util = require('util');

module.exports = {
  // add your plugin controllers here
  createPage: function(req, res) {
    return res.view();
  },

  create: function createRecord (req, res) {
    if (!req.isAuthenticated()) return res.forbidden();

    var sails = req._sails;
    var Model = sails.models.article;

    var data = actionUtil.parseValues(req);

    // set relato creator as authenticated user
    data.creator = req.user.id;

    sails.models.tag.validateAndCreateTags(data.tag, data.creator, function(err, tagIds) {
      if (err) {
        sails.log.error('ArticleController:create:Error on validateAndCreateTags', err);
        return res.negotiate(err);
      }

      data.tag = tagIds;

      // Create new instance of model using data from params
      Model.create(data).exec(function created (err, newInstance) {
        if (err) {
          sails.log.error('Error on create relato:', err);
          return res.negotiate(err);
        }

        Model.findById(newInstance.id)
        .populate('featuredImage')
        .populate('images')
        .populate('creator')
        .populate('category')
        .populate('tag')
        .exec(function(err, newInstance) {
          res.status(201);
          return res.ok(newInstance);
        })
      });
    })
  },

  update: function updateOneRecord (req, res) {
    if (!req.isAuthenticated()) return res.forbidden();

    var sails = req._sails;
    var Model = sails.models.article;

    var pk = actionUtil.requirePk(req);

    var values = actionUtil.parseValues(req);

    if (!values.featuredImage) {
      values.featuredImage = null;
    }

    // Omit the path parameter `id` from values, unless it was explicitly defined
    // elsewhere (body/query):
    var idParamExplicitlyIncluded = ((req.body && req.body.id) || req.query.id);
    if (!idParamExplicitlyIncluded) delete values.id;

    // Find and update the targeted record.
    Model.findOne(pk).exec(function found(err, matchingRecord) {
      if (err) return res.serverError(err);
      if (!matchingRecord) return res.notFound();

      // dont allow creator change in update
      values.creator = matchingRecord.creator;

      sails.models.tag.validateAndCreateTags(values.tag, values.creator, function(err, tagIds){
        if (err) {
          sails.log.error('ArticleController:create:Error on validateAndCreateTags', err);
          return res.negotiate(err);
        }

        values.tag = tagIds;

        Model.update(pk, values).exec(function updated(err, records) {
          if (err) return res.negotiate(err);
          // Because this should only update a single record and update
          // returns an array, just use the first item.  If more than one
          // record was returned, something is amiss.
          if (!records || !records.length || records.length > 1) {
            req._sails.log.warn(
            util.format('Unexpected output from `%s.update`.', Model.globalId)
            );
          }
          var updatedRecord = records[0];

          // Do a final query to populate the associations of the record.
          Model.findOneById(updatedRecord.id)
          .populate('featuredImage')
          .populate('images')
          .populate('creator')
          .populate('category')
          .populate('tag')
          .exec(function foundAgain(err, populatedRecord) {
            if (err) return res.serverError(err);
            if (!populatedRecord) return res.serverError('Could not find record after updating!');

            // If we have the pubsub hook, use the Model's publish method
            // to notify all subscribers about the update.
            if (req._sails.hooks.pubsub) {
              Model.publishUpdate(pk, _.cloneDeep(values), !req.options.mirror && req
              );
            }

            return res.ok(populatedRecord);
          }); // </foundAgain>
        });// </updated>
      });
    });
  },

  /**
   * Find Records
   *
   *  get   /:modelIdentity
   *   *    /:modelIdentity/find
   *
   * An API call to find and return model instances from the data adapter
   * using the specified criteria.  If an id was specified, just the instance
   * with that unique id will be returned.
   *
   * Optional:
   * @param {Object} where       - the find criteria (passed directly to the ORM)
   * @param {Integer} limit      - the maximum number of records to send back (useful for pagination)
   * @param {Integer} skip       - the number of records to skip (useful for pagination)
   * @param {String} sort        - the order of returned records, e.g. `name ASC` or `age DESC`
   * @param {String} callback - default jsonp callback param (i.e. the name of the js function returned)
   */

  find: function findRecords (req, res) {
    // ignore search string from default sails criteria parser
    req.options.criteria.blacklist.push('q');
    // Look up the model
    var Model = req._sails.models.article;
    var where = actionUtil.parseCriteria(req) ;
    // quer search string value
    var searchString = req.param('q');
    // Lookup for records that match the specified criteria
    var query = Model.find()
    .where( where )
    .limit( actionUtil.parseLimit(req) )
    .skip( actionUtil.parseSkip(req) )
    .sort( actionUtil.parseSort(req) );

    var searchStringQuery = {};

    if ( searchString ) {
      var searchStringQuery = {
        or: [
          { title: searchString },
          { body: searchString }
        ]
      }
    }

    query.where(searchStringQuery);

    // TODO: .populateEach(req.options);
    query = actionUtil.populateEach(query, req);
    query.exec(function found(err, matchingRecords) {
      if (err) return res.serverError(err);

      Model.count()
      .where( where )
      .where( searchStringQuery )
      .exec(function afterCount(err, count) {
        if (err) return res.serverError(err);

        res.locals.metadata.count = count;

        res.ok(matchingRecords);
      });
    });
  }
};
