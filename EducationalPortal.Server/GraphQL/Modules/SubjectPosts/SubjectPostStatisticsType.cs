using GraphQL.Types;

namespace EducationalPortal.Server.GraphQL.Modules.SubjectPosts
{
    public class SubjectPostStatistics
    {
        public SubjectPostStatistic New { get; set; }
        public SubjectPostStatistic Approved { get; set; }
        public SubjectPostStatistic Unapproved { get; set; }
    }

    public class SubjectPostStatisticsType : ObjectGraphType<SubjectPostStatistics>
    {
        public SubjectPostStatisticsType()
        {
            Field<NonNullGraphType<SubjectPostStatisticType>, SubjectPostStatistic>()
                .Name("New")
                .Resolve(context => context.Source.New);
            
            Field<NonNullGraphType<SubjectPostStatisticType>, SubjectPostStatistic>()
                .Name("Approved")
                .Resolve(context => context.Source.Approved);
            
            Field<NonNullGraphType<SubjectPostStatisticType>, SubjectPostStatistic>()
                .Name("Unapproved")
                .Resolve(context => context.Source.Unapproved);
        }
    }
}
