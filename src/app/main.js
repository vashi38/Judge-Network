import vis from 'vis';
import _ from 'underscore';
import angular from 'angular';

function mainController($http, getService, $scope) {
  let allData;
  const am = this;
  let network;
  
  const nodes = new vis.DataSet([{
    id: 1,
    label: 'Node 1'
  },
  {
    id: 2,
    label: 'Node 2'
  },
  {
    id: 3,
    label: 'Node 3'
  },
  {
    id: 4,
    label: 'Node 4'
  },
  {
    id: 5,
    label: 'Node 5'
  }
  ]);
  // create an array with edges
  const edges = new vis.DataSet([{
    from: 1,
    to: 3,
    width: 16,
    length: 80 * 1,
    smooth: false,
    title: '1st'
  },
  {
    from: 1,
    to: 2,
    length: 80 * 2,
    smooth: false,
    title: '2st'
  },
  {
    from: 1,
    to: 4,
    length: 80 * 3,
    smooth: false,
    title: '3st'
  },
  {
    from: 1,
    to: 5,
    length: 80 * 4,
    smooth: false,
    title: '4st'
  }
  ]);
  // provide the data in the vis format
  const data = {
    nodes,
    edges
  };
  const options = {
    layout: {
      hierarchical: true
    }
  };
  const listJudge = list => {
    return _.uniq(list.map(item => {
      if (item.judge != '') {
        return item.judge;
      }
    }));
  };
  const listLowyer = list => {
    return [].concat(...list.map(item => {
      return item.lawyer;
    }));
  };
  const filterJudge = (list, judgeName) => {
    return list.filter(item => {
      if (item.judge === judgeName) {
        return item;
      }
    });
  };
  const getUniqLowyerList = (allList, list) => {
    const uniqList = _.uniq(list);
    return uniqList.map(item => {
      return {
        data: item,
        count: 0,
        disposalDuration: 0
      };
    }).map(item => {
      allList.forEach(element => {
        element.lawyer.forEach(ele => {
          if (item.data === ele) {
            item.disposalDuration += element.disposalDuration;
            item.count++;
          }
        });
      });
      return item;
    });
  };
  const convertFor = name => {
    const allList = allData;
    am.judgeName = name;
    const listForJudge = filterJudge(allList, am.judgeName);
    const listLawyer = listLowyer(listForJudge);
    const uniqLowyerList = getUniqLowyerList(listForJudge, listLawyer);
    console.log(listForJudge);
    console.log(listLawyer);
    console.log(uniqLowyerList);
    drawNetwork();
  };
  // am.selectCb = val => {
  //   console.log(val);
  // };
  // $scope. $watch(am.judgeName, (newValue, oldValue) => {
  //   console.log(newValue);
  // });

  const drawNetwork = () => {
    const container = document.getElementById('mynetwork');
    network = new vis.Network(container, data, options);
    network.redraw();
  };
  am.selectcb = val => {
    console.log(val);
    if (am.judgeName !== val) {
      convertFor(val);
    }
  };
  // initialize your network!
  const init = function () {
    getService.getData().then(result => {
      allData = result;
      am.judgeList = listJudge(allData);
      convertFor('S/sh.rajendra');
      console.log(am.judgeList);
    });
  };
  init();
  // setTimeout(init, 100);
}

export const main = {
  template: require('./main.html'),
  controller: mainController
};
