using EducationalPortal.Business.Models;
using EducationalPortal.Server.GraphQL.Abstraction;
using GraphQL.Types;

namespace EducationalPortal.Server.GraphQL.Modules.Users
{
    public class JournalMarksType : BaseType<JournalMarkModel>
    {
        public JournalMarksType(IServiceProvider serviceProvider) : base()
        {
            Field<IntGraphType>()
               .Name("Mark")
               .Resolve(context => context.Source.Mark);

            Field<NonNullGraphType<DateOnlyGraphType>>()
               .Name("Date")
               .Resolve(context => new DateOnly(context.Source.Date.Year, context.Source.Date.Month, context.Source.Date.Day));

            Field<NonNullGraphType<JournalMarkKindType>>()
               .Name("Type")
               .Resolve(context => context.Source.Type);

            Field<NonNullGraphType<GuidGraphType>>()
               .Name("StudentId")
               .Resolve(context => context.Source.StudentId);
        }
    }
}
