namespace EducationalPortal.Business.Abstractions
{
    public class GetEntitiesResponse<T> where T : BaseModel
    {
        public IEnumerable<T> Entities { get; set; } = Array.Empty<T>();
        public int Total { get; set; }
        public int PageSize { get; set; } = 20;
    }
}
