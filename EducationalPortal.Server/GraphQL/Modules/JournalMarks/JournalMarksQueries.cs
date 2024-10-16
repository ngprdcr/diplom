﻿using EducationalPortal.Business.Models;
using EducationalPortal.Business.Repositories;
using EducationalPortal.Server.Extensions;
using EducationalPortal.Server.GraphQL.Abstraction;
using EducationalPortal.Server.GraphQL.Modules.Auth;
using GraphQL;
using GraphQL.Types;

namespace EducationalPortal.Server.GraphQL.Modules.Users
{
    public class JournalMarksQueries : ObjectGraphType, IQueryMarker
    {
        public JournalMarksQueries(IServiceProvider serviceProvider, IHttpContextAccessor httpContextAccessor)
        {
            Field<NonNullGraphType<ListGraphType<NonNullGraphType<JournalMarkType>>>>()
                .Name("GetJournalMarks")
                .Argument<NonNullGraphType<GuidGraphType>>("SubjectId", "")
                .ResolveAsync(async context =>
                {
                    var subjectId = context.GetArgument<Guid>("SubjectId");

                    using var scope = serviceProvider.CreateScope();
                    var journalMarkRepository = scope.ServiceProvider.GetRequiredService<IJournalMarkRepository>();

                    return await journalMarkRepository.GetOrDefaultAsync(u => u.SubjectId == subjectId);
                })
                .AuthorizeWith(AuthPolicies.Teacher);

            Field<NonNullGraphType<JournalMarkGroupType>>()
                .Name("GetMyJournalMarkGroup")
                .Argument<NonNullGraphType<GuidGraphType>>("SubjectId", "")
                .ResolveAsync(async context =>
                {
                    var subjectId = context.GetArgument<Guid>("SubjectId");
                    var currentUserId = httpContextAccessor.HttpContext.GetUserId();
                    var currentUserRole = httpContextAccessor.HttpContext.GetRole();

                    using var scope = serviceProvider.CreateScope();
                    var journalMarkRepository = scope.ServiceProvider.GetRequiredService<IJournalMarkRepository>();

                    if (currentUserRole == Business.Enums.UserRoleEnum.Parent)
                    {
                        var userRepository = scope.ServiceProvider.GetRequiredService<IUserRepository>();
                        var children = await userRepository.GetOrDefaultAsync(u => u.MotherId == currentUserId || u.FatherId == currentUserId);

                        if (children.Count == 0)
                            return Array.Empty<JournalMarkModel>();

                        IEnumerable<JournalMarkModel> journalMarks = new List<JournalMarkModel>();

                        foreach (var child in children)
                        {
                            var marks = await journalMarkRepository.GetOrDefaultAsync(u => u.SubjectId == subjectId && u.StudentId == child.Id);
                            journalMarks = journalMarks.Concat(marks);
                        }

                        return new JournalMarkGroupSource(children, journalMarks.ToList());
                    }

                    return await journalMarkRepository.GetOrDefaultAsync(u => u.SubjectId == subjectId && u.StudentId == currentUserId);
                })
                .AuthorizeWith(AuthPolicies.Student);
        }
    }
}
