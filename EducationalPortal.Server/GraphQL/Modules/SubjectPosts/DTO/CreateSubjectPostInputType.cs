using EducationalPortal.Business.Enums;
using EducationalPortal.Business.Models;
using GraphQL.Types;

namespace EducationalPortal.Server.GraphQL.Modules.SubjectPosts.DTO
{
    public class CreateSubjectPostInputType : InputObjectGraphType<SubjectPostModel>
    {
        public CreateSubjectPostInputType()
        {
            Field<NonNullGraphType<StringGraphType>, string>()
               .Name("Title")
               .Resolve(context => context.Source.Title);

            Field<StringGraphType, string>()
               .Name("Text")
               .Resolve(context => context.Source.Text);

            Field<NonNullGraphType<PostTypeType>, PostType>()
               .Name("Type")
               .Resolve(context => context.Source.Type);

            Field<NonNullGraphType<IdGraphType>, Guid?>()
               .Name("SubjectId")
               .Resolve(context => context.Source.SubjectId);
        }
    }
}
