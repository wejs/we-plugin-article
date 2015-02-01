App.ArticlesIndexController = Ember.ObjectController.extend({
  breadCrumb: function() {
    return this.get('record.id');
  }.property('record.id'),

  blogBgImageStyle: function () {
    var url = App.get('configs.client.publicVars.blogArticlesBg');
    return 'background-image: url("' + url + '")';
  }.property('App.configs.client.publicVars.blogArticlesBg')

});