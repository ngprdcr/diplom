using EducationalPortal.Business.Models;
using GraphQL.Types;

namespace EducationalPortal.Server.GraphQL.Modules.Users.DTO
{
    public class CreateJournalMarkInputType : InputObjectGraphType<JournalMarkModel>
    {
        public CreateJournalMarkInputType()
        {
            Field<NonNullGraphType<IntGraphType>>()
                .Name("Mark")
                .Resolve(context => context.Source.Mark);

            Field<IdGraphType, Guid?>()
               .Name("SubjectId")
               .Resolve(context => context.Source.SubjectId);

            Field<IdGraphType, Guid?>()
               .Name("StidentId")
               .Resolve(context => context.Source.StudentId);
        }
    }
}
