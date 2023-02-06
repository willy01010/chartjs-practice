const ctx = document.getElementById('myChart');


let t = '';

const data = [
  // { year: 2010, count: 10 },
  // { year: 2011, count: 20 },
  // { year: 2012, count: 15 },
  // { year: 2013, count: 25 },
];




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

var speed = [], time = [];
function getcargeojson(num = -1) {
  if (num == -1) {
    db.ref('CarGeoJson/_' + current).on('value', (data) => {//將GeoJson資料dowmload
      // craline.setMap(null);
      speed = [], time = [];
      time = data.val().features[0].properties.times;
      speed = data.val().features[0].properties.speed;

      for (var i = 0; i < time.length; i++) {
        addBigData(time[i], speed[i]);
      }

      cc.update();


      addDataset('battery', data.val().features[0].properties.battery, 'rgb(255, 99, 132)', 'rgb(255, 153, 153)','y1');
    });
  } 

}






t = {
  type: 'line',
  data: {
    labels: '',
    datasets: [
      {
        label: 'speed',
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
          color: '#911',
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
          color: '#191',
          font: {
            family: 'Times',
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
        max:100,
        min:0,
        title: {
          display: true,
          text: '%',
          color: '#191',
          font: {
            family: 'Times',
            size: 20,
            style: 'normal',
            lineHeight: 1.2
          },
          padding: { top: 30, left: 0, right: 0, bottom: 0 }
        }
      }

    }

  },
};

let cc = new Chart(ctx, t);


console.log(cc.data);








//---------------------------
function addData(xlabel, num) {
  const data = cc.data;
  if (data.datasets.length > 0) {
    let label = data.labels;

    for (let index = 0; index < data.datasets.length; ++index) {
      data.datasets[index].data.push(num);
      console.log('data.datasets[index].data.push(num)', index, 'num:', num)
    }
    label.push(xlabel);

    cc.update();
  }
}

function addBigData(xlabel, num){
  const data = cc.data;
  if (data.datasets.length > 0) {
    let label = data.labels;

    for (let index = 0; index < data.datasets.length; ++index) {
      data.datasets[index].data.push(num);
      console.log('data.datasets[index].data.push(num)', index, 'num:', num)
    }
    label.push(xlabel);

    
  }
}

function addDataset(dsName, value, dsColor, dsBgColor,yAxisID) {
  const data = cc.data;
  // const dsColor = 'rgb(255, 99, 132)';

  const newDataset = {
    label: dsName,
    backgroundColor: dsBgColor,
    borderColor: dsColor,
    data: value,
    yAxisID: yAxisID,
  };

  cc.data.datasets.push(newDataset);
  cc.update();

  console.log('新增', cc.data);

}



function removeData() {
  cc.data.labels.splice(-1, 1); // remove the label first

  cc.data.datasets.forEach(dataset => {
    dataset.data.pop();
  });

  cc.update();
}

function removeDataset() {
  cc.data.datasets.pop();
  // for (var i = 0; i < cc.data.labels.length; i++) {
  //   cc.data.labels.pop();
  // }

  cc.update();
}