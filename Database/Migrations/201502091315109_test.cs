namespace Database.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class test : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Users", "Organisation_ID", "dbo.Organisations");
            DropIndex("dbo.Users", new[] { "Organisation_ID" });
            DropColumn("dbo.Users", "Organisation_ID");
            RenameColumn(table: "dbo.Users", name: "OrganizationID", newName: "Organisation_ID");
            AddColumn("dbo.Users", "Organisation_ID1", c => c.Long());
            AlterColumn("dbo.Users", "Organisation_ID", c => c.Long(nullable: false));
            CreateIndex("dbo.Users", "Organisation_ID1");
            AddForeignKey("dbo.Users", "Organisation_ID1", "dbo.Organisations", "ID");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Users", "Organisation_ID1", "dbo.Organisations");
            DropIndex("dbo.Users", new[] { "Organisation_ID1" });
            AlterColumn("dbo.Users", "Organisation_ID", c => c.Long());
            DropColumn("dbo.Users", "Organisation_ID1");
            RenameColumn(table: "dbo.Users", name: "Organisation_ID", newName: "OrganizationID");
            AddColumn("dbo.Users", "Organisation_ID", c => c.Long());
            CreateIndex("dbo.Users", "Organisation_ID");
            AddForeignKey("dbo.Users", "Organisation_ID", "dbo.Organisations", "ID");
        }
    }
}
