using EducationalPortal.Business.Models;
using EducationalPortal.Business.Repositories;
using EducationalPortal.Server.GraphQL.Abstraction;
using GraphQL;
using GraphQL.Types;

namespace EducationalPortal.Server.GraphQL.Modules.Settings
{
    public class SettingsQueries : ObjectGraphType, IQueryMarker
    {
        public SettingsQueries(ISettingRepository settingRepository)
        {
            Field<NonNullGraphType<SettingType>, SettingModel>()
                .Name("GetSetting")
                .Argument<NonNullGraphType<StringGraphType>, string>("Name", "Argument for get Setting")
                .ResolveAsync(async context =>
                {
                    string name = context.GetArgument<string>("Name");
                    return await settingRepository.GetByNameAsync(name);
                });

            Field<NonNullGraphType<ListGraphType<SettingType>>, List<SettingModel>>()
                .Name("GetSettings")
                .ResolveAsync(async context => await settingRepository.GetAsync());
        }
    }
}
