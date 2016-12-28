import Ember from 'ember';

export default Ember.Route.extend({
  api: Ember.inject.service(),
  activate() {
    window.scrollTo(0,0);
  },
  model(params) {
    return this.get('api').getPlaceDetails(params.id);
  }
});
