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
        [ActionName("")]
        public ActionResult Get()
        {
            using (var ctx = new SimpleContext())
            {
                var users = ctx.Users.Select(item => new { item.ID,item.Name,item.OrganisationID,item.Surname }).ToList();
                return Json(users, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        [ActionName("foo")]
        public ActionResult Foo()
        {
            return Content("bar!");
        }

        public ActionResult Bar()
        {
            return Content("bar!");
        } 

    }
}
