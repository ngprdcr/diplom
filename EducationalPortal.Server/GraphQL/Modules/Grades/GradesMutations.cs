using EducationalPortal.Business.Models;
using EducationalPortal.Business.Repositories;
using EducationalPortal.Server.GraphQL.Abstraction;
using EducationalPortal.Server.GraphQL.Modules.Auth;
using EducationalPortal.Server.GraphQL.Modules.Grades.DTO;
using GraphQL;
using GraphQL.Types;

namespace EducationalPortal.Server.GraphQL.Modules.Grades
{
    public class GradesMutations : ObjectGraphType, IMutationMarker
    {
        public GradesMutations(IGradeRepository gradeRepository)
        {
            Field<NonNullGraphType<GradeType>, GradeModel>()
                .Name("CreateGrade")
                .Argument<NonNullGraphType<CreateGradeInputType>, GradeModel>("CreateGradeInputType", "Argument for create new Grade")
                .ResolveAsync(async (context) =>
                {
                    GradeModel grade = context.GetArgument<GradeModel>("CreateGradeInputType");
                    return await gradeRepository.CreateAsync(grade);
                })
                .AuthorizeWith(AuthPolicies.Administrator);

            Field<NonNullGraphType<GradeType>, GradeModel>()
                .Name("UpdateGrade")
                .Argument<NonNullGraphType<UpdateGradeInputType>, GradeModel>("UpdateGradeInputType", "Argument for update Grade")
                .ResolveAsync(async (context) =>
                {
                    GradeModel grade = context.GetArgument<GradeModel>("UpdateGradeInputType");
                    return await gradeRepository.UpdateAsync(grade);
                })
                .AuthorizeWith(AuthPolicies.Administrator);

            Field<NonNullGraphType<BooleanGraphType>, bool>()
               .Name("RemoveGrade")
               .Argument<NonNullGraphType<IdGraphType>, Guid>("Id", "Argument for remove Grade")
               .ResolveAsync(async (context) =>
               {
                   Guid id = context.GetArgument<Guid>("Id");
                   await gradeRepository.RemoveAsync(id);
                   return true;
               })
               .AuthorizeWith(AuthPolicies.Administrator);
        }
    }
}
