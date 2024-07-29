using EducationalPortal.Business.Models;
using GraphQL.Types;

namespace EducationalPortal.Server.GraphQL.Modules.Subjects.DTO
{
    public class CreateSubjectInputType : InputObjectGraphType<SubjectModel>
    {
        public CreateSubjectInputType()
        {
            Field<NonNullGraphType<StringGraphType>, string>()
               .Name("Name")
               .Resolve(context => context.Source.Name);
            
            Field<NonNullGraphType<ListGraphType<IdGraphType>>, List<Guid>>()
               .Name("GradesHaveAccessReadIds")
               .Resolve(context => context.Source.GradesHaveAccessReadIds);
            
            Field<NonNullGraphType<ListGraphType<IdGraphType>>, List<Guid>>()
               .Name("TeachersHaveAccessCreatePostsIds")
               .Resolve(context => context.Source.TeachersHaveAccessCreatePostsIds);
        }
    }
}
