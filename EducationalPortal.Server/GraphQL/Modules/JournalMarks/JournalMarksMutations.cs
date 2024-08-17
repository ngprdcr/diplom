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
        public JournalMarksMutations(IJournalMarkRepository journalMarkRepository, IHomeworkRepository homeworkRepository)
        {
            Field<NonNullGraphType<BooleanGraphType>>()
                .Name("SetJournalMark")
                .Argument<NonNullGraphType<SetJournalMarkInputType>>("Input", "")
                .ResolveAsync(async context =>
                {
                    var input = context.GetArgument<SetJournalMarkInput>("Input");
                    JournalMarkModel journalMark;

                    if (input.Id == null)
                    {
                        journalMark = new JournalMarkModel
                        {
                            Id = Guid.NewGuid(),
                            Mark = input.Mark,
                            Type = input.Type,
                            StudentId = input.StudentId,
                            SubjectId = input.SubjectId,
                            Date = new DateTime(input.Date.Year, input.Date.Month, input.Date.Day),
                        };
                        await journalMarkRepository.CreateAsync(journalMark);
                    }
                    else
                    {
                        journalMark = await journalMarkRepository.GetByIdAsync(input.Id);

                        journalMark.Mark = input.Mark;
                        journalMark.StudentId = input.StudentId;

                        await journalMarkRepository.UpdateAsync(journalMark);
                    }

                    if (journalMark.Type == JournalMarkKind.Homework)
                    {
                        var homeworks = await homeworkRepository.GetOrDefaultAsync(
                            h => h.SubjectPost.Subject.Id == journalMark.SubjectId
                                && h.StudentId == journalMark.StudentId
                                && h.CreatedAt.Date == journalMark.Date.Date,
                            h => h.SubjectPost);

                        if (homeworks.Count > 0)
                        {
                            var homework = homeworks[0];
                            homework.Mark = journalMark.Mark;
                            await homeworkRepository.UpdateAsync(homework);
                        }
                    }

                    return true;
                })
                .AuthorizeWith(AuthPolicies.Teacher);
        }
    }
}
