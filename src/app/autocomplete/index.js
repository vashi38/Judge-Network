import angular from 'angular';

import {autocomplete} from './autocomplete';

export const autoCompleteModule = 'autoCompleteModule';

angular
  .module(autoCompleteModule, [])
  .component('autoComplete', autocomplete);
