using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DBManager.Models
{
    public class User : IEntity
    {
        public Int64 ID { get; set; }

        public String Name { get; set; }

        public String Surname { get; set; }

        public Int64 OrganisationID { get; set; }

        public virtual Organisation Organisation { get; set; }
    }
}
