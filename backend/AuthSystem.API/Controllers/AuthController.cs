using AuthSystem.BL;
using AuthSystem.DTO.Request;
using Microsoft.AspNetCore.Mvc;

namespace AuthSystem.API.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly AuthBL _authBL;

        public AuthController(AuthBL authBL)
        {
            _authBL = authBL;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequestDTO dto)
        {
            var result = await _authBL.Register(dto);
            var response = new { result.StatusCode, result.Message };

            if (result.StatusCode == 200)
                return Ok(response);
            
            return StatusCode(result.StatusCode, response);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequestDTO dto)
        {
            var result = await _authBL.Login(dto);
            if (result.StatusCode == 200)
                return Ok(result);

            return StatusCode(result.StatusCode, result);
        }
    }
}