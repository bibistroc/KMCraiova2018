using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;

namespace ServerlessApp
{
    public static class ChatHistoryFunction
    {
        [FunctionName("chatHistory")]
        public static IActionResult Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = null)] HttpRequest req,
            [CosmosDB(
                databaseName: "chat",
                collectionName: "messages",
                ConnectionStringSetting = "CosmosDBConnection",
                SqlQuery = "SELECT * FROM c")]
            IEnumerable<ChatMessage> toDoItems,
            ILogger log)
        {

            return new OkObjectResult(toDoItems);
        }
    }
}
