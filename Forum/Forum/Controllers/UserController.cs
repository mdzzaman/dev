using Forum.Code;
using Forum.Entities;
using Forum.Hubs;
using Microsoft.AspNet.SignalR;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Security;

namespace Forum.Controllers
{
    [System.Web.Mvc.Authorize]
    public class UserController : ApiController
    {
        public HttpResponseMessage PostUserInfo()
        {
            var login = (CustomMembershipUser)Membership.GetUser(User.Identity.Name);
            MongoHelper<User> mongo = new MongoHelper<User>();
            IMongoQuery query = Query.EQ("_id", login.UserId);

            object list = mongo.Collection.Find(query).Select(s => new { Name = s.Name, userPic = s.ProfilePic == null ? "UserAvatar.png" : s.ProfilePic, userId = s._id.ToString() }).SingleOrDefault();

            return Request.CreateResponse(HttpStatusCode.OK, list);
            // return user;
        }

        public HttpResponseMessage PostBasicInfo()
        {
            var login = (CustomMembershipUser)Membership.GetUser(User.Identity.Name);
            MongoHelper<User> mongo = new MongoHelper<User>();
            IMongoQuery query = Query.EQ("_id", login.UserId);
            
            User user = mongo.Collection.Find(query).SingleOrDefault();

            return Request.CreateResponse(HttpStatusCode.OK, user);
           // return user;
        }

        public HttpResponseMessage PostEditBasicInfo(User user)
        {
            var login = (CustomMembershipUser)Membership.GetUser(User.Identity.Name);
            MongoHelper<User> mongo = new MongoHelper<User>();

            try
            {
                IMongoQuery query = Query.EQ("_id", login.UserId);
                IMongoUpdate update = MongoDB.Driver.Builders.Update.Set("Name", user.Name).Set("Location", user.Location).Set("DoB", user.DoB).Set("Password",user.Password);
                mongo.Collection.Update(query, update);
                return Request.CreateResponse(HttpStatusCode.OK, true);
            }
            catch (Exception e) 
            {
                return Request.CreateResponse(HttpStatusCode.OK, false);
            }
            

            
            //return true;
        }

        public HttpResponseMessage PostChangePassword(string newPass, string oldPass)
        {
            var login = (CustomMembershipUser)Membership.GetUser(User.Identity.Name);

            IMongoQuery query = Query.EQ("_id", login.UserId);
            IMongoUpdate update = Update.Set("Password", newPass);

            MongoHelper<User> mongo = new MongoHelper<User>();
            var user = mongo.Collection.Find(query).SingleOrDefault();
            if (user != null && user.Password == oldPass)
            {
                mongo.Collection.Update(query, update);
                return Request.CreateResponse(HttpStatusCode.OK, true);
            }
            else
                return Request.CreateResponse(HttpStatusCode.OK, false);
        }


        public HttpResponseMessage PostAddRequest(User user)
        {
            ObjectId requestId = ObjectId.Parse(user.Name);

            var login = (CustomMembershipUser)Membership.GetUser(User.Identity.Name);
            MongoHelper<User> mongo = new MongoHelper<User>();

            try
            {
                RequestsList req = new RequestsList();
                req.UserId = requestId;
                req.isViewd = false;


                IMongoQuery query = Query.EQ("_id", requestId);
                IMongoUpdate update = MongoDB.Driver.Builders.Update.PushWrapped("RequestsLists", req);
                mongo.Collection.Update(query, update);

                var userIdentity = mongo.Collection.Find(Query.EQ("_id", requestId)).SingleOrDefault();
                var context = GlobalHost.ConnectionManager.GetHubContext<Request>();
                context.Clients.Client(userIdentity.loginUserIdentity).addNewMessageToPage("Request","You have friend request");

                return Request.CreateResponse(HttpStatusCode.OK, true);
            }
            catch (Exception e)
            {
                return Request.CreateResponse(HttpStatusCode.OK, false);
            }

            //return true;
        }

        public HttpResponseMessage PostCancelRequest(User user)
        {
            ObjectId requestId = ObjectId.Parse(user.Name);

            var login = (CustomMembershipUser)Membership.GetUser(User.Identity.Name);
            MongoHelper<User> mongo = new MongoHelper<User>();

            try
            {
                IMongoQuery query = Query.EQ("_id", login.UserId);
                IMongoUpdate update = MongoDB.Driver.Builders.Update.Pull("RequestsLists", Query.EQ("UserId", requestId));
                mongo.Collection.Update(query, update);

                return Request.CreateResponse(HttpStatusCode.OK, true);
            }
            catch (Exception e)
            {
                return Request.CreateResponse(HttpStatusCode.OK, false);
            }

            //return true;
        }

