using EducationalPortal.Business.Abstractions;
using EducationalPortal.Business.Enums;
using EducationalPortal.Business.Models;
using EducationalPortal.Business.Repositories;
using EducationalPortal.Server.Extensions;
using EducationalPortal.Server.GraphQL.Abstraction;
using EducationalPortal.Server.GraphQL.Modules.Auth;
using GraphQL;
using GraphQL.Types;

namespace EducationalPortal.Server.GraphQL.Modules.Homeworks
{
    public class HomeworksQueries : ObjectGraphType, IQueryMarker
    {
        public HomeworksQueries(IHomeworkRepository homeworkRepository, IHttpContextAccessor httpContextAccessor, IEducationalYearRepository educationalYearRepository, ISubjectPostRepository subjectPostRepository)
        {
            Field<NonNullGraphType<HomeworkType>, HomeworkModel>()
                .Name("GetHomework")
                .Argument<NonNullGraphType<IdGraphType>, Guid>("Id", "Argument for get Homework")
                .ResolveAsync(async context =>
                {
                    Guid id = context.GetArgument<Guid>("Id");
                    return await homeworkRepository.GetByIdAsync(id);
                })
                .AuthorizeWith(AuthPolicies.Student);

            Field<NonNullGraphType<GetEntitiesResponseType<HomeworkType, HomeworkModel>>, GetEntitiesResponse<HomeworkModel>>()
                .Name("GetHomeworks")
                .Argument<NonNullGraphType<IntGraphType>, int>("Page", "Argument for get Homeworks")
                .Argument<ListGraphType<HomeworkStatusType>, List<HomeworkStatus>?>("Statuses", "Argument for get Homeworks")
                .Argument<NonNullGraphType<OrderType>, Order>("Order", "Argument for get Homeworks")
                .ResolveAsync(async context =>
                {
                    int page = context.GetArgument<int>("Page");
                    List<HomeworkStatus>? statuses = context.GetArgument<List<HomeworkStatus>?>("Statuses");
                    Order order = context.GetArgument<Order>("Order");
                    return await homeworkRepository.WhereAsync(s => s.CreatedAt, order, page, 
                        s => (statuses == null || statuses.Count == 0) ? true : statuses.Contains(s.Status)
                    );
                })
               .AuthorizeWith(AuthPolicies.Administrator);

            Field<NonNullGraphType<GetEntitiesResponseType<HomeworkType, HomeworkModel>>, GetEntitiesResponse<HomeworkModel>>()
                .Name("GetMyHomeworks")
                .Argument<NonNullGraphType<IntGraphType>, int>("Page", "Argument for get Homeworks")
                .Argument<ListGraphType<HomeworkStatusType>, List<HomeworkStatus>?>("Statuses", "Argument for get Homeworks")
                .Argument<NonNullGraphType<OrderType>, Order>("Order", "Argument for get Homeworks")
                .ResolveAsync(async context =>
                {
                    int page = context.GetArgument<int>("Page");
                    List<HomeworkStatus>? statuses = context.GetArgument<List<HomeworkStatus>?>("Statuses");
                    Order order = context.GetArgument<Order>("Order");
                    Guid currentUserId = httpContextAccessor.HttpContext.GetUserId();
                    UserRoleEnum currentUserRole = httpContextAccessor.HttpContext.GetRole();
                    switch (currentUserRole)
                    {
                        case UserRoleEnum.Student:
                            return await homeworkRepository.WhereAsync(s => s.CreatedAt, order, page,
                                h => ((statuses == null || statuses.Count == 0) ? true : statuses.Contains(h.Status))
                                && h.StudentId == currentUserId);
                        case UserRoleEnum.Teacher:
                        case UserRoleEnum.Administrator:
                            EducationalYearModel currentEducationalYear = await educationalYearRepository.GetCurrentAsync();
                            var subjectPosts = await subjectPostRepository.GetOrDefaultAsync(
                                s => s.TeacherId == currentUserId || s.Subject.TeachersHaveAccessCreatePosts.Any(t => t.Id == currentUserId),
                                s => s.Subject.TeachersHaveAccessCreatePosts);
                            return await homeworkRepository.WhereOrDefaultAsync(s => s.CreatedAt, order, page,
                               h => ((statuses == null || statuses.Count == 0) ? true : statuses.Contains(h.Status)) && subjectPosts.Contains(h.SubjectPost),
                               s => s.SubjectPost);
                        default:
                            throw new Exception("Невідома роль");
                    }
                })
               .AuthorizeWith(AuthPolicies.Student);
        }
    }
}
