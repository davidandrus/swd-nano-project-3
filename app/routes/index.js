import Ember from 'ember';

export default Ember.Route.extend({
  init() {
    this.notifyPropertyChange
  },
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
    // useCurrentPosition() {
    //   const that = this;
    //   this.get('geolocation').getCurrentLocation().then(() => {
    //     that.controller.set('model.location', 'Current Location');
    //     that.controller.set('model.usingCurrentLocation', true);
    //     console.timeEnd('geo');
    //   });
    // },
    notifyPropertyChange() {
      console.log('property changed yo');
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
    this._super(controller, model);
    console.log(controller, model);
    // put the custom setup here
  },
  model({ keyword, lat_lng, place_id, place_name }) {
    return this.get('api').serviceReady.then(() => {
      return Ember.RSVP.Promise.resolve({
        keyword,
        lat_lng,
        place_id,
        place_name,
      })
    });
  }
});
