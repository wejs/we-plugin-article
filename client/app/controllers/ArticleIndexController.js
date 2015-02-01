App.ArticleIndexController = Ember.ObjectController.extend({
  breadCrumb: function() {
    return this.get('record.id');
  }.property('record.id'),

  blogBgImageStyle: function () {
    var image = this.get('record.featuredImage');
    var url;

    if (image && image.get('urls')) {
      url = image.get('urls').original;
    } else {
      url = App.get('configs.client.publicVars.blogArticlesBg');
    }

    return 'background-image: url("' + url + '")';
  }.property('App.configs.client.publicVars.blogArticlesBg', 'record.featuredImage.urls')
});