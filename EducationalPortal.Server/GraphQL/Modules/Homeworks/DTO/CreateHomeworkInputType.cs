using GraphQL.Types;
using GraphQL.Upload.AspNetCore;

namespace EducationalPortal.Server.GraphQL.Modules.Homeworks.DTO
{
    public class CreateHomeworkInputType : InputObjectGraphType<CreateHomeworkInput>
    {
        public CreateHomeworkInputType()
        {
            Field<StringGraphType, string?>()
               .Name("Text")
               .Resolve(context => context.Source.Text);
            
            Field<NonNullGraphType<IdGraphType>, Guid?>()
               .Name("SubjectPostId")
               .Resolve(context => context.Source.SubjectPostId);
            
            Field<ListGraphType<UploadGraphType>, IEnumerable<IFormFile>?>()
               .Name("Files")
               .Resolve(context => context.Source.Files);
        }
    }
}
