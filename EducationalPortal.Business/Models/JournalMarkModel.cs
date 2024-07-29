using EducationalPortal.Business.Abstractions;

namespace EducationalPortal.Business.Models
{
    public class JournalMarkModel : BaseModel
    {
        public int Mark { get; set; }
        public DateTime Date { get; set; }
        public Guid SubjectId { get; set; }
        public virtual SubjectModel? Subject { get; set; }
        public Guid StudentId { get; set; }
        public virtual UserModel? Student { get; set; }
    }
}
