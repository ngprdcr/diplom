using EducationalPortal.Business.Abstractions;
using EducationalPortal.Business.Enums;
using EducationalPortal.Business.Models;
using EducationalPortal.Business.Repositories;
using EducationalPortal.Server.Extensions;
using EducationalPortal.Server.GraphQL.Abstraction;
using EducationalPortal.Server.GraphQL.Modules.Auth;
using GraphQL;
using GraphQL.Types;

namespace EducationalPortal.Server.GraphQL.Modules.Subjects
{
    public class SubjectsQueries : ObjectGraphType, IQueryMarker
    {
        public SubjectsQueries(ISubjectRepository subjectRepository, IUserRepository userRepository, IHttpContextAccessor httpContextAccessor, IEducationalYearRepository educationalYearRepository)
        {
            Field<NonNullGraphType<SubjectType>, SubjectModel>()
                .Name("GetSubject")
                .Argument<NonNullGraphType<IdGraphType>, Guid>("Id", "Argument for get Subject")
                .ResolveAsync(async context =>
                {
                    Guid id = context.GetArgument<Guid>("Id");
                    return await subjectRepository.GetByIdAsync(id);
                })
                .AuthorizeWith(AuthPolicies.Authenticated);

            Field<NonNullGraphType<GetEntitiesResponseType<SubjectType, SubjectModel>>, GetEntitiesResponse<SubjectModel>>()
                .Name("GetSubjects")
                .Argument<NonNullGraphType<IntGraphType>, int>("Page", "Argument for get Subjects")
                .Argument<NonNullGraphType<StringGraphType>, string>("Like", "Argument for get My Subjects")
                .ResolveAsync(async context =>
                {
                    int page = context.GetArgument<int>("Page");
                    string like = context.GetArgument<string>("Like");
                    EducationalYearModel currentEducationalYear = await educationalYearRepository.GetCurrentAsync();
                    return await subjectRepository.WhereOrDefaultAsync(s => s.CreatedAt, Order.Descend, page, s =>
                        s.EducationalYearId == currentEducationalYear.Id
                        && s.Name.ToLower().Contains(like.ToLower())
                    );
                })
               .AuthorizeWith(AuthPolicies.Teacher);

            Field<NonNullGraphType<GetEntitiesResponseType<SubjectType, SubjectModel>>, GetEntitiesResponse<SubjectModel>>()
                .Name("GetMySubjects")
                .Argument<NonNullGraphType<IntGraphType>, int>("Page", "Argument for get My Subjects")
                .Argument<NonNullGraphType<StringGraphType>, string>("Like", "Argument for get My Subjects")
                .ResolveAsync(async context =>
                {
                    int page = context.GetArgument<int>("Page");
                    string like = context.GetArgument<string>("Like");
                    EducationalYearModel currentEducationalYear = await educationalYearRepository.GetCurrentAsync();
                    Guid currentUserId = httpContextAccessor.HttpContext.GetUserId();
                    UserRoleEnum currentUserRole = httpContextAccessor.HttpContext.GetRole();
                    switch (currentUserRole)
                    {
                        case UserRoleEnum.Student:
                            UserModel currentUser = await userRepository.GetByIdAsync(currentUserId);
                            return await subjectRepository.WhereOrDefaultAsync(s => s.CreatedAt, Order.Descend, page,
                                s => s.GradesHaveAccessRead.Any(g => g.Id == currentUser.GradeId)
                                && s.Name.ToLower().Contains(like.ToLower())
                                && s.EducationalYearId == currentEducationalYear.Id,
                                s => s.GradesHaveAccessRead
                            );
                        case UserRoleEnum.Teacher:
                        case UserRoleEnum.Administrator:
                            return await subjectRepository.WhereOrDefaultAsync(s => s.CreatedAt, Order.Descend, page,
                                s => (s.TeacherId == currentUserId || s.TeachersHaveAccessCreatePosts.Any(t => t.Id == currentUserId))
                                && s.Name.ToLower().Contains(like.ToLower())
                                && s.EducationalYearId == currentEducationalYear.Id,
                                s => s.TeachersHaveAccessCreatePosts
                            );
                        default:
                            throw new Exception("Невідома роль");
                    }
                })
               .AuthorizeWith(AuthPolicies.Authenticated);
        }
    }
}
