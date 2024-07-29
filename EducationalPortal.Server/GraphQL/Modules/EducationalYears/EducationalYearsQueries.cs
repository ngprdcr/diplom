using EducationalPortal.Business.Abstractions;
using EducationalPortal.Business.Models;
using EducationalPortal.Business.Repositories;
using EducationalPortal.Server.GraphQL.Abstraction;
using EducationalPortal.Server.GraphQL.Modules.Auth;
using GraphQL;
using GraphQL.Types;

namespace EducationalPortal.Server.GraphQL.Modules.EducationalYears
{
    public class EducationalYearsQueries : ObjectGraphType, IQueryMarker
    {
        public EducationalYearsQueries(IEducationalYearRepository educationalYearRepository)
        {
            Field<NonNullGraphType<GetEntitiesResponseType<EducationalYearType, EducationalYearModel>>, GetEntitiesResponse<EducationalYearModel>>()
                .Name("GetEducationalYears")
                .Argument<NonNullGraphType<IntGraphType>, int>("Page", "Argument for get Educational years")
                .Argument<NonNullGraphType<StringGraphType>, string>("Like", "Argument for get Educational years")
                .ResolveAsync(async context => 
                {
                    int page = context.GetArgument<int>("Page");
                    string like = context.GetArgument<string>("Like");
                    return await educationalYearRepository.WhereAsync(y => y.CreatedAt, Order.Descend, page, y => y.Name.ToLower().Contains(like.ToLower()));
                })
               .AuthorizeWith(AuthPolicies.Teacher);

            Field<NonNullGraphType<EducationalYearType>, EducationalYearModel>()
                .Name("GetEducationalYear")
                .Argument<NonNullGraphType<IdGraphType>, Guid>("Id", "Argument for get Educational year")
                .ResolveAsync(async context =>
                {
                    Guid id = context.GetArgument<Guid>("Id");
                    return await educationalYearRepository.GetByIdAsync(id);
                })
                .AuthorizeWith(AuthPolicies.Teacher);
        }
    }
}
