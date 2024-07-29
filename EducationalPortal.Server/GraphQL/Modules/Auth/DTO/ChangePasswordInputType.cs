using GraphQL.Types;

namespace EducationalPortal.Server.GraphQL.Modules.Auth.DTO
{
    public class ChangePasswordInputType : InputObjectGraphType<ChangePassword>
    {
        public ChangePasswordInputType()
        {
            Field<NonNullGraphType<StringGraphType>>()
                .Name("OldPassword")
                .Resolve(context => context.Source.OldPassword);

            Field<NonNullGraphType<StringGraphType>>()
                .Name("NewPassword")
                .Resolve(context => context.Source.NewPassword);
        }
    }
}
