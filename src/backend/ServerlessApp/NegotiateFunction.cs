using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Azure.WebJobs.Extensions.SignalRService;

namespace ServerlessApp
{
    public static class NegotiateFunction
    {
        [FunctionName("negotiate")]
        public static IActionResult Run(
            [HttpTrigger(AuthorizationLevel.Anonymous)]HttpRequest req,
            [SignalRConnectionInfo(HubName = "km")]SignalRConnectionInfo info)
        {
            return info != null
                ? (ActionResult)new OkObjectResult(info)
                : new NotFoundObjectResult("Failed to load SignalR Info.");
        }
    }
}
