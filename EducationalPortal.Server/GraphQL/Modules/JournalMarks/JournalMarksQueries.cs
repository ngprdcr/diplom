using EducationalPortal.Business.Repositories;
using EducationalPortal.Server.GraphQL.Abstraction;
using EducationalPortal.Server.GraphQL.Modules.Auth;
using GraphQL;
using GraphQL.Types;

namespace EducationalPortal.Server.GraphQL.Modules.Users
{
    public class JournalMarksQueries : ObjectGraphType, IQueryMarker
    {
        public JournalMarksQueries(IJournalMarkRepository journalMarkRepository)
        {
            Field<NonNullGraphType<ListGraphType<JournalMarksType>>>()
                .Name("GetJournalMark")
                .Argument<NonNullGraphType<GuidGraphType>>("SubjectId", "")
                .ResolveAsync(async context =>
                {
                    var subjectId = context.GetArgument<Guid>("SubjectId");
                    return await journalMarkRepository.GetAsync(u => u.SubjectId == subjectId);
                })
                .AuthorizeWith(AuthPolicies.Teacher);

        }
    }
}
