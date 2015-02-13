using DBManager.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DBManager
{
    public class SimpleContext : DbContext
    {
        public SimpleContext():base("dbConnectionString")
        {

        }

        public DbSet<Job> Jobs { get; set; }

        public DbSet<UserJob> UserJobs { get; set; }

        public DbSet<User> Users { get; set; }

        public DbSet<Organisation> Organisations { get; set; }



        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}
