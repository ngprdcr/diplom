using EducationalPortal.Business.Abstractions;
using EducationalPortal.Business.Enums;
using EducationalPortal.Business.Models;
using EducationalPortal.Business.Repositories;
using EducationalPortal.Server.Extensions;
using EducationalPortal.Server.GraphQL.Abstraction;
using EducationalPortal.Server.GraphQL.Modules.Auth;
using GraphQL;
using GraphQL.Types;

namespace EducationalPortal.Server.GraphQL.Modules.SubjectPosts
{
    public class SubjectPostsQueries : ObjectGraphType, IQueryMarker
    {
        public SubjectPostsQueries(ISubjectPostRepository subjectPostRepository)
        {
            Field<NonNullGraphType<SubjectPostType>, SubjectPostModel>()
                .Name("GetSubjectPost")
                .Argument<NonNullGraphType<IdGraphType>, Guid>("Id", "Argument for get Subject")
                .ResolveAsync(async context =>
                {
                    Guid id = context.GetArgument<Guid>("Id");
                    return await subjectPostRepository.GetByIdAsync(id);
                })
                .AuthorizeWith(AuthPolicies.Authenticated);

            //Field<NonNullGraphType<GetEntitiesResponseType<SubjectPostType, SubjectPostModel>>, GetEntitiesResponse<SubjectPostModel>>()
            //    .Name("GetSubjects")
            //    .Argument<NonNullGraphType<IntGraphType>, int>("Page", "Argument for get Subjects")
            //    .Argument<NonNullGraphType<StringGraphType>, string>("Like", "Argument for get My Subjects")
            //    .ResolveAsync(async context =>
            //    {
            //        int page = context.GetArgument<int>("Page");
            //        string like = context.GetArgument<string>("Like");
            //        EducationalYearModel currentEducationalYear = await educationalYearRepository.GetCurrentAsync();
            //        return await subjectRepository.WhereOrDefaultAsync(s => s.CreatedAt, Order.Descend, page, s =>
            //            s.EducationalYearId == currentEducationalYear.Id
            //            && s.Name.ToLower().Contains(like.ToLower())
            //        );
            //    })
            //   .AuthorizeWith(AuthPolicies.Teacher);
        }
    }
}
