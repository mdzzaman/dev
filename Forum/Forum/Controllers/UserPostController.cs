using Forum.Code;
using Forum.Entities;
using MongoDB.Bson;
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
    [Authorize]
    public class UserPostController : ApiController
    {
        public HttpResponseMessage PostAddStatus(UserPost post)
        {
            var login = (CustomMembershipUser)Membership.GetUser(User.Identity.Name);

            MongoHelper<UserPost> mongo = new MongoHelper<UserPost>();
            post.UserId = login.UserId;
            post.CreatedAt = DateTime.Now;
            post.LikeLists = new List<ObjectId>();
            post.Comments = new List<Comment>();
            mongo.Collection.Insert(post);

            MongoHelper<User> user = new MongoHelper<User>();
            SubPost subPost = new SubPost();
            subPost.PostId = post._id;
            subPost.UserId = login.UserId;
            subPost.isViewed = true;
            subPost.isMine = true;
            subPost.CreatedAt = post.CreatedAt;

            IMongoQuery query = Query.EQ("_id", login.UserId);
            IMongoUpdate update = MongoDB.Driver.Builders.Update.PushWrapped("PostLists", subPost).Inc("TotalPosts", 1);
            user.Collection.Update(query, update);


            var us = user.Collection.Find(Query.EQ("_id", login.UserId)).SingleOrDefault().FriendsLists;

            if (us.Count > 0)
            {
                foreach (var ex in us) {
                    IMongoQuery query1 = Query.EQ("_id", ex);
                    IMongoUpdate update1 = MongoDB.Driver.Builders.Update.PushWrapped("PostLists", subPost).Inc("TotalPosts", 1);
                    user.Collection.Update(query1, update1);
                }
            }

            var uu = user.Collection.Find(Query.EQ("_id", login.UserId)).SingleOrDefault();
            return Request.CreateResponse(HttpStatusCode.OK, new
            {
                postUser = uu.Name,
                PostId = post._id.ToString(),
                UserId = uu._id.ToString(),
                totalLikes = 0,
                userPic = uu.ProfilePic == null ? "UserAvatar.png" : uu.ProfilePic,
                text = post.Text,
                createdAt = post.CreatedAt.ToString("dd MMM yyyy HH:mm"),
                CommentCount = 0,
                isLike = false
            });
        }

        public HttpResponseMessage PostLoadPosts()
        {
            var login = (CustomMembershipUser)Membership.GetUser(User.Identity.Name);

            //MongoHelper<UserPost> mongo = new MongoHelper<UserPost>();
            //post.UserId = login.UserId;
            //post.CreatedAt = DateTime.Now;
            //mongo.Collection.Insert(post);

            List<object> list = new List<object>();

            MongoHelper<User> mongoUser = new MongoHelper<User>();
            MongoHelper<UserPost> mongoPosts = new MongoHelper<UserPost>();
            



            User user = mongoUser.Collection.Find(Query.EQ("_id", login.UserId)).SingleOrDefault();
            user.PostLists = user.PostLists.Where(e => e.isHide == false).Take(10).OrderByDescending(e => e.CreatedAt).ToList();

           List<UserPost> posts=new  List<UserPost>();
            int i = 0;
            if (user != null && user.PostLists.Count > 0)
            {
                var objs=new BsonValue[user.PostLists.Count];
                foreach (var ex in user.PostLists)
                {                    
                    objs[i]=ex.PostId;
                    i++;
                }
                posts = mongoPosts.Collection.Find(Query.In("_id", objs)).ToList();
            }

            if (posts.Count > 0) {
                foreach(var ex in posts){

                    var like = ex.LikeLists.Where(e => e == user._id).SingleOrDefault();
                    if (ex.UserId == user._id)
                        list.Add(new
                        {
                            postUser = user.Name,
                            PostId = ex._id.ToString(),
                            UserId = user._id.ToString(),
                            totalLikes = ex.LikeLists.Count,
                            userPic = user.ProfilePic == null ? "UserAvatar.png" : user.ProfilePic,
                            text = ex.Text,
                            createdAt = ex.CreatedAt.ToString("dd MMM yyyy HH:mm"),
                            CommentCount = ex.Comments.Count,
                            isLike = like.Pid == 0 ? false : true
                        });
                    else
                    {
                        var uu = mongoUser.Collection.Find(Query.EQ("_id", ex.UserId)).SingleOrDefault();
                        list.Add(new
                        {
                            postUser = uu.Name,
                            PostId = ex._id.ToString(),
                            UserId = uu._id.ToString(),
                            totalLikes = ex.LikeLists.Count,
                            userPic = uu.ProfilePic == null ? "UserAvatar.png" : uu.ProfilePic,
                            text = ex.Text,
                            createdAt = ex.CreatedAt.ToString("dd MMM yyyy HH:mm"),
                            CommentCount = ex.Comments.Count,
                            isLike = like.Pid == 0 ? false : true
                        });
                    }
            
                }
            }

            return Request.CreateResponse(HttpStatusCode.OK, list);
        }

        public HttpResponseMessage PostAddComment(Temp temp)
        {
            ObjectId PostId = ObjectId.Parse(temp.Name1);

            var login = (CustomMembershipUser)Membership.GetUser(User.Identity.Name);

            MongoHelper<UserPost> mongoPost = new MongoHelper<UserPost>();


            Comment comm = new Comment();
            comm._id = ObjectId.GenerateNewId();
            comm.Text = temp.Text;
            comm.UserId = login.UserId;
            comm.CreatedAt = DateTime.Now;
            comm.LikeLists = new List<ObjectId>();

            IMongoQuery query = Query.EQ("_id", PostId);
            IMongoUpdate update = MongoDB.Driver.Builders.Update.PushWrapped("Comments", comm);
            mongoPost.Collection.Update(query, update);

            return Request.CreateResponse(HttpStatusCode.OK, new {
                commentId = comm._id.ToString(),
                totalLikes = 0,
                text = comm.Text,
                createdAt = comm.CreatedAt.ToString("dd MMM yyyy HH:mm")
            });
        }

        public HttpResponseMessage PostLikePost(Temp temp)
        {
            ObjectId PostId = ObjectId.Parse(temp.Name1);

            var login = (CustomMembershipUser)Membership.GetUser(User.Identity.Name);

            MongoHelper<UserPost> mongoPost = new MongoHelper<UserPost>();
            IMongoQuery query = Query.EQ("_id", PostId);

            var post = mongoPost.Collection.Find(query).SingleOrDefault();
            var id = post.LikeLists.Where(e => e == login.UserId).SingleOrDefault();
            if (id.Pid == 0)
            {
                IMongoUpdate update = MongoDB.Driver.Builders.Update.PushWrapped("LikeLists", login.UserId);
                mongoPost.Collection.Update(query, update);
            }
            else {
                IMongoUpdate update = MongoDB.Driver.Builders.Update.Pull("LikeLists", login.UserId);
                mongoPost.Collection.Update(query, update);
            }

            return Request.CreateResponse(HttpStatusCode.OK, true);
        }

        public HttpResponseMessage PostLoadComments(Temp temp)
        {
            var login = (CustomMembershipUser)Membership.GetUser(User.Identity.Name);

            ObjectId PostId = ObjectId.Parse(temp.Name1);

            List<object> list = new List<object>();

            MongoHelper<User> mongoUser = new MongoHelper<User>();
            MongoHelper<UserPost> mongoPosts = new MongoHelper<UserPost>();

            var post = mongoPosts.Collection.Find(Query.EQ("_id", PostId)).SingleOrDefault();

            if (post != null && post.Comments.Count > 0)
            {
                foreach (var ex in post.Comments)
                {
                    var uu = mongoUser.Collection.Find(Query.EQ("_id", ex.UserId)).SingleOrDefault();
                    list.Add(new
                    {
                        postUser = uu.Name,
                        commentId = ex._id.ToString(),
                        userId = ex.UserId.ToString(),
                        totalLikes = ex.LikeLists.Count,
                        userPic = uu.ProfilePic == null ? "UserAvatar.png" : uu.ProfilePic,
                        text = ex.Text,
                        createdAt = ex.CreatedAt.ToString("dd MMM yyyy HH:mm")
                    });
                }
            }
            return Request.CreateResponse(HttpStatusCode.OK, list);
        }

        public HttpResponseMessage PostLoadPostLikes(Temp temp)
        {
            var login = (CustomMembershipUser)Membership.GetUser(User.Identity.Name);

            ObjectId PostId = ObjectId.Parse(temp.Name1);

            List<object> list = new List<object>();

            MongoHelper<User> mongoUser = new MongoHelper<User>();
            MongoHelper<UserPost> mongoPosts = new MongoHelper<UserPost>();

            var post = mongoPosts.Collection.Find(Query.EQ("_id", PostId)).SingleOrDefault();

            if (post != null && post.LikeLists.Count > 0)
            {
                foreach (var ex in post.LikeLists)
                {
                    var uu = mongoUser.Collection.Find(Query.EQ("_id", ex)).SingleOrDefault();
                    list.Add(new
                    {
                        postUser = uu.Name,
                        userId = uu._id.ToString(),
                        userPic = uu.ProfilePic == null ? "UserAvatar.png" : uu.ProfilePic
                    });
                }
            }
            return Request.CreateResponse(HttpStatusCode.OK, list);
        }
    }
}
