const ctx = document.getElementById('myChart');
let mychart;

var speed = [], time = [];
var current = "";
var on_off = "";

db.ref('on_off').on('value', (data) => {//取得目前車輛狀態，供GeoJson資料Ref使用。
  current = data.val().current;
  if (data.val()[current].search(",") == 26) {
    on_off = false;
  } else {
    on_off = true;
  }
  document.getElementById('line').value = current;
  getcargeojson();

});


function getcargeojson(num = -1) {
  if (num == -1) {
    db.ref('CarGeoJson/_' + current).once('value', (data) => {//將GeoJson資料dowmload
      speed = [], time = [];
      time = data.val().features[0].properties.times;
      speed = data.val().features[0].properties.speed;
      init(time, 'speed', speed);

      addDataset('battery', data.val().features[0].properties.battery, 'rgb(0, 153, 51)', 'rgb(0, 230, 77)', 'y1');
    });
  } else {

    db.ref('CarGeoJson/_' + num).once('value', (data) => {//將num的GeoJson資料dowmload
      clearChart();

      speed = [], time = [];
      time = data.val().features[0].properties.times;
      speed = data.val().features[0].properties.speed;
      init(time, 'speed', speed);

      addDataset('battery', data.val().features[0].properties.battery, 'rgb(0, 153, 51)', 'rgb(0, 230, 77)', 'y1');
    });

  }

}






function init(xlabel = [], dsName = '', value = []) {

  if (dsName != '') {

    initdataset = {
      type: 'line',
      data: {
        labels: xlabel,
        datasets: [
          {
            label: dsName,
            data: value
          }
        ]
      },
      options: {
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Time',
              color: '#000066',
              font: {
                family: 'Comic Sans MS',
                size: 20,
                weight: 'bold',
                lineHeight: 1.2,
              },
              padding: { top: 20, left: 0, right: 0, bottom: 0 }
            }
          },
          y: {
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'Km/hr',
              color: '#000066',
              font: {
                family: 'Comic Sans MS',
                size: 20,
                style: 'normal',
                lineHeight: 1.2
              },
              padding: { top: 30, left: 0, right: 0, bottom: 0 }
            }
          },

          y1: {
            display: true,
            position: 'right',
            max: 100,
            min: 0,
            title: {
              display: true,
              text: '%',
              color: '#000066',
              font: {
                family: 'Comic Sans MS',
                size: 20,
                style: 'normal',
                lineHeight: 1.2
              },
              padding: { top: 30, left: 0, right: 0, bottom: 0 }
            }
          }

        },
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: xlabel[0] + '~' + xlabel[xlabel.length - 1],
          }
        }
      },
    };

    mychart = new Chart(ctx, initdataset);
    console.log('Success create chart');
    console.log(mychart.data);

  } else {//no pass data

    initdataset = {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: '',
            data: []
          }
        ]
      },
      options: {
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Time',
              color: '#000066',
              font: {
                family: 'Comic Sans MS',
                size: 20,
                weight: 'bold',
                lineHeight: 1.2,
              },
              padding: { top: 20, left: 0, right: 0, bottom: 0 }
            }
          },
          y: {
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'Km/hr',
              color: '#000066',
              font: {
                family: 'Comic Sans MS',
                size: 20,
                style: 'normal',
                lineHeight: 1.2
              },
              padding: { top: 30, left: 0, right: 0, bottom: 0 }
            }
          },

          y1: {
            display: true,
            position: 'right',
            max: 100,
            min: 0,
            title: {
              display: true,
              text: '%',
              color: '#000066',
              font: {
                family: 'Comic Sans MS',
                size: 20,
                style: 'normal',
                lineHeight: 1.2
              },
              padding: { top: 30, left: 0, right: 0, bottom: 0 }
            }
          }

        },
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'empty chart',
          }
        }

      },
    };

    mychart = new Chart(ctx, initdataset);
    console.log('create empty chart. please use addData/Dataset func to add Data');

  }

}







//---------------------------
function clearChart() {
  mychart.destroy();
}


function addData(xlabel, num) {
  const data = mychart.data;
  if (data.datasets.length > 0) {
    let label = data.labels;

    for (let index = 0; index < data.datasets.length; ++index) {
      data.datasets[index].data.push(num);
      console.log('data.datasets[index].data.push(num)', index, 'num:', num)
    }
    label.push(xlabel);

    mychart.update();
  }
}



function addDataset(dsName, value, dsColor, dsBgColor, yAxisID) {


  const newDataset = {
    label: dsName,
    backgroundColor: dsBgColor,
    borderColor: dsColor,
    data: value,
    yAxisID: yAxisID,
  };

  mychart.data.datasets.push(newDataset);
  mychart.update();

  console.log('addDataset:', mychart.data);

}



function removeData() {
  mychart.data.labels.splice(-1, 1); // remove the label first

  mychart.data.datasets.forEach(dataset => {
    dataset.data.pop();
  });

  mychart.update();
}

function removeDataset() {
  mychart.data.datasets.pop();

  mychart.update();
}