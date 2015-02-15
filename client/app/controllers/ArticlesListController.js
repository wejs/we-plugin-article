App.ArticlesListController = Ember.ArrayController.extend({
  // itemController: 'article',

  sortProperties: ['createdAt'],
  sortAscending: false,

  order: null,

  orderChange: function reOrderObserver(){
    var order = this.get('parentController.order');
    if (this.get('order') == order) return;
    Ember.run.once(this, 'reOrder');
  }.observes('parentController.order')



});