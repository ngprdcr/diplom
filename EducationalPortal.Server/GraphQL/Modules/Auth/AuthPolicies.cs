using EducationalPortal.Business.Enums;

namespace EducationalPortal.Server.GraphQL.Modules.Auth
{
    public class AuthPolicies
    {
        public static readonly string Authenticated = "Authenticated";
        public static readonly string Student = UserRoleEnum.Student.ToString();
        public static readonly string Teacher = UserRoleEnum.Teacher.ToString();
        public static readonly string Parent = UserRoleEnum.Parent.ToString();
        public static readonly string Administrator = UserRoleEnum.Administrator.ToString();
    }
}
