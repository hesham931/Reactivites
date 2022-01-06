using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class Create
    {
        public class Query : IRequest<Result<Unit>>
        {
            public Activity NewItem { set; get; }
        }
        public class CommandValidator : AbstractValidator<Query>
        {
            public CommandValidator()
            {
                RuleFor(el => el.NewItem).SetValidator(new ActivityValidation());
            }
        }
        public class Handler : IRequestHandler<Query, Result<Unit>>
        {
            private readonly ApplicationDbContext _Db;
        private readonly IUserAccessor _userAccessor;
            public Handler(ApplicationDbContext Db, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _Db = Db;
            }

            public async Task<Result<Unit>> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _Db.Users.FirstOrDefaultAsync(x =>
                    x.UserName == _userAccessor.GetUserName());

                var attendee = new ActivityAttendee
                {
                    AppUser = user,
                    Activity = request.NewItem,
                    IsHost = true
                };

                request.NewItem.Attendees.Add(attendee);

                _Db.Activities.Add(request.NewItem);

                var result = await _Db.SaveChangesAsync() > 0;//return 0 if there is nothing changed in the database

                if(!result) return Result<Unit>.Failure("Failed to create activity");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}