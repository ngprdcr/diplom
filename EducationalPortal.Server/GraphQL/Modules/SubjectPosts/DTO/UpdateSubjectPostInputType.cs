using EducationalPortal.Business.Enums;
using EducationalPortal.Business.Models;
using GraphQL.Types;

namespace EducationalPortal.Server.GraphQL.Modules.SubjectPosts.DTO
{
    public class UpdateSubjectPostInputType : InputObjectGraphType<SubjectPostModel>
    {
        public UpdateSubjectPostInputType()
        {
            Field<NonNullGraphType<IdGraphType>, Guid>()
               .Name("Id")
               .Resolve(context => context.Source.Id);
            
            Field<NonNullGraphType<StringGraphType>, string>()
               .Name("Title")
               .Resolve(context => context.Source.Title);

            Field<StringGraphType, string>()
               .Name("Text")
               .Resolve(context => context.Source.Text);

            Field<NonNullGraphType<PostTypeType>, PostType>()
               .Name("Type")
               .Resolve(context => context.Source.Type);
        }
    }
}
