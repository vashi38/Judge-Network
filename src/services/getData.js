/** @ngInject */
function getService($http) {
  function getData() {
    return $http({
      method: 'GET',
      url: '../backend/output.json' // json for 800 words
    }).then(response => {
    //   console.log(response.data);
      let data = response.data;
      data = data.map(item =>  {
        return {
          field: item.field,
          judge: item.judge,
          lawyer: item.lawyer,
          dateOfFilling: item.date_of_filling,
          dateOfOrder: item.date_of_order,
          disposalDuration: item.disposal_duration
        };
      });
      return data;
    });
  }
  return {
    getData
  };
}
module.exports = getService;
