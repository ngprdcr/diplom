using EducationalPortal.Business.Abstractions;

namespace EducationalPortal.Business.Models
{
    public class GradeModel : BaseModel
    {
        public string Name { get; set; }
        public virtual List<UserModel>? Students { get; set; }
        public virtual List<SubjectModel>? SubjectsHaveAccessRead { get; set; }
    }
}
