import Ember from 'ember';

function getStarsArrFromRating(rating) {
  if (! rating) { return []; }
  const stars = [];
  let i = 1;
  while(i <= 5) {
    if (rating > i - .25) {
      stars.push('full');
    } else if (rating > i - .75) {
      stars.push('half');
    } else {
      stars.push('empty');
    }
    i++;
  }
  return stars;
}

export default Ember.Component.extend({
  classNames: ['stars'],

  didReceiveAttrs() {
    this._super(...arguments);
    const ratingsArr = getStarsArrFromRating(this.get('rating'));
    this.set('stars', ratingsArr);
  }
});
