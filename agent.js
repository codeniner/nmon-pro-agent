const si = require('systeminformation');
const fs = require('fs');


async function init_stats() {
    console.log('start init_stats');

    const networkStats = await si.networkStats("*");
    const currentLoad = await si.currentLoad();
    const disksIO = await si.disksIO();
    const fsStats = await si.fsStats();

    console.log('end init_stats');
}


function run() {

    console.log('start run');
    

    //const data = await si.getAllData('*', '*');

    si.getAllData('*', '*', function(allData) {

        console.log(allData);
  
        fs.writeFile('latest.json', JSON.stringify(allData), function (err) { });



        console.log('end run');
     
    })


    //console.log(data);

    
   
    
}

init_stats();

setTimeout(run, 1000);