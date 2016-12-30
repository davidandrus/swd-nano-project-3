import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('detail', { path: 'detail/:id'}, function() {
    this.route('photos', { path: 'photos/:photo_index'});
  });

  this.route('index', { path: '/' }, function() {
    this.route('list', { path: '/' });
  });
});

export default Router;
