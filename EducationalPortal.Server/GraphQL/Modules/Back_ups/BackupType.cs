using EducationalPortal.Business.Models;
using EducationalPortal.Business.Repositories;
using EducationalPortal.Server.GraphQL.Abstraction;
using EducationalPortal.Server.GraphQL.Modules.Files;
using GraphQL.Types;

namespace EducationalPortal.Server.GraphQL.Modules.Back_ups
{
    public class BackupModel
    {
        public string Url { get; set; }
    }

    public class BackupType : ObjectGraphType<BackupModel>
    {
        public BackupType() : base()
        {
            Field<NonNullGraphType<StringGraphType>, string>()
                .Name("Url")
                .Resolve(context => context.Source.Url);
        }
    }
}
