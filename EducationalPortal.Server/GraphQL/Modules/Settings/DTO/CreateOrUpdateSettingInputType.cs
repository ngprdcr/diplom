using EducationalPortal.Business.Models;
using GraphQL.Types;

namespace EducationalPortal.Server.GraphQL.Modules.Settings.DTO
{
    public class CreateOrUpdateSettingInputType : InputObjectGraphType<SettingModel>
    {
        public CreateOrUpdateSettingInputType()
        {
            Field<NonNullGraphType<StringGraphType>, string>()
               .Name("Name")
               .Resolve(context => context.Source.Name);
            
            Field<StringGraphType, string?>()
               .Name("Value")
               .Resolve(context => context.Source.Value);
        }
    }
}
