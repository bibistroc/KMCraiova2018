using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.SignalRService;

namespace ServerlessApp
{
    public static class DrawFunction
    {
        [FunctionName("draw")]
        public static async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Anonymous, "post")]HttpRequest req,
            [SignalR(HubName = "km")]IAsyncCollector<SignalRMessage> signalRMessages)
        {
            string requestBody = new StreamReader(req.Body).ReadToEnd();

            if (string.IsNullOrEmpty(requestBody))
            {
                return new BadRequestObjectResult("Please pass a payload to broadcast in the request body.");
            }

            await signalRMessages.AddAsync(new SignalRMessage()
            {
                Target = "draw",
                Arguments = new object[] { requestBody }
            });

            return new OkResult();
        }
    }
}