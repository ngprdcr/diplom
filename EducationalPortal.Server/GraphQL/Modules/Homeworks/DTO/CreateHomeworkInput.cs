using EducationalPortal.Business.Models;
using EducationalPortal.Server.GraphQL.Abstraction;

namespace EducationalPortal.Server.GraphQL.Modules.Homeworks.DTO
{
    public class CreateHomeworkInput : IModelable<HomeworkModel>
    {
        public string? Text { get; set; }
        public Guid? SubjectPostId { get; set; }
        public IEnumerable<IFormFile>? Files { get; set; }

        public HomeworkModel ToModel()
        {
            return new HomeworkModel
            {
                Text = Text,
                SubjectPostId = SubjectPostId,
            };
        }
    }
}
