const si = require('systeminformation');
const fs = require('fs');
const https = require('https');

let gateway = process.argv[2];
let serverkey = process.argv[3];

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
    

    si.getAllData('*', '*', function(allData) {

        //console.log(allData);
  
        fs.writeFile('latest.json', JSON.stringify(allData), function (err) { });

        if (gateway && serverkey) {
            const postData = JSON.stringify(allData);
            const options = {
                hostname: gateway,
                port: 443,
                path: '/api/server/'+serverkey,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': postData.length
                }
            };

            const req = https.request(options, (res) => {
                console.log(`statusCode: ${res.statusCode}`);
                res.on('data', (d) => {
                    process.stdout.write(d);
                });
            });

            req.on('error', (error) => {
                console.error(error);
            });

            req.write(postData);
            req.end();
        }

        console.log('gateway: ' + gateway);
        console.log('serverkey: ' + serverkey);



        console.log('end run');
     
    })


    
   
    
}

init_stats();

setTimeout(run, 1000);