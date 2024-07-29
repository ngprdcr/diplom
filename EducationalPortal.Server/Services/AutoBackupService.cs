using EducationalPortal.Business.Repositories;

namespace EducationalPortal.Server.Services
{
    public class AutoBackupService : IHostedService
    {
        private Timer timer;
        private readonly IServiceScopeFactory serviceScopeFactory;

        public AutoBackupService(IServiceScopeFactory serviceScopeFactory)
        {
            this.serviceScopeFactory = serviceScopeFactory;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            timer = new Timer(
                new TimerCallback(AutoDatabaseAction),
                 null,
                 TimeSpan.Zero,
                 TimeSpan.FromDays(7)
                 );
            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            timer?.Change(Timeout.Infinite, 0);
            return Task.CompletedTask;
        }

        private async void AutoDatabaseAction(object _)
        {
            using var scope = serviceScopeFactory.CreateScope();
            var backupRepository = scope.ServiceProvider.GetRequiredService<IBackupRepository>();
            var cloudinaryService = scope.ServiceProvider.GetRequiredService<CloudinaryService>();
            try
            {
                string backupFullPath = await backupRepository.BackupDatabase();
                using var stream = new MemoryStream(File.ReadAllBytes(backupFullPath).ToArray());
                string backupName = Path.GetFileName(backupFullPath);
                FormFile formFile = new FormFile(stream, 0, stream.Length, backupName, backupName);
                string urlPath = await cloudinaryService.UploadFileAsync(formFile, false);
            }
            catch { }
        }
    }
}
