using EducationalPortal.Business.Enums;
using EducationalPortal.Business.Models;
using GraphQL.Types;

namespace EducationalPortal.Server.GraphQL.Modules.Users.DTO
{
    public class CreateUserInputType : InputObjectGraphType<UserModel>
    {
        public CreateUserInputType()
        {
            Field<NonNullGraphType<StringGraphType>, string>()
                .Name("FirstName")
                .Resolve(context => context.Source.FirstName);

            Field<NonNullGraphType<StringGraphType>, string>()
               .Name("LastName")
               .Resolve(context => context.Source.LastName);

            Field<NonNullGraphType<StringGraphType>, string>()
               .Name("MiddleName")
               .Resolve(context => context.Source.MiddleName);

            Field<NonNullGraphType<StringGraphType>, string>()
               .Name("Login")
               .Resolve(context => context.Source.Login);

            Field<NonNullGraphType<StringGraphType>, string>()
               .Name("Password")
               .Resolve(context => context.Source.Password);

            Field<StringGraphType, string>()
               .Name("Email")
               .Resolve(context => context.Source.Email);

            Field<StringGraphType, string>()
               .Name("PhoneNumber")
               .Resolve(context => context.Source.PhoneNumber);

            Field<DateTimeGraphType, DateTime>()
               .Name("DateOfBirth")
               .Resolve(context => context.Source.DateOfBirth);

            Field<NonNullGraphType<UserRoleType>, UserRoleEnum>()
               .Name("Role")
               .Resolve(context => context.Source.Role);

            Field<IdGraphType, Guid?>()
               .Name("GradeId")
               .Resolve(context => context.Source.GradeId);
        }
    }
}
