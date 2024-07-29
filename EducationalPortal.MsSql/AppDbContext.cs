using EducationalPortal.Business.Abstractions;
using EducationalPortal.Business.Enums;
using EducationalPortal.Business.Models;
using Microsoft.EntityFrameworkCore;

namespace EducationalPortal.MsSql
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
            Database.Migrate();
        }

        public DbSet<JournalMarkModel> JournalMarks { get; set; }
        public DbSet<EducationalYearModel> EducationalYears { get; set; }
        public DbSet<FileModel> Files { get; set; }
        public DbSet<GradeModel> Grades { get; set; }
        public DbSet<HomeworkModel> Homeworks { get; set; }
        public DbSet<SettingModel> Settings { get; set; }
        public DbSet<SubjectModel> Subjects { get; set; }
        public DbSet<SubjectPostModel> SubjectPosts { get; set; }
        public DbSet<UserModel> Users { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(Environment.GetEnvironmentVariable("MS_SQL_DATABASE_URL") ?? @"Data Source=(localdb)\\mssqllocaldb;Initial Catalog=EducationPortal;Integrated Security=True;Connect Timeout=30;Encrypt=False;Trust Server Certificate=False;Application Intent=ReadWrite;Multi Subnet Failover=False");
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<EducationalYearModel>(y => y.HasIndex(e => e.Name).IsUnique());
            builder.Entity<EducationalYearModel>().HasMany(y => y.Subjects).WithOne(s => s.EducationalYear).OnDelete(DeleteBehavior.Cascade);

            builder.Entity<GradeModel>(g => g.HasIndex(e => e.Name).IsUnique());
            builder.Entity<GradeModel>().HasMany(g => g.Students).WithOne(s => s.Grade).OnDelete(DeleteBehavior.SetNull);

            builder.Entity<HomeworkModel>().HasOne(h => h.Student).WithMany(s => s.Homeworks).OnDelete(DeleteBehavior.SetNull);
            builder.Entity<HomeworkModel>().HasOne(h => h.SubjectPost).WithMany(s => s.Homeworks).OnDelete(DeleteBehavior.SetNull);

            builder.Entity<SettingModel>(s => s.HasIndex(s => s.Name).IsUnique());

            builder.Entity<SubjectModel>().HasOne(s => s.EducationalYear).WithMany(y => y.Subjects).OnDelete(DeleteBehavior.SetNull);
            builder.Entity<SubjectModel>().HasMany(s => s.Posts).WithOne(y => y.Subject).OnDelete(DeleteBehavior.Cascade);
            builder.Entity<SubjectModel>().HasMany(s => s.TeachersHaveAccessCreatePosts).WithMany(t => t.SubjectHaveAccessCreatePosts);
            builder.Entity<SubjectModel>().HasOne(s => s.Teacher).WithMany(t => t.Subjects);

            builder.Entity<UserModel>(u => u.HasIndex(e => e.Login).IsUnique());
            builder.Entity<UserModel>(u => u.HasIndex(e => e.Email).IsUnique());
            builder.Entity<UserModel>().Property(u => u.Role).HasConversion(r => r.ToString(), r => (UserRoleEnum)Enum.Parse(typeof(UserRoleEnum), r));
            builder.Entity<UserModel>().HasOne(p => p.Grade).WithMany(g => g.Students).OnDelete(DeleteBehavior.SetNull);

            base.OnModelCreating(builder);
        }

        public override int SaveChanges()
        {
            AddTimestamps();
            return base.SaveChanges();
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            AddTimestamps();
            return base.SaveChangesAsync(cancellationToken);
        }

        private void AddTimestamps()
        {
            var entities = ChangeTracker.Entries()
                .Where(x => x.Entity is BaseModel && (x.State == EntityState.Added || x.State == EntityState.Modified));
            foreach (var entity in entities)
            {
                DateTime now = DateTime.Now;
                if (entity.State == EntityState.Added)
                {
                    ((BaseModel)entity.Entity).CreatedAt = now;
                    ((BaseModel)entity.Entity).Id = Guid.NewGuid();
                }
                ((BaseModel)entity.Entity).UpdatedAt = now;
            }
        }
    }
}
