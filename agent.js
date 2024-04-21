const si = require('systeminformation');
const fs = require('fs');
const axios = require('axios');

let agent_version = '1.0.0';
let action = process.argv[2];
let gateway = process.argv[3];
let serverkey = process.argv[4];

async function init_stats() {
    console.log('Initiating stats...');

    const networkStats = await si.networkStats("*");
    const currentLoad = await si.currentLoad();
    const disksIO = await si.disksIO();
    const fsStats = await si.fsStats();
}

async function collect_stats() {
    console.log('Collecting stats...');

    const allData = await si.getAllData("*", "*");

    const dockerAll = await si.dockerAll();
    const printer = await si.printer();
    const usb = await si.usb();
    const audio = await si.audio();
    const bluetoothDevices = await si.bluetoothDevices();
    const networkInterfaces = await si.networkInterfaces();
    const wifiConnections = await si.wifiConnections();
    const blockDevices = await si.blockDevices();

    allData.docker = dockerAll;
    allData.printers = printer;
    allData.usb = usb;
    allData.audio = audio;
    allData.bluetoothDevices = bluetoothDevices;
    allData.networkInterfaces = networkInterfaces;
    allData.wifiConnections = wifiConnections;
    allData.blockDevices = blockDevices;

    allData.agent_version = agent_version;

    return allData;
}

function run() {

   
    collect_stats().then(function(allData) {
        
        console.log('Sending stats...');


        fs.writeFile('latest.json', JSON.stringify(allData), function (err) { });

        if (gateway && serverkey) {
            console.log('Sending stats to ' + gateway + '/api/server/' + serverkey);

            const axiosResult = axios.post(gateway + '/api/server/' + serverkey, allData);
            axiosResult.then(function(response) {
                console.log(response.data);
            });
        }

    }).catch(error => console.error(error));

    
}


if(action == 'run') {
    init_stats();
    setTimeout(run, 1000);
}

if(!action) {

    if (typeof sea !== 'undefined') {
        console.log('Usage: agent run <gateway> <serverkey>');
    } else {
        console.log('Usage: node agent.js run <gateway> <serverkey>');
    }

    
}

