/**
 * Article controller
 *
 * @module    :: Controller
 * @description :: Contains logic for handling requests.
 */
module.exports = {
  find: function findAll(req, res) {
    if (!req.we.acl.canStatic('access_articles_unpublished', req.userRoleNames)) {
      req.query.published = false;
    }

    console.log('>>', req.query);

    return res.locals.Model.findAndCountAll(res.locals.query)
    .then(function (record) {
      res.locals.metadata.count = record.count;
      res.locals.data = record.rows;
      return res.ok();
    }).catch(res.queryError);
  },

  findOne: function findOne(req, res, next) {
    if (!res.locals.data) return next();

    // check if can access articles unpublished
    if (!res.locals.data.published) {
      if (!req.we.acl.canStatic('access_articles_unpublished', req.userRoleNames)) {
        return res.forbidden();
      }
    }

    req.we.hooks.trigger('we:after:send:ok:response', {
      res: res, req: req
    }, function (err) {
      if (err) return res.serverError(err);
      return res.ok();
    });
  }
};