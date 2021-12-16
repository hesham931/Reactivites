using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Details
    {
        public class Query : IRequest<Result<Activity>>
        {
            public Guid Id { set; get; }
        }
        public class Handler : IRequestHandler<Query, Result<Activity>>
        {
            private readonly ApplicationDbContext _Db;
            public Handler(ApplicationDbContext Db)
            {
                _Db = Db;
            }
            public async Task<Result<Activity>> Handle(Query request, CancellationToken cancellationToken)
            {
                //if(activity == null) return NotFound(); cant do that because we are not in api controller
                //if(activity == null) throw new Exception("Activity Not Found!"); we can do that but its heavy on the program


                var activity =  await _Db.Activities.FindAsync(request.Id);

                
                return Result<Activity>.Success(activity);
            }
        }
    }
}