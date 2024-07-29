using EducationalPortal.Business.Abstractions;

namespace EducationalPortal.Business.Models
{
    public class SettingModel : BaseModel
    {
        public string Name { get; set; }
        public string? Value { get; set; }
    }
}
