using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Edit
    {
        public class Query : IRequest<Result<Unit>>
        {
            public Activity activity { set; get; }
        }

        public class CommandValidator : AbstractValidator<Query>
        {
            public CommandValidator()
            {
                RuleFor(el => el.activity).SetValidator(new ActivityValidation());
            }
        }
        public class Handler : IRequestHandler<Query, Result<Unit>>
        {
            private readonly ApplicationDbContext _Db;
            private readonly IMapper _mapper;

            public Handler(ApplicationDbContext Db, IMapper mapper)
            {
                _Db = Db;

                _mapper = mapper;
            }
            public async Task<Result<Unit>> Handle(Query request, CancellationToken cancellationToken)
            {
                var Obj = await _Db.Activities.FindAsync(request.activity.Id);

                if (Obj == null) return null;

                _mapper.Map(request.activity, Obj);

                var result = await _Db.SaveChangesAsync() > 0;

                if (!result) return Result<Unit>.Failure("Failed to update the activity");
                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}