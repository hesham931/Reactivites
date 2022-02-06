using Application.Core;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    //[ApiController] have an automatic 400 requests respones
    [ApiController]
    [Route("Api/[Controller]")]
    public class BaseApiController : ControllerBase
    {
        private IMediator _mediator;
        protected IMediator Mediator => _mediator ??= HttpContext.RequestServices
            .GetService(typeof(IMediator)) as IMediator;
        protected ActionResult HandleResult<T>(Result<T> result) {
            if(result == null) return NotFound();
            if (result.IsSuccess && result.Value != null) return Ok(result.Value);
            if (result.IsSuccess && result.Value == null) return NotFound();
            return BadRequest(result.Error);
        }
    }
}