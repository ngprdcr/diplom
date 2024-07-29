using EducationalPortal.Business.Models;
using EducationalPortal.Server.GraphQL.Abstraction;
using GraphQL.Types;

namespace EducationalPortal.Server.GraphQL.Modules.Users
{
    public class JournalMarksType : BaseType<JournalMarkModel>
    {
        public JournalMarksType(IServiceProvider serviceProvider) : base()
        {
            Field<NonNullGraphType<IntGraphType>>()
               .Name("Mark")
               .Resolve(context => context.Source.Mark);

            Field<NonNullGraphType<DateTimeGraphType>>()
               .Name("Date")
               .Resolve(context => context.Source.Date);

        }
    }


}
