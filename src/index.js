import angular from 'angular';

import {autoCompleteModule} from './app/autocomplete/index';
import 'angular-ui-router';
import routesConfig from './routes';
import getService from './services/getData';

import {main} from './app/main';
import {footer} from './app/footer';

import './index.css';
import '../node_modules/vis/dist/vis.css';
import './app/autocomplete/autocomplete.css';

angular
  .module('app', [autoCompleteModule, 'ui.router'])
  .config(routesConfig)
  .factory('getService', getService)
  .component('app', main)
  .component('fountainFooter', footer);
