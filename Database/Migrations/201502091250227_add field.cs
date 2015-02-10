namespace Database.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addfield : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Organisations",
                c => new
                    {
                        ID = c.Long(nullable: false, identity: true),
                        Name = c.String(),
                    })
                .PrimaryKey(t => t.ID);
            
            CreateTable(
                "dbo.Users",
                c => new
                    {
                        ID = c.Long(nullable: false, identity: true),
                        Name = c.String(),
                        Surname = c.String(),
                        OrganizationID = c.Long(nullable: false),
                        Organisation_ID = c.Long(),
                    })
                .PrimaryKey(t => t.ID)
                .ForeignKey("dbo.Organisations", t => t.Organisation_ID)
                .Index(t => t.Organisation_ID);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Users", "Organisation_ID", "dbo.Organisations");
            DropIndex("dbo.Users", new[] { "Organisation_ID" });
            DropTable("dbo.Users");
            DropTable("dbo.Organisations");
        }
    }
}
