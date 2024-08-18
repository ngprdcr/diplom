using EducationalPortal.Business.Abstractions;
using EducationalPortal.Business.Enums;
using EducationalPortal.Business.Models;
using EducationalPortal.Business.Repositories;
using EducationalPortal.Server.GraphQL.Abstraction;
using EducationalPortal.Server.GraphQL.Modules.Auth;
using EducationalPortal.Server.GraphQL.Modules.Grades;
using EducationalPortal.Server.GraphQL.Modules.Subjects;
using GraphQL;
using GraphQL.Types;

namespace EducationalPortal.Server.GraphQL.Modules.Users
{
    public class UserType : BaseType<UserModel>
    {
        public UserType(IServiceProvider serviceProvider) : base()
        {
            Field<StringGraphType, string>()
               .Name("FirstName")
               .Resolve(context => context.Source.FirstName);

            Field<StringGraphType, string>()
               .Name("LastName")
               .Resolve(context => context.Source.LastName);

            Field<StringGraphType, string>()
               .Name("MiddleName")
               .Resolve(context => context.Source.MiddleName);

            Field<NonNullGraphType<StringGraphType>, string>()
               .Name("Login")
               .Resolve(context => context.Source.Login);

            Field<StringGraphType, string>()
               .Name("Email")
               .Resolve(context => context.Source.Email);

            Field<StringGraphType, string>()
               .Name("PhoneNumber")
               .Resolve(context => context.Source.PhoneNumber);

            Field<DateTimeGraphType, DateTime>()
               .Name("DateOfBirth")
               .Resolve(context => context.Source.DateOfBirth);

            Field<NonNullGraphType<UserRoleType>, UserRoleEnum>()
               .Name("Role")
               .Resolve(context => context.Source.Role);

            Field<IdGraphType, Guid?>()
               .Name("GradeId")
               .Resolve(context => context.Source.GradeId);

            Field<IdGraphType, Guid?>()
               .Name("MotherId")
               .Resolve(context => context.Source.MotherId);

            Field<UserType>()
                .Name("Mother")
                .ResolveAsync(async context =>
                {
                    using var scope = serviceProvider.CreateScope();
                    var userRepository = scope.ServiceProvider.GetRequiredService<IUserRepository>();
                    return await userRepository.GetByIdOrDefaultAsync(context.Source.MotherId);
                });

            Field<IdGraphType, Guid?>()
               .Name("FatherId")
               .Resolve(context => context.Source.FatherId);

            Field<UserType>()
                .Name("Father")
                .ResolveAsync(async context =>
                {
                    using var scope = serviceProvider.CreateScope();
                    var userRepository = scope.ServiceProvider.GetRequiredService<IUserRepository>();
                    return await userRepository.GetByIdOrDefaultAsync(context.Source.FatherId);
                });

            Field<GradeType, GradeModel?>()
               .Name("Grade")
               .ResolveAsync(async context =>
               {
                   using var scope = serviceProvider.CreateScope();
                   var gradeRepository = scope.ServiceProvider.GetRequiredService<IGradeRepository>();
                   return await gradeRepository.GetByIdOrDefaultAsync(context.Source.GradeId);
               });

            Field<GetEntitiesResponseType<SubjectType, SubjectModel>, GetEntitiesResponse<SubjectModel>>()
               .Name("Subjects")
               .Argument<NonNullGraphType<IntGraphType>, int>("Page", "Argument for get Subjects")
               .ResolveAsync(async context =>
               {
                   using var scope = serviceProvider.CreateScope();
                   var subjectRepository = scope.ServiceProvider.GetRequiredService<ISubjectRepository>();
                   int page = context.GetArgument<int>("Page");
                   Guid userId = context.Source.Id;
                   return await subjectRepository.WhereOrDefaultAsync(s => s.CreatedAt, Order.Descend, page, s => s.TeacherId == userId);
               })
               .AuthorizeWith(AuthPolicies.Teacher);
        }
    }

    public class UserRoleType : EnumerationGraphType<UserRoleEnum>
    {
    }
}
