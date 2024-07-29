using EducationalPortal.Business.Abstractions;
using EducationalPortal.Business.Enums;

namespace EducationalPortal.Business.Models
{
    public class SubjectPostModel : BaseModel
    {
        public string Title { get; set; }
        public string Text { get; set; }
        public PostType Type { get; set; }

        public Guid? SubjectId { get; set; }
        public virtual SubjectModel? Subject { get; set; }
        public Guid? TeacherId { get; set; }
        public virtual UserModel? Teacher { get; set; }
        public virtual List<HomeworkModel>? Homeworks { get; set; }
    }
}
