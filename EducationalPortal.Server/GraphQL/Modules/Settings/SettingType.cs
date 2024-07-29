using EducationalPortal.Business.Models;
using EducationalPortal.Server.GraphQL.Abstraction;
using GraphQL.Types;

namespace EducationalPortal.Server.GraphQL.Modules.Settings
{
    public class SettingType : BaseType<SettingModel>
    {
        public SettingType() : base()
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
