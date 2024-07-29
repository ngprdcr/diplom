using EducationalPortal.Business.Abstractions;
using EducationalPortal.Business.Models;

namespace EducationalPortal.Business.Repositories
{
    public interface ISettingRepository : IBaseRepository<SettingModel>
    {
        Task<SettingModel> GetByNameAsync(string name);
        Task<SettingModel?> GetByNameOrDefaultAsync(string name);
        Task<SettingModel> CreateOrUpdateAsync(SettingModel newSetting);
    }
}
