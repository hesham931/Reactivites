using Application.Core;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    //[ApiController] have an automatic 400 requests respones
    [ApiController]
    [Route("Api/[Controller]")]
    public class BaseApiController : ControllerBase{
        protected ActionResult HandleResult<T>(Result<T> result) {
            if(result == null) return NotFound();
            if (result.IsSuccess && result.Value != null) return Ok(result.Value);
            if (result.IsSuccess && result.Value == null) return NotFound();
            return BadRequest(result.Error);
        }
    }
}