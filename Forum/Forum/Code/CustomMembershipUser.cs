using Forum.Entities;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Security;

namespace Forum.Code
{
    public class CustomMembershipUser : MembershipUser
    {
        #region Properties

        public string Email { get; set; }

        public ObjectId UserId { get; set; }

        #endregion

        public CustomMembershipUser(User user)
            : base("CustomMembershipProvider", user.Email, user._id, user.Email, string.Empty, string.Empty, true, false, DateTime.Now, DateTime.Now, DateTime.Now, DateTime.Now, DateTime.Now)
        {
            Email = user.Email;
            UserId = user._id;
            //UserRoleName = "admin";
            //UserRoleId = user.UserRoleId;
            //UserRoleName = user.UserRole.UserRoleName.Trim();
        }
    }
}