import Ember from 'ember';

export default Ember.Route.extend({
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
      const currentRouteName = this.controllerFor('application').get('currentRouteName');
      this.transitionTo(currentRouteName, {
        queryParams: {
          keyword: this.controller.get('model.keyword'),
          location: this.controller.get('model.location'),
        },
      });
    }
  },
  model({ keyword, location }) {
    return {
      keyword,
      location,
    };
  }
});
