using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MvcApplication1.Controllers
{
    public class HomeController : Controller
    {

        public ActionResult Static(string file)
        {
            
            if (file == null) file = "index.html";
            var ext = file.Split('.').Last();
            return new FilePathResult("~/Content/Static/" + file, ext);
        }

        public ActionResult Index(string id)
        {
            if (id == null) id = "index.html";
            var ext = id.Split('.').Last();
            return new FilePathResult("~/Content/Static/" + id, ext);
        }

        //public ActionResult Index()
        //{
        //    //ViewBag.Message = "Modify this template to jump-start your ASP.NET MVC application.";
        //    //var result = new FilePathResult("Content/Static/index.html", "html");
        //    return View();
        //}

        public ActionResult About()
        {
            ViewBag.Message = "Your app description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}
