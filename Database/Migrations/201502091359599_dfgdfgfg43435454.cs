namespace Database.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class dfgdfgfg43435454 : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Jobs",
                c => new
                    {
                        ID = c.Long(nullable: false, identity: true),
                        Name = c.String(),
                    })
                .PrimaryKey(t => t.ID);
            
            CreateTable(
                "dbo.UserJobs",
                c => new
                    {
                        ID = c.Long(nullable: false, identity: true),
                        Job_ID = c.Long(),
                        User_ID = c.Long(),
                    })
                .PrimaryKey(t => t.ID)
                .ForeignKey("dbo.Jobs", t => t.Job_ID, cascadeDelete:true)
                .ForeignKey("dbo.Users", t => t.User_ID, cascadeDelete:true)
                .Index(t => t.Job_ID)
                .Index(t => t.User_ID);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.UserJobs", "User_ID", "dbo.Users");
            DropForeignKey("dbo.UserJobs", "Job_ID", "dbo.Jobs");
            DropIndex("dbo.UserJobs", new[] { "User_ID" });
            DropIndex("dbo.UserJobs", new[] { "Job_ID" });
            DropTable("dbo.UserJobs");
            DropTable("dbo.Jobs");
        }
    }
}
