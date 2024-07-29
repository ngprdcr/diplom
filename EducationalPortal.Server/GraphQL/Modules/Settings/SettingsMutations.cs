using EducationalPortal.Business.Models;
using EducationalPortal.Business.Repositories;
using EducationalPortal.Server.GraphQL.Abstraction;
using EducationalPortal.Server.GraphQL.Modules.Auth;
using EducationalPortal.Server.GraphQL.Modules.Settings.DTO;
using GraphQL;
using GraphQL.Types;

namespace EducationalPortal.Server.GraphQL.Modules.Settings
{
    public class SettingsMutations : ObjectGraphType, IMutationMarker
    {
        public SettingsMutations(ISettingRepository settingRepository)
        {
            Field<NonNullGraphType<SettingType>, SettingModel>()
                .Name("CreateOrUpdateSetting")
                .Argument<NonNullGraphType<CreateOrUpdateSettingInputType>, SettingModel>("CreateOrUpdateSettingInputType", "Argument for create or update Setting")
                .ResolveAsync(async (context) =>
                {
                    SettingModel setting = context.GetArgument<SettingModel>("CreateOrUpdateSettingInputType");
                    return await settingRepository.CreateOrUpdateAsync(setting);
                })
                .AuthorizeWith(AuthPolicies.Administrator);
            
            Field<NonNullGraphType<BooleanGraphType>, bool>()
               .Name("RemoveSetting")
               .Argument<NonNullGraphType<IdGraphType>, Guid>("Id", "Argument for remove Setting")
               .ResolveAsync(async (context) =>
               {
                   Guid id = context.GetArgument<Guid>("Id");
                   await settingRepository.RemoveAsync(id);
                   return true;
               })
               .AuthorizeWith(AuthPolicies.Administrator);
        }
    }
}
