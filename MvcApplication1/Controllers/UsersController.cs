using DBManager;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MvcApplication1.Controllers
{
    public class UsersController : Controller
    {
        [HttpGet]
        public ActionResult Common()
        {
            using (var ctx = new SimpleContext())
            {
                var users = ctx.Users.Select(item => new { item.ID, item.Name, item.OrganisationID, item.Surname }).ToList();
                return Json(users, JsonRequestBehavior.AllowGet);
            }
            //var task = DBInteraction.GetAllUsersTextAsync();
            //var users = task.Result;
            //var users = DBInteraction.GetAllUsersText().Select })
            //return Json(users, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult Organisations()
        {
            using (var ctx = new SimpleContext())
            {
                var orgs = ctx.Organisations.Select(item => new { item.ID, item.Name }).ToList();
                return Json(orgs, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public ActionResult Jobs()
        {
            using (var ctx = new SimpleContext())
            {
                var jobs = ctx.Jobs.Select(item => new { item.ID, item.Name }).ToList();
                return Json(jobs, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public ActionResult UserJobs()
        {
            using (var ctx = new SimpleContext())
            {
                var userJobs = ctx.UserJobs.Select(item => new { item.ID, UserID = item.User.ID, JobID = item.Job.ID }).ToList();
                return Json(userJobs, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public ActionResult Common(string Name, string Surname, string Organisation, string Jobs)
        {
            DBInteraction.InsertUser(Name, Surname, Organisation, Jobs.Split(','));
            return new HttpStatusCodeResult(200);
        }

        [HttpDelete]
        public ActionResult Common(string Name, string Surname)
        {
            DBInteraction.RemoveUser(Name, Surname);
            return new HttpStatusCodeResult(200);
        }

        [HttpPost]
        [ActionName("Jobs")]
        public ActionResult AddJob(string id, string Name, string Surname)
        {
            DBInteraction.AddJobToUser(Name, Surname, id);
            return new HttpStatusCodeResult(200);
        }

        [HttpDelete]
        [ActionName("Jobs")]
        public ActionResult RemoveJob(string id, string Name, string Surname)
        {
            DBInteraction.RemoveJobFromUser(Name, Surname, id);
            return new HttpStatusCodeResult(200);
        }

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
