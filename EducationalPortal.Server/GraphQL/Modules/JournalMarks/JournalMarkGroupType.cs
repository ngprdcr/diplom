using EducationalPortal.Business.Models;
using GraphQL.Types;

namespace EducationalPortal.Server.GraphQL.Modules.Users
{
    public class JournalMarkGroupType : ObjectGraphType<JournalMarkGroupSource>
    {
        public JournalMarkGroupType()
        {
            Field<NonNullGraphType<ListGraphType<NonNullGraphType<UserType>>>>()
               .Name("Children")
               .Resolve(context => context.Source.Children);

            Field<NonNullGraphType<ListGraphType<NonNullGraphType<JournalMarkType>>>>()
               .Name("JournalMarks")
               .Resolve(context => context.Source.JournalMarks);
        }
    }

    public record JournalMarkGroupSource(List<UserModel> Children, List<JournalMarkModel> JournalMarks);
}
