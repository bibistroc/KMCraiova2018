# Keyboards & Mice 2018 Craiova

## Presentation
You can see (and download) the presentation on [Scribd](https://www.scribd.com/document/393492137/km2018?secret_password=wiVH4bbffLvPQfbJk12c)

## Demo

### Prerequisites
- [Visual Studio 2017](https://visualstudio.microsoft.com/) (Community version is enought but any version will work) - at least v15.9.0
    - Azure development workload
    ![alt text](https://raw.githubusercontent.com/bibistroc/KMCraiova2018/master/assets/vs-azuredevelopment.png)
- [nodeJs](https://nodejs.org/en/) - at least v8 (latest version is recommended)
- [OPTIONAL] [Visual Studio Code](https://code.visualstudio.com/)

### Azure
You need to deploy 2 resources inside azure:

#### Azure SignalR Service  
You can click on the following link to deploy a resource in Azure:

[![Deploy SignalR Service](http://azuredeploy.net/deploybutton.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fbibistroc%2FKMCraiova2018%2Fmaster%2Fazure%2Fsignalr.azuredeploy.json)

Get the Connection string from the `Keys` menu in Azure as we are going to need it later:

![SignalR Connection string](https://raw.githubusercontent.com/bibistroc/KMCraiova2018/master/assets/azure-signalr-connection-string.png)

#### Azure Cosmos DB
You can click on the following link to deploy a resource in Azure:

[![Deploy CosmosDB](http://azuredeploy.net/deploybutton.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fbibistroc%2FKMCraiova2018%2Fmaster%2Fazure%2Fcosmosdb.azuredeploy.json)

After deploying CosmosDB, you need to create one database named `chat` and one collection named `messages` as shown below

![DB & Collection](https://raw.githubusercontent.com/bibistroc/KMCraiova2018/master/assets/azure-cosmosdb-db.png)

Get the Connection string from the `Keys` menu in Azure as we are going to need it later:

![CosmosDB Connection string](https://raw.githubusercontent.com/bibistroc/KMCraiova2018/master/assets/azure-cosmosdb-connection-string.png)

### Backend
Open the solution from `src/backend/KMCraiova2018.sln` with Visual Studio 2017. Edit `local.settings.json` and replace the SignalR connection string & CosmosDB connection string that you got above. Run the project (CTRL+F5). The first run can be slow if you don't have the azure sdk tools.

### Frontend
Run the following commands from a terminal opened inside `src/frontend` directory:
```
npm install
npm start
```
