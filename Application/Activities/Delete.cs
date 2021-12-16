using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Delete
    {
        public class Query : IRequest<Result<Unit>>
        {
            public Guid Id { set; get; }
        }
        public class Handler : IRequestHandler<Query, Result<Unit>>
        {
            private readonly ApplicationDbContext _Db;
            public Handler(ApplicationDbContext Db)
            {
                _Db = Db;

            }
            public async Task<Result<Unit>> Handle(Query request, CancellationToken cancellationToken)
            {
                var Obj = await _Db.Activities.FindAsync(request.Id);

                _Db.Activities.Remove(Obj);

                var result = await _Db.SaveChangesAsync() > 0;

                if (!result) return Result<Unit>.Failure("Failed to delete the activity");
                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}