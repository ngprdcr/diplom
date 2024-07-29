using EducationalPortal.Business.Models;
using EducationalPortal.Business.Repositories;
using EducationalPortal.MsSql.Abstractions;
using Microsoft.EntityFrameworkCore;

namespace EducationalPortal.MsSql.Repositories
{
    public class BackupRepository : IBackupRepository
    {
        private readonly AppDbContext context;

        public BackupRepository(AppDbContext context) 
        {
            this.context = context;
        }

        public async Task<string> BackupDatabase()
        {
            string database = context.Database.GetDbConnection().Database;
            string name = $"{DateTime.Now.ToString("yyyy.MM.dd_HH-mm-ss-fff")}.bak";
            string fullPath = $@"{Environment.GetEnvironmentVariable("BACKUPS_FOLDER_PATH")}\{name}";
            await context.Database.ExecuteSqlRawAsync($@"
                BACKUP DATABASE [{database}]
                TO DISK = '{fullPath}' WITH INIT");
            return fullPath;
        }
        
        public Task RestoreDatabase(string backupFullPath)
        {
            string database = context.Database.GetDbConnection().Database;
            return context.Database.ExecuteSqlRawAsync($@"
                USE master
                ALTER DATABASE [{database}]
                SET SINGLE_USER
                --This rolls back all uncommitted transactions in the db.
                WITH ROLLBACK IMMEDIATE
                RESTORE DATABASE {database}
                FROM DISK = N'{backupFullPath}'
                WITH RECOVERY, REPLACE");
        }
    }
}
