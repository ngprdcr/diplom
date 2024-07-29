using EducationalPortal.Business.Abstractions;

namespace EducationalPortal.Business.Models
{
    public class FileModel : BaseModel
    {
        public string Name { get; set; }
        public string Path { get; set; }

        public Guid? HomeworkId { get; set; }
        public virtual HomeworkModel? Homework { get; set; }
        public Guid? CreatorId { get; set; }
        public virtual UserModel? Creator { get; set; }
    }
}
