using EducationalPortal.Business.Abstractions;
using EducationalPortal.Business.Models;
using EducationalPortal.Business.Repositories;
using EducationalPortal.Server.GraphQL.Abstraction;
using EducationalPortal.Server.GraphQL.Modules.Auth;
using GraphQL;
using GraphQL.Types;

namespace EducationalPortal.Server.GraphQL.Modules.Grades
{
    public class GradesQueries : ObjectGraphType, IQueryMarker
    {
        public GradesQueries(IGradeRepository gradeRepository)
        {
            Field<NonNullGraphType<GetEntitiesResponseType<GradeType, GradeModel>>, GetEntitiesResponse<GradeModel>>()
                .Name("GetGrades")
                .Argument<NonNullGraphType<IntGraphType>, int>("Page", "Argument for get Grades")
                .Argument<NonNullGraphType<StringGraphType>, string>("Like", "Argument for get Grades")
                .ResolveAsync(async context =>
                {
                    int page = context.GetArgument<int>("Page");
                    string like = context.GetArgument<string>("Like");
                    return await gradeRepository.WhereAsync(y => y.Name, Order.Ascend, page, g => g.Name.ToLower().Contains(like.ToLower()));
                })
                .AuthorizeWith(AuthPolicies.Teacher);

            Field<NonNullGraphType<GradeType>, GradeModel>()
                .Name("GetGrade")
                .Argument<NonNullGraphType<IdGraphType>, Guid>("Id", "Argument for get Grade")
                .ResolveAsync(async context =>
                {
                    Guid id = context.GetArgument<Guid>("Id");
                    return await gradeRepository.GetByIdAsync(id);
                })
                .AuthorizeWith(AuthPolicies.Teacher);
        }
    }
}
