using EducationalPortal.Business.Enums;
using EducationalPortal.Server.GraphQL.Modules.Auth;

namespace EducationalPortal.Server.Extensions
{
    public static class HttpContextExtensions
    {
        public static Guid GetUserId(this HttpContext httpContext)
        {
            return new Guid(httpContext.User.Claims.First(c => c.Type == AuthClaimsIdentity.DefaultIdClaimType).Value);
        }
        
        public static string GetUserLogin(this HttpContext httpContext)
        {
            return httpContext.User.Claims.First(c => c.Type == AuthClaimsIdentity.DefaultLoginClaimType).Value;
        }

        public static UserRoleEnum GetRole(this HttpContext httpContext)
        {
            UserRoleEnum userRoleEnum;
            if(!Enum.TryParse(httpContext.User.Claims.First(c => c.Type == AuthClaimsIdentity.DefaultRoleClaimType).Value, out userRoleEnum))
            {
                throw new Exception("Bad role");
            }
            return userRoleEnum;
        }
    }
}
