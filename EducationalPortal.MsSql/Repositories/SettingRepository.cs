using EducationalPortal.Business.Models;
using EducationalPortal.Business.Repositories;
using EducationalPortal.MsSql.Abstractions;

namespace EducationalPortal.MsSql.Repositories
{
    public class SettingRepository : BaseRepository<SettingModel>, ISettingRepository
    {
        private readonly AppDbContext _context;
        public SettingRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<SettingModel> GetByNameAsync(string name)
        {
            SettingModel? setting = await GetByNameOrDefaultAsync(name);
            if (setting == null)
                throw new Exception("Налаштування з введеною назвою не знайдено");
            return setting;
        }
        
        public async Task<SettingModel?> GetByNameOrDefaultAsync(string name)
        {
            List<SettingModel> settings = await GetOrDefaultAsync(s => s.Name == name);
            return settings.Count() == 0 ? null : settings[0];
        }
        
        public async Task<SettingModel> CreateOrUpdateAsync(SettingModel newSetting)
        {
            List<SettingModel> checkUniqueSettingName = await GetOrDefaultAsync(s => s.Name == newSetting.Name);
            if (checkUniqueSettingName.Count == 0)
            {
                await base.CreateAsync(newSetting);
                return newSetting;
            }
            else
            {
                checkUniqueSettingName[0].Name = newSetting.Name;
                checkUniqueSettingName[0].Value = newSetting.Value;
                await _context.SaveChangesAsync();
                return checkUniqueSettingName[0];
            }
        }
    }
}
