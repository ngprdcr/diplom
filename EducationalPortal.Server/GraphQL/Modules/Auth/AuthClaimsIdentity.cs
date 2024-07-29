using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace EducationalPortal.Server.GraphQL.Modules.Auth
{
    public class AuthClaimsIdentity : ClaimsIdentity
    {
        public const string DefaultIdClaimType = "Id";
        public const string DefaultLoginClaimType = "Login";
    }
}
