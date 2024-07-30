using EducationalPortal.Business.Repositories;
using EducationalPortal.Server.GraphQL.Abstraction;
using EducationalPortal.Server.GraphQL.Modules.Auth;
using GraphQL;
using GraphQL.Types;

namespace EducationalPortal.Server.GraphQL.Modules.Users
{
    public class JournalMarksQueries : ObjectGraphType, IQueryMarker
    {
        public JournalMarksQueries(IServiceProvider serviceProvider)
        {
            Field<NonNullGraphType<ListGraphType<NonNullGraphType<JournalMarksType>>>>()
                .Name("GetJournalMarks")
                .Argument<NonNullGraphType<GuidGraphType>>("SubjectId", "")
                .ResolveAsync(async context =>
                {
                    var subjectId = context.GetArgument<Guid>("SubjectId");

                    using var scope = serviceProvider.CreateScope();
                    var journalMarkRepository = scope.ServiceProvider.GetRequiredService<IJournalMarkRepository>();

                    return await journalMarkRepository.GetAsync(u => u.SubjectId == subjectId);
                })
                .AuthorizeWith(AuthPolicies.Teacher);

        }
    }
}
