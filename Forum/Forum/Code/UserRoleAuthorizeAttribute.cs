using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Forum.Code
{
    public class UserRoleAuthorizeAttribute : System.Web.Mvc.AuthorizeAttribute
    {
        public UserRoleAuthorizeAttribute() { }

        public UserRoleAuthorizeAttribute(params UserRole[] roles)
        {
            Roles = string.Join(",", roles.Select(r => r.ToString()));
        }
    }

    public enum UserRole
    {
        Administrator = 1,
        User = 2
    }
}