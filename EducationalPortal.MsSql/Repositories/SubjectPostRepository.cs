using EducationalPortal.Business.Models;
using EducationalPortal.Business.Repositories;
using EducationalPortal.MsSql.Abstractions;

namespace EducationalPortal.MsSql.Repositories
{
    public class SubjectPostRepository : BaseRepository<SubjectPostModel>, ISubjectPostRepository
    {
        private readonly AppDbContext _context;
        public SubjectPostRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }
        
        public async Task<SubjectPostModel> UpdateAsync(SubjectPostModel newSubjectPost)
        {
            SubjectPostModel addedSubjectPost = await GetByIdAsync(newSubjectPost.Id);
            addedSubjectPost.Title = newSubjectPost.Title;
            addedSubjectPost.Text = newSubjectPost.Text;
            addedSubjectPost.Type = newSubjectPost.Type;
            await _context.SaveChangesAsync();
            return addedSubjectPost;
        }
    }
}
