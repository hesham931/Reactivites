using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class UpdateAttendance
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
        }
        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly ApplicationDbContext _Db;
            private readonly IUserAccessor _userAccessor;

            public Handler(ApplicationDbContext db, IUserAccessor userAccessor)
            {
                _Db = db;
                _userAccessor = userAccessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _Db.Activities
                    .Include(a => a.Attendees).ThenInclude(a => a.AppUser)
                    .FirstOrDefaultAsync(a => a.Id == request.Id);

                if (activity == null) return null;

                var user = await _Db.Users.FirstOrDefaultAsync(x =>
                    x.UserName == _userAccessor.GetUserName());

                if (user == null) return null;

                var hostUsername = activity.Attendees
                    .FirstOrDefault(x => x.IsHost)?.AppUser?.UserName;

                var attendance = activity.Attendees
                    .FirstOrDefault(x => x.AppUser.UserName == user.UserName);

                if(attendance != null && hostUsername == user.UserName)
                    activity.IsCancelled = !activity.IsCancelled;

                if(attendance != null && hostUsername != user.UserName)
                    activity.Attendees.Remove(attendance);

                if(attendance == null)
                {
                    attendance = new ActivityAttendee
                    {
                        AppUser = user,
                        Activity = activity,
                        IsHost = false
                    };

                    activity.Attendees.Add(attendance);
                }

                var result = await _Db.SaveChangesAsync() > 0;

                return result ? Result<Unit>.Success(Unit.Value)
                : Result<Unit>.Failure("Problem updating attendance");
            }
        }
    }
}