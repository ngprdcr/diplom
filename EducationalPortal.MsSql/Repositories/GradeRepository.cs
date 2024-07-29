using EducationalPortal.Business.Models;
using EducationalPortal.Business.Repositories;
using EducationalPortal.MsSql.Abstractions;

namespace EducationalPortal.MsSql.Repositories
{
    public class GradeRepository : BaseRepository<GradeModel>, IGradeRepository
    {
        private readonly AppDbContext _context;

        public GradeRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public override async Task<GradeModel> CreateAsync(GradeModel grade)
        {
            List<GradeModel> checkUniqueGradeName = await GetOrDefaultAsync(e => e.Name == grade.Name);
            if (checkUniqueGradeName.Count > 0)
                throw new Exception("Клас з данною назвою уже існує");
            await base.CreateAsync(grade);
            return grade;
        }

        public override async Task<GradeModel> UpdateAsync(GradeModel newGrade)
        {
            List<GradeModel>? checkUniqueGradeName = await GetOrDefaultAsync(e => e.Name == newGrade.Name && e.Id != newGrade.Id);
            if (checkUniqueGradeName.Count > 0 && checkUniqueGradeName[0].Id != newGrade.Id)
                throw new Exception("Клас з даною назвою уже існує");
            GradeModel addedGrade = await GetByIdAsync(newGrade.Id);
            addedGrade.Name = newGrade.Name;
            await _context.SaveChangesAsync();
            return addedGrade;
        }
    }
}