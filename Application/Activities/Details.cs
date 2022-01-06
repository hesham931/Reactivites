using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class Details
    {
        public class Query : IRequest<Result<ActivityDto>>
        {
            public Guid Id { set; get; }
        }
        public class Handler : IRequestHandler<Query, Result<ActivityDto>>
        {
            private readonly ApplicationDbContext _Db;
        private readonly IMapper _mapper;
            public Handler(ApplicationDbContext Db, IMapper mapper)
            {
                _mapper = mapper;
                _Db = Db;
            }
            public async Task<Result<ActivityDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                //if(activity == null) return NotFound(); cant do that because we are not in api controller
                //if(activity == null) throw new Exception("Activity Not Found!"); we can do that but its heavy on the program


                var activity =  await _Db.Activities
                .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(x => x.Id == request.Id);

                
                return Result<ActivityDto>.Success(activity);
            }
        }
    }
}