/** @ngInject */
function searchController($timeout) {
  const am = this;
  am.globalSearch = '';
  am.pointer = -1;
  am.temp = '';
  // am.options = am.obj;
  am.optselected = '';

  am.selected = false;
  // function focusLost is used whenever event focuslost happens on the input text box
  am.focusLost = function () {
    $timeout(() => {
      am.selected = true;
      am.selectOption(am.globalSearch);
    }, 1000);
  };
// Function updateTemp is used to update the temperary selected judge name
  am.updateTemp = function (event) {
    am.selected = false;
    if (event.which === 13) {
      am.selectOption(am.globalSearch);
    } else if (event.which === 38) {
      am.pointer <= 0 ? am.pointer = Math.min(3, am.filtered.length) : am.pointer -= 1;
      am.globalSearch = am.filtered[am.pointer];
    } else if (event.which === 40) {
      am.pointer === Math.min(3, am.filtered.length) ? am.pointer = 0 : am.pointer += 1;
      am.globalSearch = am.filtered[am.pointer];
    //   console.log(am.filtered.length);
    } else {
      am.temp = am.globalSearch;
      am.pointer = -1;
    }
  };

  // function selectOption is used to store the selected judge name
  am.selectOption = function (opt) {
    am.globalSearch = opt;
    am.selected = true;
    am.optselected = opt;
    am.temp = opt;
    am.pointer = -1;
    am.onselectcb(opt);
    const activeElement = document.activeElement;
    if (activeElement) {
      activeElement.blur();
    }
  };
}

export const autocomplete = {
  template: require('./index.html'),
  controller: searchController,
  bindings: {
    options: '<',
    optselected: '=',
    onselectcb: '<'
  }
};
