import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    const photos = Ember.get(this.modelFor('detail'), 'photos');
    const index = Number(params['photo_index']);

    return {
      nextIndex: index === photos.length - 1 ? 0 : index + 1,
      prevIndex: index === 0 ? photos.length - 1 : index - 1,
      photo: photos[index],
      thumbs: photos,
    }
  }
});
