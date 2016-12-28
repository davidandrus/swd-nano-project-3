import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['price'],
  didReceiveAttrs() {
    this._super(...arguments);
    const price = this.get('price');
    if (price) {
      this.set('price_level', Array(price));
    }
  }
});
