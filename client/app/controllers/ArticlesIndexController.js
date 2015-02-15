App.ArticlesIndexController = Ember.ObjectController.extend({
  queryParams: ['q', 'category', 'sort', 'skip', 'limit'],
  // pagination
  limit: 7,
  // max paginator items to display
  maxPagesToDisplay: 10,  
  skip: 0,
  category: null,
  q: null,
  searchString: Ember.computed.oneWay('q'),

  selectedCategory: Ember.computed.alias('category'),
  searchString: Ember.computed.oneWay('q'),

  sort: 'createdAt DESC',
  orderSelected: Ember.computed.oneWay('sort'),

  listAnchor: 'anchor-articles-list',

  currentPage: function() {
  	if (!this.get('skip') ) { return 1; }
  	return (this.get('skip') / Number(this.get('limit') ) ) +1;
  }.property('skip', 'limit'),

  breadCrumb: function() {
    return this.get('record.id');
  }.property('record.id'),

  blogBgImageStyle: function () {
    var url = App.get('configs.client.publicVars.blogArticlesBg');
    return 'background-image: url("' + url + '")';
  }.property('App.configs.client.publicVars.blogArticlesBg'),

  init: function() {
    this._super();
    this.updatePagerMetadata();
  },

	updatePagerMetadata: function() {
		this.set('totalPages', Math.ceil( this.get('count') / this.get('limit')))
	}.observes('count'),

  count: function() {
    var meta = this.store.metadataFor('article');
    if (meta && meta.count) return meta.count;
    return 0;
  }.property('model.@each', 'model.records.isFulfilled'), 

  actions: {
    goToList: function() {
      if (!$('#' + this.get('listAnchor')).offset()) return;
      $('html, body').animate({
        scrollTop: $('#' + this.get('listAnchor')).offset().top
      }, 1000);
    },  	
    pagerChangePage: function(page) {
      this.set('skip', (page -1 ) * this.get('limit'));
      this.send('goToList');
    },
    pagerStepForward: function() {
      this.incrementProperty('skip', this.get('limit') );
      this.send('goToList');
    },
    pagerStepBackward: function() {
      this.decrementProperty('skip', this.get('limit'));
      this.send('goToList');
    }  	
  }
});