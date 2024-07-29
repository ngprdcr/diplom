using EducationalPortal.Server.GraphQL.Abstraction;
using GraphQL.Types;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EducationalPortal.Server.GraphQL
{
    public class Mutations : ObjectGraphType
    {
        public Mutations(IEnumerable<IMutationMarker> clientMutationMarkers)
        {
            Name = "Mutations";

            foreach (var clientMutationMarker in clientMutationMarkers)
            {
                var marker = clientMutationMarker as ObjectGraphType<object>;
                foreach (var field in marker.Fields)
                    AddField(field);
            }
        }
    }
}
