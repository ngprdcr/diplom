using EducationalPortal.Business.Enums;
using EducationalPortal.Business.Models;
using EducationalPortal.Business.Repositories;
using EducationalPortal.Server.Extensions;
using EducationalPortal.Server.GraphQL.Abstraction;
using EducationalPortal.Server.GraphQL.Modules.Auth;
using EducationalPortal.Server.GraphQL.Modules.Homeworks.DTO;
using EducationalPortal.Server.Services;
using GraphQL;
using GraphQL.Types;

namespace EducationalPortal.Server.GraphQL.Modules.Homeworks
{
    public class HomeworksMutations : ObjectGraphType, IMutationMarker
    {
        public HomeworksMutations(IHomeworkRepository homeworkRepository, IHttpContextAccessor httpContextAccessor, CloudinaryService cloudinaryService, IFileRepository fileRepository)
        {
            Field<NonNullGraphType<HomeworkType>, HomeworkModel>()
                .Name("CreateHomework")
                .Argument<NonNullGraphType<CreateHomeworkInputType>, CreateHomeworkInput>("CreateHomeworkInputType", "Argument for create new Homework")
                .ResolveAsync(async context =>
                {
                    CreateHomeworkInput createHomeworkInput = context.GetArgument<CreateHomeworkInput>("CreateHomeworkInputType");
                    var homework = createHomeworkInput.ToModel();
                    Guid currentStudentId = httpContextAccessor.HttpContext.GetUserId();
                    homework.StudentId = currentStudentId;
                    await homeworkRepository.CreateAsync(homework);
                    if (createHomeworkInput.Files != null)
                    {
                        foreach(var file in createHomeworkInput.Files)
                        {
                            var fileUplaod = new FileModel
                            {
                                Name = file.FileName,
                                Path = await cloudinaryService.UploadFileAsync(file),
                                HomeworkId = homework.Id,
                                CreatorId = currentStudentId,
                            };
                            await fileRepository.CreateAsync(fileUplaod);
                        }
                    }
                    return homework;
                })
                .AuthorizeWith(AuthPolicies.Student);

            Field<NonNullGraphType<HomeworkType>, HomeworkModel>()
                .Name("UpdateHomework")
                .Argument<NonNullGraphType<UpdateHomeworkInputType>, HomeworkModel>("UpdateHomeworkInputType", "Argument for update Homework")
                .ResolveAsync(async context =>
                {
                    HomeworkModel newHomework = context.GetArgument<HomeworkModel>("UpdateHomeworkInputType");
                    Guid currentTeacherId = httpContextAccessor.HttpContext.GetUserId();
                    UserRoleEnum currentTeacherRole = httpContextAccessor.HttpContext.GetRole();
                    HomeworkModel oldHomework = await homeworkRepository.GetByIdAsync(newHomework.Id, h => h.SubjectPost.Subject.TeachersHaveAccessCreatePosts);
                    if (currentTeacherId != oldHomework.SubjectPost.Subject.TeacherId 
                        && !oldHomework.SubjectPost.Subject.TeachersHaveAccessCreatePosts.Any(t => t.Id == currentTeacherId)
                        && currentTeacherRole != UserRoleEnum.Administrator)
                        throw new Exception("Ви не маєте прав на редагування даної доманьої роботи");
                    return await homeworkRepository.UpdateAsync(newHomework);
                })
                .AuthorizeWith(AuthPolicies.Teacher);

            Field<NonNullGraphType<BooleanGraphType>, bool>()
               .Name("RemoveHomework")
               .Argument<NonNullGraphType<IdGraphType>, Guid>("Id", "Argument for remove Homework")
               .ResolveAsync(async (context) =>
               {
                   Guid id = context.GetArgument<Guid>("Id");
                   var homework = await homeworkRepository.GetByIdAsync(id);
                   var userId = httpContextAccessor.HttpContext.GetUserId();
                   var userRole = httpContextAccessor.HttpContext.GetRole();
                   if (homework.StudentId != userId && userRole != UserRoleEnum.Administrator)
                       throw new Exception("Ви не маєте прав на видалення даної доманьої роботи");
                   await homeworkRepository.RemoveAsync(id);
                   return true;
               })
               .AuthorizeWith(AuthPolicies.Student);
        }
    }
}
