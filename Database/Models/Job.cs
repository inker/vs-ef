using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DBManager.Models
{
    public class Job : IEntity
    {
        public Int64 ID { get; set; }

        public String Name { get; set; }
    }
}
