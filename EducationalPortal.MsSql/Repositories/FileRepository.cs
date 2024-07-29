using EducationalPortal.Business.Abstractions;
using EducationalPortal.Business.Models;
using EducationalPortal.Business.Repositories;
using EducationalPortal.MsSql.Abstractions;

namespace EducationalPortal.MsSql.Repositories
{
    public class FileRepository : BaseRepository<FileModel>, IFileRepository
    {
        private readonly AppDbContext context;

        public FileRepository(AppDbContext context) : base(context)
        {
            this.context = context;
        }

     
    }
}
