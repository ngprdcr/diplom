using EducationalPortal.Business.Models;
using GraphQL.Types;

namespace EducationalPortal.Server.GraphQL.Modules.Grades.DTO
{
    public class CreateGradeInputType : InputObjectGraphType<GradeModel>
    {
        public CreateGradeInputType()
        {
            Field<NonNullGraphType<StringGraphType>, string>()
               .Name("Name")
               .Resolve(context => context.Source.Name);
        }
    }
}
