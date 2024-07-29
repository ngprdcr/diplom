using EducationalPortal.Business.Repositories;
using EducationalPortal.Server.GraphQL.Abstraction;
using EducationalPortal.Server.GraphQL.Modules.Auth;
using EducationalPortal.Server.Services;
using GraphQL;
using GraphQL.Types;

namespace EducationalPortal.Server.GraphQL.Modules.Back_ups
{
    public class BackupsQueries : ObjectGraphType, IQueryMarker
    {
        public BackupsQueries(CloudinaryService cloudinaryService)
        {
            Field<NonNullGraphType<ListGraphType<BackupType>>, IEnumerable<BackupModel>>()
                .Name("GetBackups")
                .Argument<NonNullGraphType<IntGraphType>, int>("Page", "Argument for get Backups")
                .Argument<NonNullGraphType<StringGraphType>, string>("Like", "Argument for get Backups")
                .ResolveAsync(async context =>
                {
                    int page = context.GetArgument<int>("Page");
                    string like = context.GetArgument<string>("Like");
                    var backups = await cloudinaryService.GetFilesLinks("format:bak");
                    return backups;
                })
               .AuthorizeWith(AuthPolicies.Teacher);
        }
    }
}