        public HttpResponseMessage PostAcceptRequest(User user)
        {
            ObjectId requestId = ObjectId.Parse(user.Name);

            var login = (CustomMembershipUser)Membership.GetUser(User.Identity.Name);
            MongoHelper<User> mongo = new MongoHelper<User>();

            try
            {
                IMongoQuery query = Query.EQ("_id", login.UserId);
                IMongoUpdate update = MongoDB.Driver.Builders.Update.Pull("RequestsLists", Query.EQ("UserId", requestId));
                mongo.Collection.Update(query, update);

                IMongoUpdate update1 = MongoDB.Driver.Builders.Update.PushWrapped("FriendsLists", requestId);
                mongo.Collection.Update(query, update1);

                IMongoUpdate update3 = MongoDB.Driver.Builders.Update.PushWrapped("FriendsLists", requestId);
                mongo.Collection.Update(Query.EQ("_id", requestId), update3);

                var userIdentity = mongo.Collection.Find(Query.EQ("_id", requestId)).SingleOrDefault();
                var context = GlobalHost.ConnectionManager.GetHubContext<Request>();
                context.Clients.Client(userIdentity.loginUserIdentity).addNewMessageToPage("Accept", "Accept your request");

                return Request.CreateResponse(HttpStatusCode.OK, true);
            }
            catch (Exception e)
            {
                return Request.CreateResponse(HttpStatusCode.OK, false);
            }

            //return true;
        }

        public HttpResponseMessage PostRemoveFriend(User user)
        {
            ObjectId requestId = ObjectId.Parse(user.Name);

            var login = (CustomMembershipUser)Membership.GetUser(User.Identity.Name);
            MongoHelper<User> mongo = new MongoHelper<User>();

            try
            {
                IMongoQuery query = Query.EQ("_id", login.UserId);
                IMongoUpdate update = MongoDB.Driver.Builders.Update.Pull("FriendsLists", requestId);
                mongo.Collection.Update(query, update);

                return Request.CreateResponse(HttpStatusCode.OK, true);
            }
            catch (Exception e)
            {
                return Request.CreateResponse(HttpStatusCode.OK, false);
            }

            //return true;
        }

        public HttpResponseMessage PostLoadPendingFriends()
        {
            var login = (CustomMembershipUser)Membership.GetUser(User.Identity.Name);

            MongoHelper<User> mongoUser = new MongoHelper<User>();
            User users = new User();
            users = mongoUser.Collection.Find(Query.EQ("_id", login.UserId)).SingleOrDefault();

            List<object> list = new List<object>();

            if (users != null && users.RequestsLists.Count > 0)
            {
                foreach (var ex in users.RequestsLists)
                {
                    var uu = mongoUser.Collection.Find(Query.EQ("_id", ex.UserId)).SingleOrDefault();
                    list.Add(new
                    {
                        UserId = uu._id.ToString(),
                        Name = uu.Name,
                        UserPic = uu.ProfilePic == null ? "UserAvatar.png" : uu.ProfilePic,
                        totalFriends = uu.FriendsLists.Count,
                        IsMyFriend = false,
                        IsRequested = true
                    });
                }
            }

            return Request.CreateResponse(HttpStatusCode.OK, list);
        }

        public HttpResponseMessage PostLoadMyFriends()
        {
            var login = (CustomMembershipUser)Membership.GetUser(User.Identity.Name);

            MongoHelper<User> mongoUser = new MongoHelper<User>();
            User users = new User();
            users = mongoUser.Collection.Find(Query.EQ("_id", login.UserId)).SingleOrDefault();

            List<object> list = new List<object>();

            if (users != null && users.FriendsLists.Count > 0)
            {
                foreach (var ex in users.FriendsLists)
                {
                    var uu = mongoUser.Collection.Find(Query.EQ("_id", ex)).SingleOrDefault();
                    list.Add(new
                    {
                        UserId = uu._id.ToString(),
                        Name = uu.Name,
                        UserPic = uu.ProfilePic == null ? "UserAvatar.png" : uu.ProfilePic,
                        totalFriends = uu.FriendsLists.Count,
                        IsMyFriend = true,
                        IsRequested = false
                    });
                }
            }

            return Request.CreateResponse(HttpStatusCode.OK, list);
        }


        public HttpResponseMessage PostBasicFridnInfo(Temp temp)
        {
            //var login = (CustomMembershipUser)Membership.GetUser(User.Identity.Name);
            ObjectId id = ObjectId.Parse(temp.Name1);
            MongoHelper<User> mongo = new MongoHelper<User>();
            IMongoQuery query = Query.EQ("_id", id);

            User user = mongo.Collection.Find(query).SingleOrDefault();

            return Request.CreateResponse(HttpStatusCode.OK, user);
            // return user;
        }
    }
}
