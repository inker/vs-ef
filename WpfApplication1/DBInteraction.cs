using Database.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DBInt
{
    class DBInteraction
    {
        public static void InsertUser(string userName, string userSurname, string organizationName, string[] jobNames)
        {
            try
            {
                using (var context = new Database.SimpleContext())
                {
                    var orgQuery = context.Organisations.Where(o => o.Name == organizationName);
                    var orgs = orgQuery.ToList();
                    Organisation org;
                    if (orgs.Any())
                    {
                        org = orgs.ElementAt(0);
                    }
                    else
                    {
                        org = new Organisation
                        {
                            Name = organizationName
                        };
                        context.Organisations.Add(org);

                    }
                    var usersQuery = context.Users.Where(user => user.Name == userName && user.Surname == userSurname);
                    var users = usersQuery.ToList();
                    User usr;
                    if (users.Any())
                    {
                        throw new Exception("user already exists");
                    }
                    else
                    {
                        usr = new User
                        {
                            Name = userName,
                            Organisation = org,
                            Surname = userSurname
                        };
                        context.Users.Add(usr);
                    }

                    var jobsQuery = context.Jobs.Where(job => jobNames.Contains(job.Name));

                    var jobs = jobsQuery.ToList();
                    Console.WriteLine("found jobs: " + jobs.Count);
                    foreach (var j in jobNames)
                    {
                        if (!jobs.Exists(e => e.Name == j))
                        {
                            var job = new Job();
                            job.Name = j;
                            //context.Jobs.Add(job);
                            jobs.Add(job);
                        }
                    }
                    foreach (var j in jobs)
                    {
                        var userJob = new UserJob
                        {
                            User = usr,
                            Job = j
                        };
                        context.UserJobs.Add(userJob);
                    }


                    context.SaveChanges();


                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Data);
            }
        }

        private static User findUser(string userSurname)
        {
            using (var ctx = new Database.SimpleContext())
            {
                var userQuery = ctx.Users.Where(u => u.Surname == userSurname);
                return userQuery.Any() ? userQuery.First() : null;
            }
        }

        public static void AddJobToUser(string userSurname, string jobName)
        {
            try
            {
                using (var ctx = new Database.SimpleContext())
                {
                    //var userJobQuery = ctx.Users
                    //    .Where(u => u.Surname == userSurname)
                    //    .Join(ctx.UserJobs, u => u, uj => uj.User, (u, uj) => new {u, uj});
                    var user = findUser(userSurname);
                    if (user == null) throw new Exception("user not found");
                    var jobQuery = ctx.Jobs.Where(j => j.Name == jobName);
                    Job job;
                    if (jobQuery.Any())
                    {
                        job = jobQuery.First();
                    } else 
                    {
                        job = new Job
                        {
                            Name = jobName
                        };
                        ctx.Jobs.Add(job);
                    }
                    var userJob = new UserJob
                    {
                        User = user,
                        Job = job
                    };
                    ctx.UserJobs.Add(userJob);
                    ctx.SaveChanges();
                }
            } catch (Exception e)
            {
                Console.WriteLine(e.Data);
            }
        }

        public static void RemoveJobFromUser(string userSurname, string jobName)
        {
            try
            {
                using (var ctx = new Database.SimpleContext())
                {
                    var user = findUser(userSurname);
                    if (user == null) throw new Exception("user not found");
                    var userJobQuery = ctx.Jobs
                        .Where(j => j.Name == jobName)
                        .Join(ctx.UserJobs, j => j, uj => uj.Job, (j, uj) => new {j, uj})
                        .Select(uj => uj);
                    if (!userJobQuery.Any()) throw new Exception("job not found or user doesn't have job");
                    ctx.UserJobs.Remove(userJobQuery.First().uj);
                    ctx.SaveChanges();
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Data);
            }
        }

        public static void RemoveUser(string userSurname)
        {
            try
            {
                using (var ctx = new Database.SimpleContext())
                {
                    var user = findUser(userSurname);
                    if (user == null) throw new Exception("user doesn't exist");
                    ctx.Users.Remove(user);
                    ctx.SaveChanges();
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Data);
            }
        }

        public static Dictionary<User, List<Job>> getAllUsers()
        {
            using (var ctx = new Database.SimpleContext())
            {
                var usersQuery = ctx.Users
                    .GroupJoin(ctx.UserJobs, u => u, uj => uj.User, (u, uj) => new { u, uj });
                if (usersQuery.Any())
                {
                    var dict = new Dictionary<User, List<Job>>();
                    foreach (var user in usersQuery)
                    {
                        dict.Add(user.u, user.uj.Select(uj => uj.Job).ToList());
                    }
                    return dict;
                }
                return null;
            }
        }

        public static void insertUserConsole()
        {
            Console.WriteLine("enter the user's name:");
            var name = Console.ReadLine();
            Console.WriteLine("enter the user's surname:");
            var surname = Console.ReadLine();
            Console.WriteLine("enter the user's organization:");
            var org = Console.ReadLine();
            Console.WriteLine("enter the user's jobs:");
            var jobs = new LinkedList<string>();
            while (true)
            {
                var job = Console.ReadLine();
                if (job == "") break;
                jobs.AddLast(job);
            }
            Console.Write("jobs: ");
            foreach (var j in jobs)
            {
                Console.Write(j + ", ");
            }
            InsertUser(name, surname, org, jobs.ToArray());
        }

        public static UserJob u { get; set; }
    }
}

