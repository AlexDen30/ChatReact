using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChatAPI.Models.KeyAndVectorModel
{
    public interface IKeyAndVectorRepository
    {
        public KeyAndVectorModel GetKeyAndVector();

        public void SetKeyAndVector(KeyAndVectorModel keyAndVector);
    }
}
