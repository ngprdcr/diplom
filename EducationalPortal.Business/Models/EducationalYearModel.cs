using EducationalPortal.Business.Abstractions;

namespace EducationalPortal.Business.Models
{
    public class EducationalYearModel : BaseModel
    {
        public string Name { get; set; }
        public DateTime DateStart { get; set; }
        public DateTime DateEnd { get; set; }
        public bool IsCurrent { get; set; }
        public virtual List<SubjectModel>? Subjects { get; set; }
    }
}
