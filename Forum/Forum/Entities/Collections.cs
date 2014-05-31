using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Forum.Entities
{
    public class User
    {
        [BsonId]
        public ObjectId _id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public Int32 Status { get; set; }
        public string Location { get; set; }
        public DateTime? DoB { get; set; }
        public DateTime? CreatedAt { get; set; }
        public string ProfilePic { get; set; }
        public int Gender { get; set; }
        public List<RequestsList> RequestsLists { get; set; }
        public List<ObjectId> FriendsLists { get; set; }
        public List<ObjectId> BlockLists { get; set; }
        public List<SubPost> PostLists { get; set; }
        public int TotalPosts { get; set; }
        public string loginUserIdentity { get; set; }
    }


    public class OAuthMembership
    {
        [BsonId]
        public ObjectId _id { get; set; }
        public string Provider { get; set; }
        public string ProviderUserId { get; set; }
        public ObjectId UserId { get; set; }
    }

    public class UserPost
    {
        [BsonId]
        public ObjectId _id { get; set; }
        public string Text { get; set; }
        public List<ObjectId> LikeLists { get; set; }
        public ObjectId UserId { get; set; }
        public List<ObjectId> HideList { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<Comment> Comments { get; set; }
    }

    public class Comment
    {
        [BsonId]
        public ObjectId _id { get; set; }
        public string Text { get; set; }
        public List<ObjectId> LikeLists { get; set; }
        public ObjectId UserId { get; set; }
        public DateTime CreatedAt { get; set; }
    
    }

    // =============================================
    public class RequestsList
    {
        public ObjectId UserId { get; set; }
        public bool isViewd { get; set; }
    }

    public class SubPost
    {
        public ObjectId PostId {get; set;}
        public ObjectId UserId {get; set;}
        public bool isMine {get;set;}
        public bool isViewed {get; set;}
        public bool isHide { get; set; }
        public DateTime CreatedAt { get; set; }
    }


    public class Temp
    {
        public string Name1 { get; set; }
        public string Name2 { get; set; }
        public string Text { get; set; }
    }

}