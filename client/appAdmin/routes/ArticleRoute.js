// StructureRoutes

App.Router.map(function() {

  this.resource('articles',{ path: '/article'}, function() {
    this.route('create', { path: '/create' } );

    this.resource('article',{path: '/:id'}, function() {
      this.route('edit', { path: '/edit' } );
    });
  });
});

App.ArticlesIndexRoute = Ember.Route.extend({
  model: function () {
    return {
      attributes: Ember.get('App.Article.attributes').keys.list,
      records: this.get('store').find('article')
    };
  }
});

App.ArticlesCreateRoute = Ember.Route.extend({
  model: function () {
    return {
      record: this.get('store').createRecord('article', {})
    };
  },
  deactivate: function onDeactivate() {
    this.currentModel.record.deleteRecord();
  }
});
