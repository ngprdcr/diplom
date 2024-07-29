using EducationalPortal.Business.Models;
using EducationalPortal.Business.Repositories;
using EducationalPortal.MsSql.Abstractions;

namespace EducationalPortal.MsSql.Repositories
{
    public class EducationalYearRepository : BaseRepository<EducationalYearModel>, IEducationalYearRepository
    {
        private readonly AppDbContext _context;

        public EducationalYearRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public override async Task<EducationalYearModel> CreateAsync(EducationalYearModel entity)
        {
            List<EducationalYearModel> checkUniqueYear = await GetOrDefaultAsync(e => e.Name == entity.Name);
            if (checkUniqueYear.Count > 0)
                throw new Exception("Навчальний рік з данним ім'ям уже існує");
            await base.CreateAsync(entity);
            return entity;
        }
        
        public override async Task<EducationalYearModel> UpdateAsync(EducationalYearModel newEducationalYear)
        {
            List<EducationalYearModel>? checkUniqeYear = await GetOrDefaultAsync(e => e.Name == newEducationalYear.Name && e.Id != newEducationalYear.Id);
            if (checkUniqeYear.Count > 0 && checkUniqeYear[0].Id != newEducationalYear.Id)
                throw new Exception("Навчальний рік з данним ім'ям уже існує");

            EducationalYearModel addedEducationalYear = await GetByIdAsync(newEducationalYear.Id);
            addedEducationalYear.Name = newEducationalYear.Name;
            addedEducationalYear.DateStart = newEducationalYear.DateStart;
            addedEducationalYear.DateEnd = newEducationalYear.DateEnd;
            addedEducationalYear.IsCurrent = newEducationalYear.IsCurrent;
            if (newEducationalYear.IsCurrent)
            {
                List<EducationalYearModel>? currentYears = await GetOrDefaultAsync(y => y.IsCurrent == true && y.Id != newEducationalYear.Id);
                foreach(var currentYear in currentYears)
                {
                    currentYear.IsCurrent = false;
                }
                await _context.SaveChangesAsync();
            }
            await _context.SaveChangesAsync();
            return addedEducationalYear;
        }

        public async Task<EducationalYearModel> GetCurrentAsync()
        {
            List<EducationalYearModel> currentYears = await GetOrDefaultAsync(y => y.IsCurrent == true);
            if (currentYears.Count == 0)
                throw new Exception("Ви не можете створити коли немає поточного навчального року");
            return currentYears[0];
        }
    }
}
