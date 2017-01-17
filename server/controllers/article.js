/**
 * Article controller
 *
 * @module    :: Controller
 * @description :: Contains logic for handling requests.
 */
module.exports = {
  find(req, res) {
    if (!req.we.acl.canStatic('access_articles_unpublished', req.userRoleNames)) {
      res.locals.query.where.published = true;
    }

    return res.locals.Model
    .findAndCountAll(res.locals.query)
    .then( (record)=> {
      res.locals.metadata.count = record.count;
      res.locals.data = record.rows;
      return res.ok();
    })
    .catch(res.queryError);
  },

  findOne(req, res, next) {
    if (!res.locals.data) return next();

    // check if can access articles unpublished
    if (!res.locals.data.published) {
      if (!req.we.acl.canStatic('access_articles_unpublished', req.userRoleNames)) {
        return res.forbidden();
      }
    }

    req.we.hooks.trigger('we:after:send:ok:response', {
      res: res, req: req
    }, (err)=> {
      if (err) return res.serverError(err);
      return res.ok();
    });
  }
};