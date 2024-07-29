using EducationalPortal.Business.Models;
using EducationalPortal.Server.GraphQL.Abstraction;
using GraphQL.Types;

namespace EducationalPortal.Server.GraphQL.Modules.Files
{
    public class FileType : BaseType<FileModel>
    {
        public FileType() : base()
        {
            Field<NonNullGraphType<StringGraphType>, string>()
                .Name("Name")
                .Resolve(context => context.Source.Name);
            
            Field<NonNullGraphType<StringGraphType>, string>()
                .Name("Path")
                .Resolve(context => context.Source.Path);
        }
    }
}
