using AuthSystem.DL;
using AuthSystem.DTO.Request;
using AuthSystem.DTO.Response;
using AuthSystem.GL;

namespace AuthSystem.BL
{
    public class AuthBL
    {
        private readonly UserDL _userDL;
        private readonly PasswordHasher _hasher;
        private readonly JwtHelper _jwt;

        public AuthBL(UserDL userDL, PasswordHasher hasher, JwtHelper jwt)
        {
            _userDL = userDL;
            _hasher = hasher;
            _jwt = jwt;
        }

        public async Task<SPResponseDTO> Register(RegisterRequestDTO dto)
        {
            var hash = _hasher.Hash(dto.Password);

            var result = await _userDL.ExecuteAuthSP("REGISTER", dto.Username, dto.Email, hash);

            return result;
        }

        public async Task<AuthResponseDTO> Login(LoginRequestDTO dto)
        {
            var result = await _userDL.ExecuteAuthSP("LOGIN", null, dto.Email, null);

            if (result.StatusCode != 200)
            {
                return new AuthResponseDTO
                {
                    StatusCode = result.StatusCode,
                    Message = result.Message
                };
            }

            if (result.User == null || !_hasher.Verify(dto.Password, result.User.PasswordHash))
            {
                return new AuthResponseDTO
                {
                    StatusCode = 401,
                    Message = "Invalid credentials"
                };
            }

            return new AuthResponseDTO
            {
                StatusCode = 200,
                Message = "Login successful",
                Token = _jwt.GenerateToken(result.User),
                Username = result.User.Username
            };
        }

        public async Task<SPResponseDTO> GetProfile(string email)
        {
            return await _userDL.ExecuteAuthSP("PROFILE", null, email, null);
        }
    }
}