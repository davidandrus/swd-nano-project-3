import Ember from 'ember';

export default Ember.Route.extend({
  api: Ember.inject.service(),
  model() {
    const call = this.get('api').makePlaceSearch(this.modelFor('index'));
    return call.then(result => ({
      data: result,
      location: this.modelFor('index').place_name,
      keyword: this.modelFor('index').keyword,
    }));
  }
});
