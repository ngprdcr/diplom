using GraphQL.Types;

namespace EducationalPortal.Server.GraphQL.Modules.Grades.DTO
{
    public class UpdateGradeInputType : CreateGradeInputType
    {
        public UpdateGradeInputType() : base()
        {
            Field<NonNullGraphType<IdGraphType>, Guid>()
                .Name("Id")
                .Resolve(context => context.Source.Id);
        }
    }
}
