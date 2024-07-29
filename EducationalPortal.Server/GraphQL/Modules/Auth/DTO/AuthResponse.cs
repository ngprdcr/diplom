using EducationalPortal.Business.Models;

namespace EducationalPortal.Server.GraphQL.Modules.Auth.DTO
{
    public class AuthResponse
    {
        public UserModel User { get; set; }
        public string Token { get; set; }
    }
}
