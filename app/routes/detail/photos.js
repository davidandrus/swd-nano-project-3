import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    const photos = Ember.get(this.modelFor('detail'), 'photos');

    return {
      photo: photos[params['photo_index']],
      thumbs: photos,
    }
  }
});
