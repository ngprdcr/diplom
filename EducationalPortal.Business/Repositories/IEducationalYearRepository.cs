using EducationalPortal.Business.Abstractions;
using EducationalPortal.Business.Models;

namespace EducationalPortal.Business.Repositories
{
    public interface IEducationalYearRepository : IBaseRepository<EducationalYearModel>
    {
        Task<EducationalYearModel> GetCurrentAsync();
    }
}
