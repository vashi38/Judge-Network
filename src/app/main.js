import vis from 'vis';
import _ from 'underscore';
// import angular from 'angular';

function mainController($http, getService) {
  let allData;
  const am = this;
  let network;
  let nodes;
  let edges;
  let data;
  let container;
  const options = {
    physics: {
      stabilization: false
    }
  };
  am.fineDraw = () => {
    network = new vis.Network(container, data, options);
    network.redraw();
  };
  const listJudge = list => {
    return _.uniq(list.map(item => {
      if (item.judge !== '') {
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
    }).filter(item => {
      if (item.data !== null && item.data !== '') {
        return item;
      }
    });
  };
  const createDataPack = (name, list) => {
    let counter = 1;
    let tempNode = [];
    tempNode = list.map(item => {
      if (item.data !== '') {
        return {
          id: counter++,
          label: item.data
        };
      }
    });
    tempNode.push({
      id: 0,
      label: name,
      color: '#edff00'
    });
    console.log(tempNode);
    nodes = new vis.DataSet(tempNode);
    let tempEdge = [];
    counter = 1;
    tempEdge = list.map(item => {
      if (item.label !== '' && item.label !== null) {
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
    edges = new vis.DataSet(tempEdge);
    data = {
      nodes,
      edges
    };
  };
  const drawNetwork = () => {
    container = document.getElementById('mynetwork');
    network = new vis.Network(container, data, options);
    network.redraw();
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
