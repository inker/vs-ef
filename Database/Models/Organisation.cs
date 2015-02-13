using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DBManager.Models
{
    public class Organisation : IEntity
    {
        public Int64 ID { get; set; }

        public String Name { get; set; }

        public virtual List<User> Users { get; set; }
    }
}
