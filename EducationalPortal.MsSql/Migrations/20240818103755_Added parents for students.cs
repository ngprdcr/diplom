using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EducationalPortal.MsSql.Migrations
{
    public partial class Addedparentsforstudents : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "FatherId",
                table: "Users",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "MotherId",
                table: "Users",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_FatherId",
                table: "Users",
                column: "FatherId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_MotherId",
                table: "Users",
                column: "MotherId");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Users_FatherId",
                table: "Users",
                column: "FatherId",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Users_MotherId",
                table: "Users",
                column: "MotherId",
                principalTable: "Users",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_Users_FatherId",
                table: "Users");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_Users_MotherId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_FatherId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_MotherId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "FatherId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "MotherId",
                table: "Users");
        }
    }
}
