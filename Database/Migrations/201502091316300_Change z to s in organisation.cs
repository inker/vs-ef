namespace DBManager.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Changeztosinorganisation : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Users", "Organisation_ID", "dbo.Organisations");
            DropIndex("dbo.Users", new[] { "Organisation_ID" });
            RenameColumn(table: "dbo.Users", name: "Organisation_ID", newName: "OrganisationID");
            AlterColumn("dbo.Users", "OrganisationID", c => c.Long(nullable: false));
            CreateIndex("dbo.Users", "OrganisationID");
            AddForeignKey("dbo.Users", "OrganisationID", "dbo.Organisations", "ID", cascadeDelete: true);
            DropColumn("dbo.Users", "OrganizationID");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Users", "OrganizationID", c => c.Long(nullable: false));
            DropForeignKey("dbo.Users", "OrganisationID", "dbo.Organisations");
            DropIndex("dbo.Users", new[] { "OrganisationID" });
            AlterColumn("dbo.Users", "OrganisationID", c => c.Long());
            RenameColumn(table: "dbo.Users", name: "OrganisationID", newName: "Organisation_ID");
            CreateIndex("dbo.Users", "Organisation_ID");
            AddForeignKey("dbo.Users", "Organisation_ID", "dbo.Organisations", "ID");
        }
    }
}
