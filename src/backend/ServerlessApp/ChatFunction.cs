using System.IO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.SignalRService;

namespace ServerlessApp
{
    public static class ChatFunction
    {
        [FunctionName("chat")]
        public static IActionResult Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)] HttpRequest req,
            [CosmosDB(
                databaseName: "chat",
                collectionName: "messages",
                ConnectionStringSetting = "CosmosDBConnection")]out dynamic document,
            [SignalR(HubName = "km")] IAsyncCollector<SignalRMessage> signalRMessages,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            string requestBody = new StreamReader(req.Body).ReadToEnd();
            ChatMessage data = JsonConvert.DeserializeObject<ChatMessage>(requestBody);
            document = data;

            signalRMessages.AddAsync(new SignalRMessage()
            {
                Target = "chatMessage",
                Arguments = new object[] { data }
            }).Wait();

            return new OkObjectResult(document);
        }
    }
}
