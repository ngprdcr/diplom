﻿using EducationalPortal.Server.GraphQL.Abstraction;
using GraphQL.Types;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EducationalPortal.Server.GraphQL
{
    public class Queries : ObjectGraphType
    {
        public Queries(IEnumerable<IQueryMarker> clientQueryMarkers)
        {
            Name = "Queries";

            foreach (var clientQueryMarker in clientQueryMarkers)
            {
                var marker = clientQueryMarker as ObjectGraphType<object>;
                foreach (var field in marker.Fields)
                    AddField(field);
            }
        }
    }
}
