import Ember from 'ember';

alert('sucka');

export default Ember.Route.extend({
  api: Ember.inject.service(),
  model() {
    return this.get('api').makePlaceSearch();
  }
});
