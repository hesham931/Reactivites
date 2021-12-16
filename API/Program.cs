using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Persistence;

namespace API
{
    public class Program
    {
        /* thats the old we will create new main for creating our database
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        } */
        public static async Task Main(string[] args)
        {
            var Host = CreateHostBuilder(args).Build();
            using var Scope = Host.Services.CreateScope();
            var Services = Scope.ServiceProvider;

            try{
                var Context = Services.GetRequiredService<ApplicationDbContext>();
                //this method will apply any migrations to the database, also if there no database its will be created
                await Context.Database.MigrateAsync();

                await Seed.SeedData(Context);
            }
            catch(Exception ex){
                var Logger = Services.GetRequiredService<ILogger<Program>>();
                Logger.LogError(ex, "An error occured during migrations");
            }

            await Host.RunAsync();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
