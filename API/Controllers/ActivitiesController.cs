using System;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using Application.Activities;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers
{
    //[AllowAnonymous]
    public class Activites : BaseApiController
    {
        private readonly IMediator _mediator;
        public Activites(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> GetActivities()
        {
            //return HandleResult<List<Activity>>(await _mediator.Send(new List.Query()));
            return HandleResult(await _mediator.Send(new List.Query()));
        }
        [HttpGet("{id}")]//activity id
        public async Task<IActionResult> GetActivity(Guid id)
        {
            /* this method used for return not found if the activity doesn't esict in the database but we will use other crateria
            var activity = await _mediator.Send(new Details.Query { Id = id });

            if(activity == null) return NotFound();
            return activity; */
            return HandleResult<ActivityDto>(await _mediator.Send(new Details.Query { Id = id }));
        }
        [HttpPost]
        public async Task<IActionResult> CreateActivity(Activity NewActivity)
        {
            return HandleResult<Unit>(await _mediator.Send(new Create.Query { NewItem = NewActivity }));
        }
        [Authorize(Policy = "IsActivityHost")]
        [HttpPut("{id}")]
        public async Task<IActionResult> EditActivity(Guid id, Activity _activity)
        {
            _activity.Id = id;
            return HandleResult<Unit>(await _mediator.Send(new Edit.Query { activity = _activity }));
        }
        [Authorize(Policy = "IsActivityHost")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(Guid id)
        {
            return HandleResult<Unit>(await _mediator.Send(new Delete.Query { Id = id }));
        }

        [HttpPost("{id}/attend")]
        public async Task<IActionResult> Attend(Guid id)
        {
            return HandleResult<Unit>(await _mediator.Send(new UpdateAttendance.Command { Id = id }));
        }
    }
}