/**
 * Content controller
 *
 * @module    :: Controller
 * @description :: Contains logic for handling requests.
 */
module.exports = {
  find(req, res) {
    if (
      req.accepts('html') ||
      !req.we.acl.canStatic('access_articles_unpublished', req.userRoleNames)
    ) {
      res.locals.query.where.published = true;
    }

    const Op = req.we.Op;

    // default sort:
    if (!req.query.sort) {
      res.locals.query.order = [
        ['highlighted', 'DESC'],
        ['publishedAt', 'DESC'],
        ['createdAt', 'DESC'],
        ['id', 'DESC']
      ];
    }

    if (req.query.q) {
      res.locals.query.where[Op.or] = {
        title: {
          [Op.like]: '%'+req.query.q+'%'
        },
        body: {
          [Op.like]: '%'+req.query.q+'%'
        }
      };
    }

    return res.locals.Model
    .findAll(res.locals.query)
    .then( (records)=> {
      return res.locals.Model.count(res.locals.query)
      .then((count)=> {
        return {
          rows: records,
          count: count
        };
      });
    })
    .then( (results)=> {
      res.locals.metadata.count = results.count;
      res.locals.data = results.rows;
      return res.ok();
    })
    .catch(res.queryError);
  },

  findOne(req, res, next) {
    if (!res.locals.data) return next();

    // check if can access contents unpublished
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
  },

  /**
   * Default count action
   *
   * Built for only send count as JSON
   *
   * @param  {Object} req express.js request
   * @param  {Object} res express.js response
   */
  count(req, res) {
    return res.locals.Model
    .count(res.locals.query)
    .then( (count)=> {
      res.status(200).send({ count: count });
      return null;
    })
    .catch(res.queryError);
  },

  /**
   * Create and create page actions
   *
   * @param  {Object} req express.js request
   * @param  {Object} res express.js response
   */
  create(req, res) {
    if (!res.locals.template) {
      res.locals.template = res.locals.model + '/' + 'create';
    }

    if (!res.locals.data) {
      res.locals.data = {};
    }

    if (req.method === 'POST') {
      if (req.isAuthenticated && req.isAuthenticated()) {
        req.body.creatorId = req.user.id;
      }

      req.we.utils._.merge(res.locals.data, req.body);

      return res.locals.Model
      .create(req.body)
      .then(function afterCreate (record) {
        res.locals.data = record;
        res.created();
        return null;
      })
      .catch(res.queryError);
    } else {
      // send the admin or editor to admin create content page:
      res.redirect('/admin/#/articles/create');
    }
  },
  /**
   * Edit, edit page and update action
   *
   * Record is preloaded in context loader by default and is avaible as res.locals.data
   *
   * @param  {Object} req express.js request
   * @param  {Object} res express.js response
   */
  edit(req, res) {
    if (!res.locals.template) {
      res.locals.template = res.local.model + '/' + 'edit';
    }

    let record = res.locals.data;

    if (req.we.config.updateMethods.indexOf(req.method) >-1) {
      if (!record) {
        return res.notFound();
      }

      record.update(req.body)
      .then(function reloadAssocs(n) {
        return n.reload()
        .then(function() {
          return n;
        });
      })
      .then(function afterUpdate (newRecord) {
        res.locals.data = newRecord;
        res.updated();
        return null;
      })
      .catch(res.queryError);
    } else {

      // send the admin or editor to admin edit content page:
      res.redirect('/admin/#/articles/'+record.id);
    }
  },
  /**
   * Delete and delete action
   *
   * @param  {Object} req express.js request
   * @param  {Object} res express.js response
   */
  delete(req, res) {
    if (!res.locals.template) {
      res.locals.template = res.local.model + '/' + 'delete';
    }

    let record = res.locals.data;

    if (!record) {
      return res.notFound();
    }

    res.locals.deleteMsg = res.locals.model + '.delete.confirm.msg';

    if (req.method === 'POST' || req.method === 'DELETE') {
      record
      .destroy()
      .then(function afterDestroy () {
        res.locals.deleted = true;
        res.deleted();
        return null;
      })
      .catch(res.queryError);
    } else {
      res.ok();
    }
  }
};