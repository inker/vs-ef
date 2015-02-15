using DBManager;
using DBManager.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DBManager
{
    public class DBInteraction
    {
        public static void InsertUser(string userName, string userSurname, string organizationName, string[] jobNames)
        {
            try
            {
                using (var ctx = new SimpleContext())
                {
                    var org = ctx.Organisations.SingleOrDefault(o => o.Name == organizationName);
                    if (org == null)
                    {
                        org = new Organisation { Name = organizationName };
                        ctx.Organisations.Add(org);
                    }
                    var usr = ctx.Users.SingleOrDefault(user => user.Name == userName && user.Surname == userSurname);
                    if (usr != null)
                    {
                        throw new Exception("user already exists");
                    }
                    usr = new User { Name = userName, Organisation = org, Surname = userSurname };
                    // not necessary to add the user as it is later implicitly added via UserJob addition (below)
                    //context.Users.Add(usr);

                    var jobs = ctx.Jobs.Where(job => jobNames.Contains(job.Name)).ToList();
                    Console.WriteLine("found jobs: " + jobs.Count);

                    foreach (var jobName in jobNames)
                    {
                        if (!jobs.Exists(e => e.Name == jobName))
                        {
                            jobs.Add(new Job { Name = jobName });
                        }
                    }

                    foreach (var j in jobs)
                    {
                        var userJob = new UserJob { User = usr, Job = j };
                        ctx.UserJobs.Add(userJob);
                    }

                    ctx.SaveChanges();
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Data);
            }
        }

        //private static User FindUser(string userSurname)
        //{
        //    using (var ctx = new Database.SimpleContext())
        //    {
        //        var userQuery = ctx.Users.Where(u => u.Surname == userSurname);
        //        return userQuery.Any() ? userQuery.First() : null;
        //    }
        //}

        public static void AddJobToUser(string userName, string userSurname, string jobName)
        {
            try
            {
                using (var ctx = new DBManager.SimpleContext())
                {
                    //var userJobQuery = ctx.Users
                    //    .Where(u => u.Surname == userSurname)
                    //    .Join(ctx.UserJobs, u => u, uj => uj.User, (u, uj) => new {u, uj});
                    var users = ctx.Users.Where(u => u.Surname == userSurname && u.Name == userName).ToList();
                    if (!users.Any()) throw new Exception("user not found");
                    var user = users.First();
                    var job = ctx.Jobs.SingleOrDefault(j => j.Name == jobName);
                    if (job == null)
                    {
                        job = new Job { Name = jobName };
                        // not necessary
                        //ctx.Jobs.Add(job); 
                    }
                    var userJob = new UserJob { User = user, Job = job };
                    ctx.UserJobs.Add(userJob);
                    ctx.SaveChanges();
                }
            } catch (Exception e)
            {
                Console.WriteLine(e.Data);
            }
        }

        public static void RemoveJobFromUser(string userName, string userSurname, string jobName)
        {
            try
            {
                using (var ctx = new DBManager.SimpleContext())
                {
                    var userQuery = ctx.Users.Where(u => u.Surname == userSurname && u.Name == userName);
                    if (!userQuery.Any()) throw new Exception("user not found");
                    var user = userQuery.First();
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

        public static void RemoveUser(string userName, string userSurname)
        {
            try
            {
                using (var ctx = new SimpleContext())
                {
                    var user = ctx.Users.SingleOrDefault(u => u.Name == userName && u.Surname == userSurname);
                    if (user == null)
                    {
                        throw new Exception("user not found");
                    }
                    else
                    {
                        ctx.Users.Remove(user);
                        ctx.SaveChanges();
                    }                    
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Data);
            }
        }

        //public static List<UserCustom> GetAllUsers()
        //{
        //    using (var ctx = new SimpleContext())
        //    {
        //        var usersQuery = ctx.Users
        //            .GroupJoin(ctx.UserJobs, u => u, uj => uj.User, (u, uj) => new { User = u, Jobs = uj.Select(uje => uje.Job) });
        //        var userJobs = usersQuery.ToList();
        //        if (usersQuery.Any())
        //        {
        //            var objs = new List<UserText>();
        //            foreach (var userJob in userJobs)
        //            {
        //                objs.Add(new UserText
        //                {
        //                    ID = userJob.User.ID,
        //                    Name = userJob.User.Name,
        //                    Surname = userJob.User.Surname,
        //                    Organization = userJob.User.Organisation.Name,
        //                    Jobs = string.Join(", ", userJob.Jobs.Select(j => j.Name))
        //                });
        //            }
        //            return objs;
        //        }
        //        ctx.SaveChanges();
        //        return null;
        //    }
        //}

        public static List<UserCustom> GetAllUsersRaw()
        {
            using (var ctx = new SimpleContext())
            {
                return ctx.Users.Select(user => new UserCustom { ID = user.ID, Name = user.Name, OrganisationID = user.OrganisationID, Surname = user.Surname }).ToList();
            }
        }

        public static List<OrganisationCustom> GetAllOrganizationsRaw()
        {
            using (var ctx = new SimpleContext())
            {
                return ctx.Organisations.Select(org => new OrganisationCustom { ID = org.ID, Name = org.Name }).ToList();
            }
        }

        public static List<UserJobCustom> GetAllUserJobsRaw()
        {
            using (var ctx = new SimpleContext())
            {
                return ctx.UserJobs.Select(uj => new UserJobCustom { ID = uj.ID, UserID = uj.User.ID, JobID = uj.Job.ID }).ToList();
            }
        }

        public static List<JobCustom> GetAllJobsRaw()
        {
            using (var ctx = new SimpleContext())
            {
                return ctx.Jobs.Select(job => new JobCustom { ID = job.ID, Name = job.Name }).ToList();
            }
        }

        public async static Task<List<UserText>> GetAllUsersTextAsync()
        {
            var task = await Task<List<UserText>>.Factory.StartNew(() => GetAllUsersText());
            return task;
            //var task = await Task<List<DataObject>>(() => GetAllUsersText());
        }

        public static List<UserText> GetAllUsersText()
        {
            using (var ctx = new SimpleContext())
            {
                var usersQuery = ctx.Users
                    .GroupJoin(ctx.UserJobs, u => u, uj => uj.User, (u, uj) => new { User = u, Jobs = uj.Select(uje => uje.Job) });
                var userJobs = usersQuery.ToList();
                if (usersQuery.Any())
                {
                    return userJobs.Select(userJob => new UserText
                    {
                        ID = userJob.User.ID,
                        Name = userJob.User.Name,
                        Surname = userJob.User.Surname,
                        Organization = userJob.User.Organisation.Name,
                        Jobs = string.Join(", ", userJob.Jobs.Select(j => j.Name))
                    }).ToList();
                }
                return new List<UserText>();
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

