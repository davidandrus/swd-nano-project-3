import Ember from 'ember';
import injectScript from 'ember-inject-script';
import ENV from 'swd-nano-project-3/config/environment';

const { gmaps: API_KEY } = ENV.apiKeys;
const scriptUrl = `//maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places,geometry`;

let serviceResolve;
let serviceReject;

const serviceReady = new Ember.RSVP.Promise((resolve, reject) => {
  serviceResolve = resolve;
  serviceReject = reject;
});

const getCommonFields = (record) => ({
  ...record.getProperties('icon', 'name', 'rating', 'price_level'),
  lat: record.get('geometry.location').lat(),
  lng: record.get('geometry.location').lng(),
  open: record.get('opening_hours.open_now'),
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

  getPlaceDetails(id) {

    return serviceReady.then(() => {

      const request = {
        placeId: id,
      };

      return new Ember.RSVP.Promise((resolve, reject) => {
        const callback = (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            const record = new Ember.Object(results);

            const updatedRecord = {
              ...getCommonFields(record),
              schedule: record.get('opening_hours.weekday_text'),
              phone: record.get('formatted_phone_number'),
              phone_intl: record.get('international_phone_number'),
              photos: (record.get('photos') || []).map(item => {
                const photo = new Ember.Object(item);

                const thumbnailUrl = item.getUrl({
                  maxHeight: 100,
                  maxWidth: 100,
                });

                return {
                  getUrl: photo.get('getUrl'),
                  thumb: thumbnailUrl,
                  attribution: photo.get('html_attributions'),
                }
              }),
              reviews: (record.get('reviews') || []).map(item => {
                const review = new Ember.Object(item);
                return {
                  author: review.get('author_name'),
                  avatar: review.get('profile_photo_url'),
                  rating: review.get('rating'),
                  date: review.get('relative_time_description'),
                  review: review.get('text') ,
                }
              }),
              website: record.get('website'),
              address: record.get('adr_address'),
            };


            resolve(JSON.parse(JSON.stringify(updatedRecord)));
          } else {
            reject(status);
          }
        };

        console.log('making call');
        this.get('service').getDetails(request, callback);
      });

    });
  },

  makePlaceSearch({ keyword, location }) {

    return serviceReady.then(() => {

      var pyrmont = new google.maps.LatLng(-33.8665433,151.1956316);

      const request =  {
        location: pyrmont,
        types: ['restaurant'],
        language: 'en',
        // keyword: 'sushi',
        // radius: 500, // only for when rankby prominence
        rankBy: google.maps.places.RankBy.DISTANCE,
      };


      return new Ember.RSVP.Promise((resolve, reject) => {
        const callback = (results, status, pagination) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            console.log('getting places results', results);
            const updatedResults = results.map(result => {
              const record = new Ember.Object(result);
              const commonFields = getCommonFields(record);
              const photos = record.get('photos');
              const firstPhoto = photos ? photos[0] : undefined;
              const firstPhotoUrl = firstPhoto ?
                firstPhoto.getUrl({
                  maxWidth: 64,
                  maxHeight: 64,
                }) :
                undefined;

              const distance = google.maps.geometry.spherical.computeDistanceBetween(pyrmont, result.geometry.location);
              const distanceInMi = 0.000621371 * distance;

              console.log(pagination.hasNextPage);

              return {
                ...commonFields,
                ...record.getProperties('place_id', 'vicinity', 'types'),
                distance: `${distanceInMi.toFixed(2)} miles away`,
                photo: {
                  src: firstPhotoUrl,
                  attributions: firstPhoto ? firstPhoto.html_attributions : undefined,
                }
              };
            });

            setTimeout(() => {
              alert('should delay');
              resolve(updatedResults);
            }, 3000);
          } else {
            reject(status);
          }
        };

        this.get('service').nearbySearch(request, callback);
      });

    });
  }
});
