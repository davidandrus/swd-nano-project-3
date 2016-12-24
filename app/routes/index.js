import Ember from 'ember';

export default Ember.Route.extend({
  api: Ember.inject.service(),
  model() {
    this.get('api').makePlaceSearch();
  }
});
