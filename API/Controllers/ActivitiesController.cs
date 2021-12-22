using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;
using MediatR;
using Application.Activities;
using Application.Core;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers
{
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
            return HandleResult<List<Activity>>(await _mediator.Send(new List.Query()));
        }
        [HttpGet("{id}")]//activity id
        public async Task<IActionResult> GetActivity(Guid id)
        {
            /* this method used for return not found if the activity doesn't esict in the database but we will use other crateria
            var activity = await _mediator.Send(new Details.Query { Id = id });

            if(activity == null) return NotFound();
            return activity; */
            return HandleResult<Activity>(await _mediator.Send(new Details.Query { Id = id }));
        }
        [HttpPost]
        public async Task<IActionResult> CreateActivity(Activity NewActivity)
        {
            return HandleResult<Unit>(await _mediator.Send(new Create.Query { NewItem = NewActivity }));
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> EditActivity(Guid id, Activity _activity)
        {
            _activity.Id = id;
            return HandleResult<Unit>(await _mediator.Send(new Edit.Query { activity = _activity }));
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(Guid id)
        {
            return HandleResult<Unit>(await _mediator.Send(new Delete.Query { Id = id }));
        }
    }
}