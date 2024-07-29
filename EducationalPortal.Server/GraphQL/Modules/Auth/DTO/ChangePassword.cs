namespace EducationalPortal.Server.GraphQL.Modules.Auth.DTO
{
    public class ChangePassword
    {
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }
    }
}
