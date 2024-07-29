using EducationalPortal.Business.Abstractions;
using EducationalPortal.Business.Models;

namespace EducationalPortal.Business.Repositories
{
    public interface IBackupRepository
    {
        Task<string> BackupDatabase();
        Task RestoreDatabase(string backupFullPath);
    }
}
