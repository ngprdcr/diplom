using GraphQL.Types;

namespace EducationalPortal.Server.GraphQL.Modules.SubjectPosts
{
    public class SubjectPostStatistic
    {
        public string Key { get; set; }
        public int Value { get; set; }
        public string HashColor { get; set; }
    }

    public class SubjectPostStatisticType : ObjectGraphType<SubjectPostStatistic>
    {
        public SubjectPostStatisticType()
        {
            Field<NonNullGraphType<StringGraphType>, string>()
                .Name("Key")
                .Resolve(context => context.Source.Key);
            
            Field<NonNullGraphType<IntGraphType>, int>()
                .Name("Value")
                .Resolve(context => context.Source.Value);
            
            Field<NonNullGraphType<StringGraphType>, string>()
                .Name("HashColor")
                .Resolve(context => context.Source.HashColor);
        }
    }
}
