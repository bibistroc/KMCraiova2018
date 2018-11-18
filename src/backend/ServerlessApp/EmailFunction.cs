using System.IO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Microsoft.Azure.WebJobs;

namespace ServerlessApp
{
    public static class EmailFunction
    {
        [FunctionName("email")]
        public static IActionResult Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)] HttpRequest req,
            [CosmosDB(
                databaseName: "chat",
                collectionName: "emails",
                ConnectionStringSetting = "CosmosDBConnection")]out dynamic document,
            ILogger log)
        {
            string requestBody = new StreamReader(req.Body).ReadToEnd();
            EmailAddress data = JsonConvert.DeserializeObject<EmailAddress>(requestBody);
            document = data;

            return new OkObjectResult(document);
        }
    }
}
