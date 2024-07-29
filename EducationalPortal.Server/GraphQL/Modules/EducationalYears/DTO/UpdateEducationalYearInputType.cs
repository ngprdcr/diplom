using GraphQL.Types;

namespace EducationalPortal.Server.GraphQL.Modules.EducationalYears.DTO
{
    public class UpdateEducationalYearInputType : CreateEducationalYearInputType
    {
        public UpdateEducationalYearInputType() : base()
        {
            Field<NonNullGraphType<IdGraphType>, Guid>()
               .Name("Id")
               .Resolve(context => context.Source.Id);
            
            Field<NonNullGraphType<BooleanGraphType>, bool>()
               .Name("IsCurrent")
               .Resolve(context => context.Source.IsCurrent);
        }
    }
}
