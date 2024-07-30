using EducationalPortal.Business.Abstractions;
using EducationalPortal.Business.Enums;
using EducationalPortal.Business.Models;
using EducationalPortal.Business.Repositories;
using EducationalPortal.Server.GraphQL.Abstraction;
using EducationalPortal.Server.GraphQL.Modules.Auth;
using GraphQL;
using GraphQL.Types;
using System.Linq.Expressions;

namespace EducationalPortal.Server.GraphQL.Modules.Users
{
    public class UsersQueries : ObjectGraphType, IQueryMarker
    {
        public UsersQueries(IUserRepository usersRepository, ISubjectRepository subjectRepository, IServiceProvider serviceProvider)
        {
            Field<NonNullGraphType<GetEntitiesResponseType<UserType, UserModel>>, GetEntitiesResponse<UserModel>>()
                .Name("GetUsers")
                .Argument<NonNullGraphType<IntGraphType>, int>("Page", "Argument for get Users")
                .Argument<NonNullGraphType<StringGraphType>, string>("Like", "Argument for get Users")
                .Argument<ListGraphType<UserRoleType>, List<UserRoleEnum>?>("Roles", "Argument for get Users")
                .ResolveAsync(async context =>
                {
                    int page = context.GetArgument<int>("Page");
                    string like = context.GetArgument<string>("Like");
                    List<UserRoleEnum>? roles = context.GetArgument<List<UserRoleEnum>?>("Roles");
                    Expression<Func<UserModel, bool>> condition = roles == null || roles.Count == 0
                        ? u => (u.FirstName == null ? false : u.FirstName.ToLower().Contains(like.ToLower()))
                            || (u.LastName == null ? false : u.LastName.ToLower().Contains(like.ToLower()))
                            || (u.MiddleName == null ? false : u.MiddleName.ToLower().Contains(like.ToLower()))
                            || (u.Login == null ? false : u.Login.ToLower().Contains(like.ToLower()))
                            || (u.Email == null ? false : u.Email.ToLower().Contains(like.ToLower()))
                        : u => roles.Contains(u.Role) && (
                            (u.FirstName == null ? false : u.FirstName.ToLower().Contains(like.ToLower()))
                            || (u.LastName == null ? false : u.LastName.ToLower().Contains(like.ToLower()))
                            || (u.MiddleName == null ? false : u.MiddleName.ToLower().Contains(like.ToLower()))
                            || (u.Login == null ? false : u.Login.ToLower().Contains(like.ToLower()))
                            || (u.Email == null ? false : u.Email.ToLower().Contains(like.ToLower())));

                    return await usersRepository.WhereAsync(u => u.LastName, Order.Ascend, page, condition);
                })
                .AuthorizeWith(AuthPolicies.Teacher);

            Field<NonNullGraphType<ListGraphType<NonNullGraphType<UserType>>>>()
                .Name("GetStudents")
                .Argument<NonNullGraphType<GuidGraphType>>("subjectId", "")
                .ResolveAsync(async context =>
                {
                    var subjectId = context.GetArgument<Guid>("subjectId");

                    using var scope = serviceProvider.CreateScope();
                    var subjectRepository = scope.ServiceProvider.GetRequiredService<ISubjectRepository>();
                    var usersRepository = scope.ServiceProvider.GetRequiredService<IUserRepository>();

                    var subject = await subjectRepository.GetByIdAsync(subjectId, s => s.GradesHaveAccessRead);
                    var gradeIds = subject.GradesHaveAccessRead.Select(g => g.Id);

                    return await usersRepository.GetAsync(u => u.GradeId.HasValue && gradeIds.Contains(u.GradeId.Value));
                })
                .AuthorizeWith(AuthPolicies.Teacher);

            Field<NonNullGraphType<UserType>, UserModel>()
                .Name("GetUser")
                .Argument<NonNullGraphType<IdGraphType>, Guid>("Id", "Argument for get User")
                .ResolveAsync(async context =>
                {
                    Guid id = context.GetArgument<Guid>("Id");
                    return await usersRepository.GetByIdAsync(id);
                })
                .AuthorizeWith(AuthPolicies.Teacher);
        }
    }
}
