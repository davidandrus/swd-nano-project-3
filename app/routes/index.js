import Ember from 'ember';

export default Ember.Route.extend({
  api: Ember.inject.service(),
  queryParams: {
    keyword: {
      replace: true,
      refreshModel: true,
    },
    location: {
      replace: true,
      refreshModel: true,
    },
  },
  actions: {
    search() {
      this.transitionTo('index', {
        queryParams: {
          keyword: this.controller.get('model.keyword'),
          location: this.controller.get('model.location'),
        },
      });
    }
  },

  // @TODO - form should probably be separate view, then can make
  // results own view with separate model and loading state
  setupController(controller, model, transition) {
    controller.set('model', model);
    controller.set('model.keyword', transition.queryParams.keyword);
    controller.set('model.location', transition.queryParams.location);
  },

  beforeModel() {
    console.log('beforeModel');
  },

  model({ keyword, location }) {
    console.log('model');
    return this.get('api').makePlaceSearch({
      keyword: keyword,
      location: location,
    }).then(results => ({
      data: results
    }))
  }
});
