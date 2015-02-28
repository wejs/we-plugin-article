// StructureRoutes

App.Router.map(function() {
  this.resource('articles',{ path: '/article'}, function() {
    this.route('create', { path: '/create' } );

    this.resource('article',{path: '/:id'}, function() {
      this.route('edit', { path: '/edit' } );
    });
  });
});

App.ArticlesIndexRoute = Ember.Route.extend(App.ResetScrollMixin, {

  queryParams: {
    q: { refreshModel: true },
    category: { refreshModel: true },
    sort: { refreshModel: true },
    skip: { refreshModel: true },
    limit: { refreshModel: true }
  },

  model: function (params) {
    var query = this.buildQuery(params);

    return {
      attributes: Ember.get('App.Article.attributes').keys.list,
      records: this.store.find('article', query)
    };
  },

  buildQuery: function(params) {
    var query = {};

    query.q = params.q;
    if (params.category && params.category != 'undefined') {
      query.category = params.category;
    }
    //query.skip = (Number(params.currentPage) -1 )* Number(params.limit) ;
    query.skip = params.skip;
    query.limit = params.limit;
    query.sort = params.sort;

    return query;
  }
});

App.ArticlesCreateRoute = Ember.Route.extend(App.ResetScrollMixin, App.AuthenticatedRouteMixin, {
  model: function () {
    var record = this.get('store').createRecord('article', {});
    var creator = App.get('currentUser');

    // set the creator
    if ( creator.id ) {
      record.set('creator', creator);
    }

    return {
      record: record
    };
  },
  deactivate: function onDeactivate() {
    this.currentModel.record.deleteRecord();
  }
});

App.ArticleRoute = Ember.Route.extend(App.ResetScrollMixin, {
  model: function (params) {
    return Ember.RSVP.hash({
      record: this.get('store').find('article', params.id)
    });
  }
});

App.ArticleEditRoute = Ember.Route.extend(App.ResetScrollMixin, App.AuthenticatedRouteMixin, {
  model: function (params) {
    return Ember.RSVP.hash({
      record: this.modelFor('article').record
    });
  }
});
