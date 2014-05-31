using Forum.Code;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace Forum.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index(string returnUrl)
        {
            //var login = (CustomMembershipUser)Membership.GetUser(User.Identity.Name);

            ViewBag.ReturnUrl = returnUrl;
            return View();
        }
    }
}