using EducationalPortal.Business.Repositories;
using EducationalPortal.MsSql.Repositories;
using Microsoft.Extensions.DependencyInjection;

namespace EducationalPortal.MsSql.Extensions
{
    public static class IServiceCollectionExtensions
    {
        public static IServiceCollection AddMsSql(this IServiceCollection services)
        {
            services.AddDbContext<AppDbContext>(ServiceLifetime.Scoped);
            services.AddScoped<IBackupRepository, BackupRepository>();
            services.AddScoped<IEducationalYearRepository, EducationalYearRepository>();
            services.AddScoped<IFileRepository, FileRepository>();
            services.AddScoped<IGradeRepository, GradeRepository>();
            services.AddScoped<IHomeworkRepository, HomeworkRepository>();
            services.AddScoped<ISettingRepository, SettingRepository>();
            services.AddScoped<ISubjectPostRepository, SubjectPostRepository>();
            services.AddScoped<ISubjectRepository, SubjectRepository>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IJournalMarkRepository, JournalMarkRepository>();
            return services;
        }
    }
}
