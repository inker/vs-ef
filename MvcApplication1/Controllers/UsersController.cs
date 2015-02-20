using DBManager;
using DBManager.Models;
using System.Linq;
using System.Web.Mvc;

namespace MvcApplication1.Controllers
{
    public class UsersController : Controller
    {
        //[HttpGet]
        //[ActionName("Index")]
        //public ActionResult GetEverything()
        //{
        //    var Users = DBInteraction.GetAllUsersRaw();
        //    var Organisations = DBInteraction.GetAllOrganizationsRaw();
        //    var Jobs = DBInteraction.GetAllJobsRaw();
        //    var UserJobs = DBInteraction.GetAllUserJobsRaw();
        //    var obj = new { Users, Organisations, Jobs, UserJobs };
        //    return Json(obj, JsonRequestBehavior.AllowGet);
        //}

        [HttpGet]
        [ActionName("Users")]
        public ActionResult GetAllUsers()
        {
            var users = DBInteraction.GetAllUsersRaw();
            return Json(users, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult Organisations()
        {
            var orgs = DBInteraction.GetAllOrganizationsRaw();
            return Json(orgs, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult Jobs()
        {
            var jobs = DBInteraction.GetAllJobsRaw();
            return Json(jobs, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult UserJobs()
        {
            var userJobs = DBInteraction.GetAllUserJobsRaw();
            return Json(userJobs, JsonRequestBehavior.AllowGet);
        }

        //[HttpPost]
        //[ActionName("Index")]
        //public ActionResult InsertUser(string Name, string Surname, string Organisation, string Jobs)
        //{
        //    var jobArr = (string.IsNullOrWhiteSpace(Jobs)) ? new string[] { } : Jobs.Split(',').Where(job => job.Length > 0).ToArray();
        //    DBInteraction.InsertUser(Name, Surname, Organisation, jobArr);
        //    return new HttpStatusCodeResult(200);
        //}

        [HttpGet]
        [ActionName("Index")]
        public ActionResult GetUsers()
        {
            var obj = DBInteraction.SelectUsers();
            return Json(obj, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [ActionName("Index")]
        public ActionResult InsertUsers(UserCustom[] users)
        {
            DBInteraction.InsertUsers(users);
            return new HttpStatusCodeResult(200); 
        }

        //[HttpDelete]
        //[ActionName("Index")]
        //public ActionResult DeleteUser(string Name, string Surname)
        //{
        //    DBInteraction.RemoveUser(Name, Surname);
        //    return new HttpStatusCodeResult(200);
        //}

        [HttpDelete]
        [ActionName("Index")]
        public ActionResult DeleteUser(UserCustom[] users)
        {
            DBInteraction.DeleteUsers(users);
            return new HttpStatusCodeResult(200);
        }

        /*
        public ActionResult Index(string Name, string Surname, string Organisation, string Jobs)
        {
            if (Request.HttpMethod == "POST")
            {
                DBInteraction.InsertUser(Name, Surname, Organisation, Jobs.Split(','));
                return new HttpStatusCodeResult(200);
            }
            else if (Request.HttpMethod == "DELETE")
            {
                DBInteraction.RemoveUser(Name, Surname);
                return new HttpStatusCodeResult(200);
            }
            return new HttpStatusCodeResult(404);
        }
        */

        [HttpPost]
        [ActionName("Jobs")]
        public ActionResult AddJob(JobCustom[] jobs)
        {
            DBInteraction.InsertJobs(jobs);
            return new HttpStatusCodeResult(200);
        }

        //[HttpDelete]
        //[ActionName("Jobs")]
        //public ActionResult RemoveJob(JobCustom[] jobs)
        //{
        //    DBInteraction.Job(Name, Surname, id);
        //    return new HttpStatusCodeResult(200);
        //}

        [HttpDelete]
        [ActionName("Jobs")]
        public ActionResult DeleteJobs(JobCustom[] jobs)
        {
            DBInteraction.DeleteJobs(jobs);
            return new HttpStatusCodeResult(200);
        }

        [HttpPost]
        [ActionName("UserJobs")]
        public ActionResult AddJob(UserJobCustom[] userJobs)
        {
            DBInteraction.InsertUserJobs(userJobs);
            return new HttpStatusCodeResult(200);
        }

        [HttpDelete]
        [ActionName("UserJobs")]
        public ActionResult DeleteUserJobs(UserJobCustom[] userJobs)
        {
            DBInteraction.DeleteUserJobs(userJobs);
            return new HttpStatusCodeResult(200);
        }


        [HttpPost]
        [ActionName("Organisations")]
        public ActionResult AddJob(OrganisationCustom[] orgs)
        {
            DBInteraction.InsertOrganisations(orgs);
            return new HttpStatusCodeResult(200);
        }

        [HttpDelete]
        [ActionName("Organisations")]
        public ActionResult DeleteOrganisations(OrganisationCustom[] orgs)
        {
            DBInteraction.DeleteOrganisations(orgs);
            return new HttpStatusCodeResult(200);
        }

        //[HttpPost]
        //[ActionName("Organisations")]
        //public ActionResult AddOrganisation(string id, string Name, string Surname)
        //{
        //    if (!string.IsNullOrWhiteSpace(id))
        //    {
        //        DBInteraction.AddJobToUser(Name, Surname, id);
        //    }
        //    return new HttpStatusCodeResult(200);
        //}

        //[HttpDelete]
        //[ActionName("Organisations")]
        //public ActionResult RemoveOrganisation(string id, string Name, string Surname)
        //{
        //    DBInteraction.RemoveJobFromUser(Name, Surname, id);
        //    return new HttpStatusCodeResult(200);
        //}

        // for testing purposes

        [HttpGet]
        [ActionName("fool")]
        public ActionResult Foo(int id, string q)
        {
            return Content("foo!" + id.ToString() + q);
        }

        public ActionResult Bar()
        {
            return Content("bar!");
        }
    }
}