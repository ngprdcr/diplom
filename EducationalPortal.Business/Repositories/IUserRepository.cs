using EducationalPortal.Business.Abstractions;
using EducationalPortal.Business.Models;

namespace EducationalPortal.Business.Repositories
{
    public interface IUserRepository : IBaseRepository<UserModel>
    {
        Task<UserModel> GetByLoginAsync(string login);
        Task<UserModel?> GetByLoginOrDefaultAsync(string login);
    }
}
