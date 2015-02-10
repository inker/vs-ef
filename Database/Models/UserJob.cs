using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Database.Models
{
    public class UserJob : IEntity
    {
        public Int64 ID { get; set; }

        public virtual User User { get; set; }

        public virtual Job Job { get; set; }
    }
}
