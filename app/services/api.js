import Ember from 'ember';
import injectScript from 'ember-inject-script';
import ENV from 'swd-nano-project-3/config/environment';

const { gmaps: API_KEY } = ENV.apiKeys;
const scriptUrl = `//maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;

let serviceResolve;
let serviceReject;

const serviceReady = new Ember.RSVP.Promise((resolve, reject) => {
  serviceResolve = resolve;
  serviceReject = reject;
});

export default Ember.Service.extend({
  init() {
    this._super(...arguments);
    injectScript(scriptUrl)
      .then(() => {
        const div = document.createElement('div');
        this.set('service', new google.maps.places.PlacesService(div));
      })
      .then(serviceResolve);
  },

  service: null,

  makePlaceSearch() {
    return serviceReady.then(() => {

      var pyrmont = new google.maps.LatLng(-33.8665433,151.1956316);

      const request =  {
        location: pyrmont,
        radius: '500',
        types: ['store']
      };

      return new Ember.RSVP.Promise((resolve, reject) => {
        const callback = (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            console.log('resolved', results);
            resolve(results);
          } else {
            reject(status);
          }
        };

        this.get('service').nearbySearch(request, callback);
      });

    });
  }
});
