import Ember from 'ember';

export default Ember.Route.extend({
  api: Ember.inject.service(),
  model() {
    console.log(this.modelFor('index'));
    return this.get('api').makePlaceSearch(this.modelFor('index'));
  }
});
