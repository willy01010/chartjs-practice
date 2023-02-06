const ctx = document.getElementById('myChart');
  

let  t='';

const data = [
    { year: 2010, count: 10 },
    { year: 2011, count: 20 },
    { year: 2012, count: 15 },
    { year: 2013, count: 25 },
    { year: 2014, count: 22 },
    { year: 2015, count: 30 },
    { year: 2016, count: 28 },
  ];


t = {
    type: 'line',
    data: {
        labels: data.map(row => row.year),
        datasets: [
          {
            label: 'Acquisitions by year',
            data: data.map(row => row.count)
          }
        ]
    },
    options: {
        scales:{
            x:{
                // max: 20
  
            },
            y: {
            //   max: 20,
              ticks: {
                callback: value => `${value / 1} m`
              }
            }
        },
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'random num 0~70 until 2022'
        }
      }
    },
  };

let cc = new Chart(ctx, t);

window.setTimeout(sim,1000);
console.log(cc.data);

function sim(){
    let current = cc.data.labels[cc.data.labels.length-1];
    var i = current;
    if(i<2022){//直到 label最後一個數值是2021才會stop recursive
        i++;
        addData(i,Math.floor(Math.random() * 70));//random num from 0 to 70
        window.setTimeout(sim,2000);//every 2s call recursive
        
    }
    
    
}




//---------------------------
function addData(xlabel ,num){
    const data = cc.data;
            if (data.datasets.length > 0) {
                let label = data.labels;

                
      
              for (let index = 0; index < data.datasets.length; ++index) {
                data.datasets[index].data.push(num);
                console.log('data.datasets[index].data.push(num)' , index ,'num:' ,num)
              }
              label.push(xlabel);
               
              cc.update();
            }
}

