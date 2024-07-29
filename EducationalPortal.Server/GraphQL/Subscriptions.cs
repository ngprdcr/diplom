using EducationalPortal.Server.GraphQL.Abstraction;
using GraphQL.Types;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EducationalPortal.Server.GraphQL
{
    public class Subscriptions : ObjectGraphType
    {
        public Subscriptions(IEnumerable<ISubscriptionMarker> clientSubscriptionMarkers)
        {
            Name = "Subscriptions";

            foreach (var clientSubscriptionMarker in clientSubscriptionMarkers)
            {
                var marker = clientSubscriptionMarker as ObjectGraphType<object>;
                foreach (var field in marker.Fields)
                    AddField(field);
            }
        }
    }
}
