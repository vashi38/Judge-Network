import angular from 'angular';

import {techsModule} from './app/techs/index';
import 'angular-ui-router';
import routesConfig from './routes';
import getService from './services/getData';

import {main} from './app/main';
import {header} from './app/header';
import {title} from './app/title';
import {footer} from './app/footer';

import './index.css';
import '../node_modules/vis/dist/vis.css';

angular
  .module('app', [techsModule, 'ui.router'])
  .config(routesConfig)
  .factory('getService', getService)
  .component('app', main)
  .component('fountainHeader', header)
  .component('fountainTitle', title)
  .component('fountainFooter', footer);
