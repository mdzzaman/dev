using Forum.Code;
using Forum.Entities;
using MongoDB.Driver;
using MongoDB.Driver.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Security;

namespace Forum.Controllers
{
    public class SearchController : ApiController
    {
        public HttpResponseMessage PostUserSearch(User search)
        {
            var login = (CustomMembershipUser)Membership.GetUser(User.Identity.Name);

            MongoHelper<User> mongoUser = new MongoHelper<User>();
            List<User> users = new List<Entities.User>();
            if (search.Email != null)
                users = mongoUser.Collection.Find(Query.EQ("Email", search.Email)).ToList();
            else if (search.Name != null)
                users = mongoUser.Collection.Find(Query.Matches("Name", search.Name)).ToList();

            List<object> list = new List<object>();

            if (users.Count > 0) {
                foreach (var ex in users) {
                    if (ex._id == login.UserId)
                        continue;

                    var friend = ex.FriendsLists.Where(e => e == login.UserId).SingleOrDefault();
                    var request = ex.RequestsLists.Where(e => e.UserId == login.UserId).SingleOrDefault();

                    list.Add(new
                    {
                        UserId = ex._id.ToString(),
                        Name = ex.Name,
                        UserPic = ex.ProfilePic == null ? "UserAvatar.png" : ex.ProfilePic,
                        totalFriends = ex.FriendsLists.Count,
                        IsMyFriend = friend.Pid == 0 ? false : true,
                        IsRequested = request == null ? false : true
                    });
                }
            }
           
            return Request.CreateResponse(HttpStatusCode.OK, list);
        }
    }
}
