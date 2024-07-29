using EducationalPortal.Business.Models;
using EducationalPortal.Server.GraphQL.Modules.Users;
using GraphQL.Types;

namespace EducationalPortal.Server.GraphQL.Modules.Auth.DTO
{
    public class AuthResponseType : ObjectGraphType<AuthResponse>
    {
        public AuthResponseType()
        {
            Field<NonNullGraphType<UserType>, UserModel>()
                .Name("User")
                .Resolve(context => context.Source.User);

            Field<NonNullGraphType<StringGraphType>, string>()
                .Name("Token")
                .Resolve(context => context.Source.Token);
        }
    }
}
