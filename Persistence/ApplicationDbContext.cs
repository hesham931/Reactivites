using Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
namespace Persistence
{
    public class ApplicationDbContext : IdentityDbContext<AppUser>
    {
        public ApplicationDbContext(DbContextOptions options) : base(options){}


        public DbSet<Activity> Activities { set; get; }
        //this command will be used to create the first migrations(-p for the place of ApplicationDbContext)(-s for the place of startup class)
        //dotnet ef migrations add IniyialCreate -p .\Persistence\ -s .\API\
    }
}