using EducationalPortal.Business.Repositories;
using EducationalPortal.Server.GraphQL.Abstraction;
using EducationalPortal.Server.GraphQL.Modules.Auth;
using EducationalPortal.Server.Services;
using GraphQL;
using GraphQL.Types;

namespace EducationalPortal.Server.GraphQL.Modules.Back_ups
{
    public class BackupsMutations : ObjectGraphType, IMutationMarker
    {
        public BackupsMutations(IBackupRepository backupRepository, CloudinaryService cloudinaryService, IFileRepository fileRepository, IHttpContextAccessor httpContextAccessor)
        {
            Field<NonNullGraphType<BooleanGraphType>, bool>()
                .Name("CreateBackup")
                .ResolveAsync(async context =>
                {
                    string backupFullPath = await backupRepository.BackupDatabase();
                    using var stream = new MemoryStream(File.ReadAllBytes(backupFullPath).ToArray());
                    string backupName = Path.GetFileName(backupFullPath);
                    FormFile formFile = new FormFile(stream, 0, stream.Length, backupName, backupName);
                    string urlPath = await cloudinaryService.UploadFileAsync(formFile, false);
                    return true;
                })
                .AuthorizeWith(AuthPolicies.Administrator);

            Field<NonNullGraphType<BooleanGraphType>, bool>()
                .Name("RestoreBackup")
                .Argument<NonNullGraphType<StringGraphType>, string>("Url", "Argument for Restore Backup")
                .ResolveAsync(async context =>
                {
                    var url = context.GetArgument<string>("Url");
                    string filename = Path.GetFileName(url);
                    string backupFullPath = $@"{Environment.GetEnvironmentVariable("BACKUPS_FOLDER_PATH")}\{filename}";
                    if (!File.Exists(backupFullPath))
                    {
                        using (var httpClient = new HttpClient())
                        {
                            byte[] fileBytes = await httpClient.GetByteArrayAsync(new Uri(url));
                            await File.WriteAllBytesAsync(backupFullPath, fileBytes);
                        }
                    }
                    await backupRepository.RestoreDatabase(backupFullPath);
                    return true;
                })
                .AuthorizeWith(AuthPolicies.Administrator);

            Field<NonNullGraphType<BooleanGraphType>, bool>()
               .Name("RemoveBackup")
               .Argument<NonNullGraphType<StringGraphType>, string>("Url", "Argument for remove Backup")
               .ResolveAsync(async context =>
               {
                   string url = context.GetArgument<string>("Url");
                   await cloudinaryService.RemoveAsync(url);
                   return true;
               })
               .AuthorizeWith(AuthPolicies.Administrator);
        }
    }
}
