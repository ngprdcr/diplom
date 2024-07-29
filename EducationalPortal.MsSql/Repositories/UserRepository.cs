using EducationalPortal.Business.Models;
using EducationalPortal.Business.Repositories;
using EducationalPortal.MsSql.Abstractions;

namespace EducationalPortal.MsSql.Repositories
{
    public class UserRepository : BaseRepository<UserModel>, IUserRepository
    {
        private readonly AppDbContext _context;
        public UserRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public override async Task<UserModel> CreateAsync(UserModel entity)
        {
            if (!string.IsNullOrEmpty(entity.Email))
            {
                List<UserModel> checkUniqeUserEmail = await GetOrDefaultAsync(e => e.Email == entity.Email);
                if (checkUniqeUserEmail.Count > 0)
                    throw new Exception("Користувач з введеним Email уже існує");
            }

            List<UserModel> checkUniqeUserLogin = await GetOrDefaultAsync(e => e.Login == entity.Login);
            if (checkUniqeUserLogin.Count > 0)
                throw new Exception("Користувач з введеним Логіном уже існує");

            await base.CreateAsync(entity);
            return entity;
        }
        
        public override async Task<UserModel> UpdateAsync(UserModel newUser)
        {
            if (!string.IsNullOrEmpty(newUser.Email))
            {
                List<UserModel> checkUniqeUserEmail = await GetOrDefaultAsync(e => e.Email == newUser.Email && e.Id != newUser.Id);
                if (checkUniqeUserEmail.Count > 0)
                    throw new Exception("Користувач з введеним Email уже існує");
            }

            List<UserModel> checkUniqeUserLogin = await GetOrDefaultAsync(e => e.Login == newUser.Login && e.Id != newUser.Id);
            if (checkUniqeUserLogin.Count > 0)
                throw new Exception("Користувач з введеним Логіном уже існує");

            UserModel addedUser = await GetByIdAsync(newUser.Id);
            addedUser.FirstName = newUser.FirstName;
            addedUser.LastName = newUser.LastName;
            addedUser.MiddleName = newUser.MiddleName;
            addedUser.Email = newUser.Email;
            addedUser.Login = newUser.Login;
            addedUser.DateOfBirth = newUser.DateOfBirth;
            addedUser.Role = newUser.Role;
            addedUser.GradeId = newUser.GradeId;
            await _context.SaveChangesAsync();
            return newUser;
        }

        public async Task<UserModel> GetByLoginAsync(string login)
        {
            UserModel? user = await GetByLoginOrDefaultAsync(login);
            if (user == null)
                throw new Exception("Користувач з введеним Логіном не існує");
            return user;
        }
        
        public async Task<UserModel?> GetByLoginOrDefaultAsync(string login)
        {
            List<UserModel> users = await GetOrDefaultAsync(e => e.Login == login);
            if (users == null || users.Count == 0)
                return null;
            return users[0];
        }
    }
}
