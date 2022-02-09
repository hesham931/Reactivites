using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class Edit
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string DisplayName { get; set; }
            public string Bio { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.DisplayName).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly ApplicationDbContext _context;
            private readonly IUserAccessor _userAccessor;

            public Handler(ApplicationDbContext context, IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUserName());

                user.Bio = request.Bio ?? user.Bio;
                user.DisplayName = request.DisplayName ?? user.DisplayName;

                //_context.Entry(user).State = EntityState.Modified;
                //this behivor will return 200 OK even if no data changed, but now if you send the sasme data will give 400 bad request

                var success = await _context.SaveChangesAsync() > 0;
                if (success) return Result<Unit>.Success(Unit.Value);

                return Result<Unit>.Failure("Problem Updating Profile");
            }
        }
    }
}