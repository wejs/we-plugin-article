App.ArticleFormController = Ember.ObjectController.extend( App.ImageSelectorMixin, {
  isSaving: false,

  breadCrumb: 'create',

  /**
   * Helper function to get model
   */
  getModel: function() {
    if ( this.get('record.content') ) {
      return this.get('record.content');
    } else {
      return this.get('record');
    }
  },

  headerImage: function() {
    if (this.get('selectedPreviewImage')) {
      return this.bgStyle(this.get('selectedPreviewImage'));
    }
    var image = this.get('record.featuredImage');
    if(image && image.get('urls')) {
      return this.bgStyle( image.get('urls').original )
    }
    return this.bgStyle();
  }.property('record.featuredImage.urls', 'selectedPreviewImage'),

  bgStyle: function(url) {
    if(!url) url = this.get('defaultHeaderImage');
    return 'background-image: url("'+ url +'");';
  },

  defaultHeaderImage: function() {
    if (App.get('configs.client.publicVars.showDefaultArticleImage')) {
      url = App.get('configs.client.publicVars.blogArticlesBg');  
    } else {
      return '';
    }
  }.property('App.configs.client.publicVars.blogArticlesBg'),

  actions: {
    saveRecord: function() {
      var self = this;
      var record = this.getModel();
      var featuredImage = this.get('imageToSave');

      this.set('isSaving', true);

      this.send('saveImage', featuredImage, function(err, salvedImage) {
        if (featuredImage && salvedImage) {
          record.set('featuredImage', salvedImage);
        }

        record.save().then(function(r) {
          self.set('isSaving', false);
          self.transitionToRoute('article', r.id);
        })
      });
    },

    saveAndPublishRecord: function() {

    },

    cancel: function() {
      var record = this.get('record');

      if (record.id) {
        record.rollback();
        this.transitionToRoute('article', record.id);
      } else {
        this.transitionToRoute('articles');
      }
    }
  }
});
