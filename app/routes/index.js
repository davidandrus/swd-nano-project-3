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
    // useCurrentPosition() {
    //   const that = this;
    //   this.get('geolocation').getCurrentLocation().then(() => {
    //     that.controller.set('model.location', 'Current Location');
    //     that.controller.set('model.usingCurrentLocation', true);
    //     console.timeEnd('geo');
    //   });
    // },
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
      this.transitionTo(currentRouteName, {
        queryParams: {
          keyword: this.controller.get('model.keyword'),
          lat_lng: this.controller.get('model.lat_lng'),
          place_id: this.controller.get('model.place_id'),
          place_name: this.controller.get('model.place_name'),
        },
      });
      this.refresh();
    }
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
