using Database;
using Database.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApplication
{
    class Program
    {
        static void Main(string[] args)
        {
            DBInteraction.insertUserConsole();
            //using (var context = new SimpleContext())
            //{
            //    var usersQuery = context.Users
            //        .Include("Organisation")
            //        .Where(user => user.Name == "Peter");

            //    var users = usersQuery.ToList();

            //    //if (!users.Any())
            //    //{
            //    //    var organisation = new Organisation
            //    //    {
            //    //        Name = "Test Organisation"
            //    //    };

            //    //    var userPeter = new User
            //    //    {
            //    //        Name = "Peter",
            //    //        Surname = "Dow",
            //    //        Organisation = organisation
            //    //    };

            //    //    context.Users.Add(userPeter);

            //    //    context.SaveChanges();
            //    //}

            //    var jobsQuery = context.Jobs;
            //    var jobs = jobsQuery.ToList();
            //    if (!jobs.Any())
            //    {
            //        var job = new Job
            //        {
            //            Name = "secretary"
            //        };

            //        var user = users.ElementAt(0);

            //        var userJob = new UserJob();

            //        userJob.User = user;
            //        userJob.Job = job;

            //        context.UserJobs.Add(userJob);

            //        context.SaveChanges();
            //    }
            //}

            
        }
    }
}
