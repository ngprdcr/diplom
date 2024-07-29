using EducationalPortal.Business.Models;
using EducationalPortal.Business.Repositories;
using EducationalPortal.Server.GraphQL.Abstraction;
using EducationalPortal.Server.GraphQL.Modules.Auth;
using EducationalPortal.Server.GraphQL.Modules.Users.DTO;
using GraphQL;
using GraphQL.Types;

namespace EducationalPortal.Server.GraphQL.Modules.Users
{
    public class JournalMarksMutations : ObjectGraphType, IMutationMarker
    {
        public JournalMarksMutations(IJournalMarkRepository journalMarkRepository)
        {
            Field<NonNullGraphType<BooleanGraphType>>()
                .Name("SetJournalMark")
                .Argument<NonNullGraphType<SetJournalMarkInputType>>("Input", "")
                .ResolveAsync(async context =>
                {
                    var input = context.GetArgument<SetJournalMarkInput>("Input");


                    if (input.Id == null)
                    {
                        var journalMark = new JournalMarkModel
                        {
                            Id = Guid.NewGuid(),
                            Mark = input.Mark,
                            StudentId = input.StudentId,
                            SubjectId = input.SubjectId,
                            Date = input.Date,
                        };
                        await journalMarkRepository.CreateAsync(journalMark);
                    }
                    else
                    {
                        var journalMark = await journalMarkRepository.GetByIdAsync(input.Id);

                        journalMark.Mark = input.Mark;
                        journalMark.StudentId = input.StudentId;

                        await journalMarkRepository.UpdateAsync(journalMark);
                    }

                    return true;
                })
                .AuthorizeWith(AuthPolicies.Teacher);
        }
    }
}
