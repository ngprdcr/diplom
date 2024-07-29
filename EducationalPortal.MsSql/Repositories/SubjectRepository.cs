using EducationalPortal.Business.Models;
using EducationalPortal.Business.Repositories;
using EducationalPortal.MsSql.Abstractions;
using Microsoft.EntityFrameworkCore;

namespace EducationalPortal.MsSql.Repositories
{
    public class SubjectRepository : BaseRepository<SubjectModel>, ISubjectRepository
    {
        private readonly AppDbContext _context;
        private readonly IEducationalYearRepository _educationalYearRepository;
        private readonly IGradeRepository _gradeRepository;
        private readonly IUserRepository _userRepository;
        public SubjectRepository(AppDbContext context, IEducationalYearRepository educationalYearRepository, IGradeRepository gradeRepository, IUserRepository userRepository) : base(context)
        {
            _context = context;
            _educationalYearRepository = educationalYearRepository;
            _gradeRepository = gradeRepository;
            _userRepository = userRepository;
        }

        public override async Task<SubjectModel> CreateAsync(SubjectModel subject)
        {
            var currentEducationalYear = await _educationalYearRepository.GetCurrentAsync();
            subject.EducationalYearId = currentEducationalYear.Id;
            await base.CreateAsync(subject);
            _context.Entry(subject).State = EntityState.Detached;

            SubjectModel addedSubject = await GetByIdAsync(subject.Id, s => s.GradesHaveAccessRead, s => s.TeachersHaveAccessCreatePosts);
            foreach (var gradeId in subject.GradesHaveAccessReadIds.Distinct())
            {
                GradeModel grade = await _gradeRepository.GetByIdAsync(gradeId);
                addedSubject.GradesHaveAccessRead.Add(grade);
            }
            foreach (var teacherId in subject.TeachersHaveAccessCreatePostsIds.Distinct())
            {
                UserModel teacher = await _userRepository.GetByIdAsync(teacherId);
                addedSubject.TeachersHaveAccessCreatePosts.Add(teacher);
            }
            await base.UpdateAsync(addedSubject);
            return addedSubject;
        }

        public override async Task<SubjectModel> UpdateAsync(SubjectModel newSubject)
        {
            SubjectModel addedSubject = await GetByIdAsync(newSubject.Id, s => s.GradesHaveAccessRead, s => s.TeachersHaveAccessCreatePosts);
            addedSubject.Name = newSubject.Name;
            addedSubject.Link = newSubject.Link;

            addedSubject.GradesHaveAccessRead = addedSubject.GradesHaveAccessRead.Where(g => newSubject.GradesHaveAccessReadIds.Any(gId => gId == g.Id)).ToList();
            foreach (var gradeId in newSubject.GradesHaveAccessReadIds.Distinct())
            {
                if (!addedSubject.GradesHaveAccessRead.Any(g => g.Id == gradeId))
                {
                    GradeModel grade = await _gradeRepository.GetByIdAsync(gradeId);
                    addedSubject.GradesHaveAccessRead.Add(grade);
                }
            }

            addedSubject.TeachersHaveAccessCreatePosts = addedSubject.TeachersHaveAccessCreatePosts.Where(t => newSubject.TeachersHaveAccessCreatePostsIds.Any(tId => tId == t.Id)).ToList();
            foreach (var teacherId in newSubject.TeachersHaveAccessCreatePostsIds.Distinct())
            {
                if (!addedSubject.TeachersHaveAccessCreatePosts.Any(t => t.Id == teacherId))
                {
                    UserModel teacher = await _userRepository.GetByIdAsync(teacherId);
                    addedSubject.TeachersHaveAccessCreatePosts.Add(teacher);
                }
            }

            await _context.SaveChangesAsync();
            return addedSubject;
        }
    }
}
