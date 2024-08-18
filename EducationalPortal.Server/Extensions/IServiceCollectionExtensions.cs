using EducationalPortal.Business.Enums;
using EducationalPortal.Server.GraphQL;
using EducationalPortal.Server.GraphQL.Abstraction;
using EducationalPortal.Server.GraphQL.Modules.Auth;
using EducationalPortal.Server.GraphQL.Modules.Back_ups;
using EducationalPortal.Server.GraphQL.Modules.EducationalYears;
using EducationalPortal.Server.GraphQL.Modules.Grades;
using EducationalPortal.Server.GraphQL.Modules.Homeworks;
using EducationalPortal.Server.GraphQL.Modules.Settings;
using EducationalPortal.Server.GraphQL.Modules.SubjectPosts;
using EducationalPortal.Server.GraphQL.Modules.Subjects;
using EducationalPortal.Server.GraphQL.Modules.Users;
using EducationalPortal.Server.Services;
using GraphQL;
using GraphQL.Server;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;

namespace EducationalPortal.Server.Extensions
{
    public static class IServiceCollectionExtensions
    {
        public static IServiceCollection AddGraphQLApi(this IServiceCollection services)
        {
            services.AddMemoryCache();
            services.AddTransient<IHttpContextAccessor, HttpContextAccessor>();
            services.AddSingleton<IDocumentExecuter, DocumentExecuter>();

            services.AddTransient<IQueryMarker, BackupsQueries>();
            services.AddTransient<IMutationMarker, BackupsMutations>();

            services.AddTransient<IQueryMarker, AuthQueries>();
            services.AddTransient<IMutationMarker, AuthMutations>();

            services.AddTransient<IQueryMarker, EducationalYearsQueries>();
            services.AddTransient<IMutationMarker, EducationalYearsMutations>();

            services.AddTransient<IQueryMarker, SettingsQueries>();
            services.AddTransient<IMutationMarker, SettingsMutations>();

            services.AddTransient<IQueryMarker, GradesQueries>();
            services.AddTransient<IMutationMarker, GradesMutations>();

            services.AddTransient<IQueryMarker, HomeworksQueries>();
            services.AddTransient<IMutationMarker, HomeworksMutations>();

            services.AddTransient<IQueryMarker, SubjectPostsQueries>();
            services.AddTransient<IMutationMarker, SubjectPostsMutations>();

            services.AddTransient<IQueryMarker, SubjectsQueries>();
            services.AddTransient<IMutationMarker, SubjectsMutations>();

            services.AddTransient<IQueryMarker, UsersQueries>();
            services.AddTransient<IMutationMarker, UsersMutations>();

            services.AddTransient<IQueryMarker, JournalMarksQueries>();
            services.AddTransient<IMutationMarker, JournalMarksMutations>();

            services.AddTransient<AppSchema>();
            services.AddGraphQLUpload();
            services
                .AddGraphQL(options =>
                {
                    options.EnableMetrics = true;
                    options.UnhandledExceptionDelegate = (context) =>
                    {
                        Console.WriteLine(context.Exception.StackTrace);
                        context.ErrorMessage = context.Exception.Message;
                    };
                })
                .AddSystemTextJson()
                .AddGraphTypes(typeof(AppSchema), ServiceLifetime.Transient)
                .AddGraphQLAuthorization(options =>
                {
                    options.AddPolicy(AuthPolicies.Authenticated, p => p.RequireAuthenticatedUser());
                    options.AddPolicy(AuthPolicies.Student, p => p.RequireClaim(ClaimTypes.Role, UserRoleEnum.Student.ToString(), UserRoleEnum.Parent.ToString(), UserRoleEnum.Teacher.ToString(), UserRoleEnum.Administrator.ToString()));
                    options.AddPolicy(AuthPolicies.Parent, p => p.RequireClaim(ClaimTypes.Role, UserRoleEnum.Parent.ToString(), UserRoleEnum.Administrator.ToString()));
                    options.AddPolicy(AuthPolicies.Teacher, p => p.RequireClaim(ClaimTypes.Role, UserRoleEnum.Teacher.ToString(), UserRoleEnum.Administrator.ToString()));
                    options.AddPolicy(AuthPolicies.Administrator, p => p.RequireClaim(ClaimTypes.Role, UserRoleEnum.Administrator.ToString()));
                });
            return services;
        }

        public static IServiceCollection AddJwtAuthorization(this IServiceCollection services)
        {
            services.AddAuthentication(options =>
            {
                options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateAudience = true,
                    ValidateIssuer = true,
                    ValidateIssuerSigningKey = true,
                    ValidAudience = Environment.GetEnvironmentVariable("AuthValidAudience"),
                    ValidIssuer = Environment.GetEnvironmentVariable("AuthValidIssuer"),
                    RequireSignedTokens = false,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("AuthIssuerSigningKey"))),
                };
                options.RequireHttpsMetadata = false;
                options.SaveToken = true;
            });
            return services;
        }

        public static IServiceCollection AddServices(this IServiceCollection services, bool isDevelopment)
        {
            services.AddTransient<AuthService>();
            services.AddSingleton<CloudinaryService>();
            if (!isDevelopment)
                services.AddSingleton<IHostedService, AutoBackupService>();
            return services;
        }
    }
}
