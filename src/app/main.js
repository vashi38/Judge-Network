import vis from 'vis';
import _ from 'underscore';
import angular from 'angular';

function mainController($http, getService, $scope) {
  let allData;
  const am = this;
  let network;

  let nodes = new vis.DataSet(
    [{
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
  let edges = new vis.DataSet([{
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
  let data = {
    nodes,
    edges
  };
  const options = {
    physics: {
      stabilization: false
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
  const createDataPack = (name, list) => {
    let counter = 1;
    let temp_node = [];
    temp_node = list.map(item => {
      return {
        id: counter++,
        label: item.data
      };
    });
    temp_node.push({
      id: 0,
      label: name,
      color: '#edff00'
    });
    console.log(temp_node);
    nodes = new vis.DataSet(temp_node);
    let temp_edge = [];
    counter = 1;
    temp_edge = list.map(item => {
      if (item.label !== '') {
        return {
          from: 0,
          to: counter++,
          width: 2 * item.count,
          length: 30 * Math.ceil(item.disposalDuration),
          smooth: false,
          title: item.label
        };
      }
    });
    edges = new vis.DataSet(temp_edge);
    data = {
      nodes,
      edges
    };
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
    createDataPack(am.judgeName, uniqLowyerList);
    drawNetwork();
  };

  const drawNetwork = () => {
    const container = document.getElementById('mynetwork');
    network = new vis.Network(container, data, options);
    network.redraw();
  };
  am.selectcb = val => {
    console.log(val);
    if (am.judgeName !== val && am.judgeName !== '') {
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
