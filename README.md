# nMon Pro Agent
The nMon Pro agent

## Build

> This steps assumes you already have node and npm installed on your system. For more information on how to install node and npm please see [here](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).  
> The minimum supported node version is 20  

To build the agent follow this steps:  

1. Clone this repository

```
git clone https://github.com/codeniner/nmon-pro-agent
```

2. Change to nmon-pro-agent folder

```
cd nmon-pro-agent
```


3. Install dependencies

```
npm install --save-dev
```

4. Run the build script

```
npm run build
``` 

You can find the build file at `build/agent.js`.  

To run the agent: `node build/agent.js run <gateway> <key> <server/workstation>`



### Oneline Install & Initialize

> The installer will automatically download a nodejs binary, the agent and will run the initialization
> All files will be placed in \opt\nmonpro or C:\Program Files\nMon Pro for windows.

On Linux/BSD/MacOS: 
```
curl -L -s https://github.com/codeniner/nmon-pro-agent/releases/latest/download/installer.sh && sudo bash installer.sh <gateway> <key> <server/workstation>
```


On Windows (PowerShell):  
```
New-Item -ItemType Directory -Force -Path C:\opt\nmonpro; Invoke-WebRequest -Uri https://github.com/codeniner/nmon-pro-agent/releases/latest/download/nMonProAgent-win-x64.exe -OutFile C:\opt\nmonpro\agent -UseBasicParsing; C:\opt\nmonpro\agent init <gateway> <key> <server/workstation>
```

Replace <gateway/>, <key/>, and <server/workstation> with your actual values.



curl -L -s https://github.com/codeniner/nmon-pro-agent/releases/latest/download/installer.sh && sudo bash installer.sh https://nmon.codeniner.com 9d2af6ad-67ad-487a-97f8-0038fb850123 workstation



## Use

### Initialize agent

On Linux/BSD/MacOS:  
```
sudo /opt/nmonpro/node /opt/nmonpro/agent.js init <gateway> <key> <server/workstation>
```

On Windows (elevated Command Prompt or PowerShell):  
```
agent.exe init <gateway> <key> <server/workstation>
```


### Deinitialize agent

On Linux/BSD/MacOS:  
```
sudo /opt/nmonpro/node /opt/nmonpro/agent.js deinit
```

On Windows:  
```
agent.exe deinit
```


### Uninstall the agent

On Linux/BSD/MacOS:  
```
sudo /opt/nmonpro/node /opt/nmonpro/agent.js uninstall
```

On Windows:  
```
agent.exe uninstall
```


### Update the agent

On Linux/BSD/MacOS:  
```
sudo /opt/nmonpro/node /opt/nmonpro/agent.js update
```

On Windows:  
```
agent.exe update
```


### Version information

On Linux/BSD/MacOS:  
```
sudo /opt/nmonpro/node /opt/nmonpro/agent.js version
```

On Windows:  
```
agent.exe version
```


### Paths information

On Linux/BSD/MacOS:  
```
sudo /opt/nmonpro/node /opt/nmonpro/agent.js paths
```

On Windows:  
```
agent.exe paths
```



### Run on demand

On Linux/BSD/MacOS: 
```
sudo /opt/nmonpro/node /opt/nmonpro/agent.js run <gateway> <key> <server/workstation>
```

On Windows  
```
agent.exe run <gateway> <key> <server/workstation>
```
