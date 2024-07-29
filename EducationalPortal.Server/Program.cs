using EducationalPortal.MsSql.Extensions;
using EducationalPortal.Server.Extensions;
using EducationalPortal.Server.GraphQL;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("DefaultPolicy", builder =>
    {
        builder.AllowAnyHeader()
               .WithMethods("POST")
               .WithOrigins("http://localhost:3000");
    });
});

builder.Services.AddJwtAuthorization();
//builder.Services.AddMongo();
builder.Services.AddMsSql();
//builder.Services.AddPostgres();
builder.Services.AddGraphQLApi();
builder.Services.AddServices(builder.Environment.IsDevelopment());

var app = builder.Build();
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseCors("DefaultPolicy");
}
else
{
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();

app.UseGraphQLUpload<AppSchema>()
    .UseGraphQL<AppSchema>();
app.UseGraphQLAltair();

app.UseSpa(spa =>
{
    spa.Options.SourcePath = "wwwroot";
});

app.Run();