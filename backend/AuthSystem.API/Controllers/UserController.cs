using AuthSystem.BL;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;

namespace AuthSystem.API.Controllers
{
    [ApiController]
    [Route("api/user")]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly AuthBL _authBL;

        public UserController(AuthBL authBL)
        {
            _authBL = authBL;
        }

        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            // Search for email in standard names
            var email = User.FindFirstValue("email") 
                     ?? User.FindFirstValue(ClaimTypes.Email)
                     ?? User.FindFirstValue(JwtRegisteredClaimNames.Email);

            if (string.IsNullOrEmpty(email))
            {
                return Unauthorized(new { message = "User email claim not found in token." });
            }

            var result = await _authBL.GetProfile(email);
            
            if (result.StatusCode == 200)
                return Ok(result);
            
            return StatusCode(result.StatusCode, result);
        }
    }
}
