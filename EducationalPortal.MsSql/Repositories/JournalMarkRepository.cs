using EducationalPortal.Business.Models;
using EducationalPortal.Business.Repositories;
using EducationalPortal.MsSql.Abstractions;

namespace EducationalPortal.MsSql.Repositories
{
    public class JournalMarkRepository : BaseRepository<JournalMarkModel>, IJournalMarkRepository
    {
        private readonly AppDbContext _context;
        public JournalMarkRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }


    }
}
