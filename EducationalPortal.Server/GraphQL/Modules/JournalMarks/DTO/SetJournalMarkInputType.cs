using GraphQL.Types;

namespace EducationalPortal.Server.GraphQL.Modules.Users.DTO
{
    public class SetJournalMarkInputType : InputObjectGraphType<SetJournalMarkInput>
    {
        public SetJournalMarkInputType()
        {
            Field<IdGraphType>()
                .Name("Id")
                .Resolve(context => context.Source.Id);

            Field<NonNullGraphType<IntGraphType>>()
                .Name("Mark")
                .Resolve(context => context.Source.Mark);

            Field<NonNullGraphType<IdGraphType>, Guid>()
               .Name("StudentId")
               .Resolve(context => context.Source.StudentId);


            Field<NonNullGraphType<IdGraphType>, Guid>()
               .Name("SubjectId")
               .Resolve(context => context.Source.SubjectId);

            Field<NonNullGraphType<DateTimeGraphType>>()
               .Name("Date")
               .Resolve(context => context.Source.Date);

        }
    }

    public record SetJournalMarkInput(Guid? Id, int Mark, Guid StudentId, Guid SubjectId, DateTime Date);
}
