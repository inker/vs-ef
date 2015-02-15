using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DBManager
{
    public class UserText
    {
        public long ID { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Organization { get; set; }
        public string Jobs { get; set; }
    }

    public class UserCustom
    {
        public long ID { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public long OrganisationID { get; set; }
    }

    public class OrganisationCustom
    {
        public long ID { get; set; }
        public string Name { get; set; }
    }

    public class JobCustom
    {
        public long ID { get; set; }
        public string Name { get; set; }
    }

    public class UserJobCustom
    {
        public long ID { get; set; }
        public long UserID { get; set; }
        public long JobID { get; set; }
    }
}
