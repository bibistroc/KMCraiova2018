# Keyboards & Mice 2018 Craiova

## Prerequisites
- [Visual Studio 2017](https://visualstudio.microsoft.com/) (Community version is enought but any version will work) - at least v15.9.0
    - Azure development workload
    ![alt text](https://raw.githubusercontent.com/bibistroc/KMCraiova2018/master/assets/vs-azuredevelopment.png)
- [nodeJs](https://nodejs.org/en/) - at least v8 (latest version is recommended)

## Local Execution
### Frontend
Run the following commands from a terminal opened inside `src/frontend` directory:
```
npm install
npm start
```

### Azure
You need to deploy 2 resources inside azure:
- Azure SignalR Service
  
  You can click on the following link to deploy a resource on Azure:

  [![Deploy to Azure](http://azuredeploy.net/deploybutton.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fbibistroc%2FKMCraiova2018%2Fmaster%2Fazure%2Fsignalr.azuredeploy.json)
- Azure Cosmos DB


### Backend
Open the solution from `src/backend/KMCraiova2018.sln` with Visual Studio 2017 and start the project (CTRL+F5). On the first run, it will take a while to start, because Visual Studio 2017 will download the required azure sdk tools to run functions locally.