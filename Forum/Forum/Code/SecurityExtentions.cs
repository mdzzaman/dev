﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace Forum.Code
{
    public static class SecurityExtentions
    {
        public static CustomPrincipal ToCustomPrincipal(this IPrincipal principal)
        {
            return (CustomPrincipal)principal;
        }
    }
}