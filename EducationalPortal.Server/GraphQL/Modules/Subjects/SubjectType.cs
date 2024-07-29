using EducationalPortal.Business.Abstractions;
using EducationalPortal.Business.Models;
using EducationalPortal.Business.Repositories;
using EducationalPortal.Server.GraphQL.Abstraction;
using EducationalPortal.Server.GraphQL.Modules.EducationalYears;
using EducationalPortal.Server.GraphQL.Modules.Grades;
using EducationalPortal.Server.GraphQL.Modules.SubjectPosts;
using EducationalPortal.Server.GraphQL.Modules.Users;
using GraphQL;
using GraphQL.Types;

namespace EducationalPortal.Server.GraphQL.Modules.Subjects
{
    public class SubjectType : BaseType<SubjectModel>
    {
        public SubjectType(IServiceProvider serviceProvider) : base()
        {
            Field<NonNullGraphType<StringGraphType>, string>()
               .Name("Name")
               .Resolve(context => context.Source.Name);

            Field<StringGraphType, string>()
               .Name("Link")
               .Resolve(context => context.Source.Link);

            Field<GetEntitiesResponseType<SubjectPostType, SubjectPostModel>, GetEntitiesResponse<SubjectPostModel>>()
               .Name("Posts")
               .Argument<NonNullGraphType<IntGraphType>, int>("Page", "Argument for get Subjects Posts")
               .ResolveAsync(async context =>
               {
                   using var scope = serviceProvider.CreateScope();
                   var subjectPostRepository = scope.ServiceProvider.GetRequiredService<ISubjectPostRepository>();
                   int page = context.GetArgument<int>("Page");
                   Guid subjectId = context.Source.Id;
                   return await subjectPostRepository.WhereOrDefaultAsync(p => p.CreatedAt, Order.Descend, page, p => p.SubjectId == subjectId);
               });

            Field<ListGraphType<GradeType>, List<GradeModel>?>()
               .Name("GradesHaveAccessRead")
               .ResolveAsync(async context =>
               {
                   using var scope = serviceProvider.CreateScope();
                   var subjectRepository = scope.ServiceProvider.GetRequiredService<ISubjectRepository>();
                   SubjectModel subject = await subjectRepository.GetByIdAsync(context.Source.Id, s => s.GradesHaveAccessRead);
                   return subject.GradesHaveAccessRead;
               });
            
            Field<ListGraphType<UserType>, List<UserModel>?>()
               .Name("TeachersHaveAccessCreatePosts")
               .ResolveAsync(async context =>
               {
                   using var scope = serviceProvider.CreateScope();
                   var subjectRepository = scope.ServiceProvider.GetRequiredService<ISubjectRepository>();
                   SubjectModel subject = await subjectRepository.GetByIdAsync(context.Source.Id, s => s.TeachersHaveAccessCreatePosts);
                   return subject.TeachersHaveAccessCreatePosts;
               });

            Field<NonNullGraphType<IdGraphType>, Guid?>()
               .Name("TeacherId")
               .Resolve(context => context.Source.TeacherId);

            Field<NonNullGraphType<UserType>, UserModel>()
               .Name("Teacher")
               .ResolveAsync(async context =>
               {
                   using var scope = serviceProvider.CreateScope();
                   var userRepository = scope.ServiceProvider.GetRequiredService<IUserRepository>();
                   return await userRepository.GetByIdOrDefaultAsync(context.Source.TeacherId);
               });
            
            Field<NonNullGraphType<IdGraphType>, Guid?>()
               .Name("EducationalYearId")
               .Resolve(context => context.Source.EducationalYearId);

            Field<NonNullGraphType<EducationalYearType>, EducationalYearModel>()
               .Name("EducationalYear")
               .ResolveAsync(async context =>
               {
                   using var scope = serviceProvider.CreateScope();
                   var educationalYearRepository = scope.ServiceProvider.GetRequiredService<IEducationalYearRepository>();
                   return await educationalYearRepository.GetByIdOrDefaultAsync(context.Source.EducationalYearId);
               });
        }
    }
}
