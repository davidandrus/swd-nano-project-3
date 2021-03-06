import Ember from 'ember';

export default Ember.Route.extend({
  api: Ember.inject.service(),
  geolocation: Ember.inject.service(),
  queryParams: {
    keyword: {
      replace: true,
    },
    lat_lng: {
      replace: true,
    },
    place_id: {
      replace:true,
    },
    place_name: {
      replace:true,
    }
  },
  actions: {
    useCurrentPosition() {
      const that = this;
      this.controller.set('model.gettingCurrentLocation', true);
      this.get('geolocation').getCurrentLocation().then(() => {
        that.controller.set('model.place_name', 'Current Location');
        that.controller.set('model.usingCurrentLocation', true);
        this.controller.set('model.gettingCurrentLocation', false);
      });
    },
    placeChanged({
      geometry: {
        location
      },
      place_id,
      place_name,
    }) {
      this.controller.set('model.lat_lng', `${location.lat()},${location.lng()}`);
      this.controller.set('model.place_id', place_id);
      this.controller.set('model.place_name', place_name);
    },
    search() {
      const currentRouteName = this.controllerFor('application').get('currentRouteName');
      const keyword = this.controller.get('model.keyword');
      const lat_lng = this.controller.get('model.lat_lng');
      const place_id = this.controller.get('model.place_id');
      const place_name = this.controller.get('model.place_name');

      this.transitionTo(currentRouteName, {
        queryParams: {
          ...keyword && { keyword },
          ...lat_lng && { lat_lng },
          ...place_id && { place_id },
          ...place_name && { place_name },
        },
      });
      this.refresh();
    }
  },
  setupController(controller, model) {
    controller.set('model', model);
    controller.set('model.isDisabled', false);
  },
  beforeModel() {
    return this.get('api').serviceReady;

  },
  model({ keyword, lat_lng, place_id, place_name }) {
    return {
      keyword,
      lat_lng,
      place_id,
      place_name,
    };
  },
});
