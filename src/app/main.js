import vis from 'vis';
import _ from 'underscore';
// import angular from 'angular';

// mainController is the controller function for the component main

function mainController($http, getService, $window) {
  let allData;
  const am = this;
  let network;
  let nodes;
  let edges;
  let data;
  let container;

  const options = {
    physics: {
      hierarchicalRepulsion: {
        centralGravity: 0
      },
      maxVelocity: 88,
      minVelocity: 0.75,
      solver: 'hierarchicalRepulsion',
      timestep: 0.6
    }
  };
  // function fineDraw is used to redraw the network
  am.fineDraw = () => {
    network = new vis.Network(container, data, options);
    network.redraw();
  };

  // function list judge is used to extract the name of judges from list

  const listJudge = list => {
    return _.uniq(list.map(item => {
      if (item.judge !== '') {
        return item.judge;
      }
    }));
  };

  // function listLowyer is used to list the lawyers from list

  const listLowyer = list => {
    return [].concat(...list.map(item => {
      return item.lawyer;
    }));
  };

  // function filterJudge is used to exttract the data for given judgeName from list

  const filterJudge = (list, judgeName) => {
    return list.filter(item => {
      if (item.judge === judgeName) {
        return item;
      }
    });
  };

  // function getUniqLowyerList is used to ge the list of unique lawyers from list

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
      if (item.data !== null && item.data !== '' && item.data !== 'None') {
        return item;
      }
    });
  };

  // function crateDatapack is used to create the datapack for the network

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
    // console.log(tempNode);
    nodes = new vis.DataSet(tempNode);
    let tempEdge = [];
    counter = 1;
    // console.log(list);
    tempEdge = list.map(item => {
      if (item.label !== '' && item.label !== null) {
        return {
          from: 0,
          to: counter++,
          width: 2 * item.count,
          length: 30 * Math.ceil(item.disposalDuration),
          smooth: false,
          title: item.data
        };
      }
    });
    edges = new vis.DataSet(tempEdge);
    data = {
      nodes,
      edges
    };
  };

  // function drawNetwork is used to draw the network when we change the judge name

  const drawNetwork = () => {
    container = document.getElementById('mynetwork');
    network = new vis.Network(container, data, options);
    network.redraw();
  };

  // function convertFor is used to convert the data received from service in required format

  const convertFor = name => {
    const allList = allData;
    am.judgeName = name;
    const listForJudge = filterJudge(allList, am.judgeName);
    const listLawyer = listLowyer(listForJudge);
    const uniqLowyerList = getUniqLowyerList(listForJudge, listLawyer);
    // console.log(listForJudge);
    // console.log(listLawyer);
    // console.log(uniqLowyerList);
    createDataPack(am.judgeName, uniqLowyerList);
    drawNetwork();
  };

  // Function selectcb is call back function.This function is used by the child component autocomplete whenever we select the new judge

  am.selectcb = val => {
    // console.log(val);
    if (am.judgeName !== val && am.judgeName !== '') {
      const judgeAvailable = allData.filter(item => {
        if (item.judge === val) {
          return item;
        }
      }).length;
      // console.log(judgeAvailable);
      if (judgeAvailable === 0) {
        $window.alert('No Data found for Judge Name: ' + val);
        am.showNetwork = false;
      }      else {
        convertFor(val);
        am.showNetwork = true;
      }
    }
  };

  // initialize your component

  const init = function () {
    am.showNetwork = false;
    getService.getData().then(result => {
      allData = result;
      am.judgeList = listJudge(allData);
      convertFor('S/sh.rajendra');
      // console.log(am.judgeList);
    });
  };

  init();
  // setTimeout(init, 100);
  am.showNetwork = false;
}

export const main = {
  template: require('./main.html'),
  controller: mainController
};
