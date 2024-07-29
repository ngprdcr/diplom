using EducationalPortal.Business.Abstractions;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPortal.Business.Models
{
    public class SubjectModel : BaseModel
    {
        public string Name { get; set; }
        public string? Link { get; set; }
        public virtual List<SubjectPostModel>? Posts { get; set; }
        [NotMapped]
        public virtual List<Guid> GradesHaveAccessReadIds { get; set; }
        public virtual List<GradeModel>? GradesHaveAccessRead { get; set; }
        [NotMapped]
        public virtual List<Guid> TeachersHaveAccessCreatePostsIds { get; set; }
        public virtual List<UserModel>? TeachersHaveAccessCreatePosts { get; set; }
        public Guid? TeacherId { get; set; }
        public virtual UserModel? Teacher { get; set; }
        public Guid? EducationalYearId { get; set; }
        public virtual EducationalYearModel? EducationalYear { get; set; }
    }
}
