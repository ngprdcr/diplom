using EducationalPortal.Business.Abstractions;
using EducationalPortal.Business.Enums;
using System.Text.Json.Serialization;

namespace EducationalPortal.Business.Models
{
    public class UserModel : BaseModel
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? MiddleName { get; set; }
        public string Login { get; set; }
        public string? Email { get; set; }
        public bool IsEmailConfirmed { get; set; }
        [JsonIgnore]
        public string Password { get; set; }
        public string? PhoneNumber { get; set; }
        public DateTime DateOfBirth { get; set; }
        public UserRoleEnum Role { get; set; }

        public Guid? MotherId { get; set; }
        public UserModel? Mother { get; set; }

        public Guid? FatherId { get; set; }
        public UserModel? Father { get; set; }

        public Guid? GradeId { get; set; }
        public virtual GradeModel? Grade { get; set; }

        public virtual List<SubjectModel>? Subjects { get; set; }
        public virtual List<SubjectModel>? SubjectHaveAccessCreatePosts { get; set; }
        public virtual List<HomeworkModel>? Homeworks { get; set; }
    }
}
