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
  model: function () {
    return {
      attributes: Ember.get('App.Article.attributes').keys.list,
      records: this.get('store').find('article')
    };
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
    return {
      record: this.get('store').find('article', params.id)
    };
  }
});

App.ArticleEditRoute = Ember.Route.extend(App.ResetScrollMixin, App.AuthenticatedRouteMixin, {
  model: function (params) {
    return {
      record: this.modelFor('article').record
    };
  }
});
