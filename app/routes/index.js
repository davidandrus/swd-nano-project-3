import Ember from 'ember';

export default Ember.Route.extend({
  api: Ember.inject.service(),
  geolocation: Ember.inject.service(),
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
    useCurrentPosition() {
      const that = this;
      this.get('geolocation').getCurrentLocation().then(() => {
        that.controller.set('model.location', 'Current Location');
        that.controller.set('model.usingCurrentLocation', true);
        console.timeEnd('geo');
      });
    },
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
    return this.get('api').serviceReady.then(() => {
      return Ember.RSVP.Promise.resolve({
        keyword,
        location,
        usingCurrentLocation: false,
      })
    });
  }
});
