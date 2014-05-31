using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using System.Threading.Tasks;
using Forum.Entities;
using MongoDB.Driver;
using MongoDB.Driver.Builders;
using Forum.Code;
using System.Web.Security;
using MongoDB.Bson;

namespace Forum.Hubs
{
    [Authorize]
    public class Request : Hub
    {
        public void Send(string Id, string Identity)
        {
            MongoHelper<User> mongo = new MongoHelper<User>();
            IMongoQuery query = Query.EQ("_id", ObjectId.Parse(Id));
            IMongoUpdate update = MongoDB.Driver.Builders.Update.Set("loginUserIdentity", Identity);
            mongo.Collection.Update(query, update);


        }
    }
}