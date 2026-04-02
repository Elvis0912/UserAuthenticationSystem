namespace AuthSystem.DTO.Response
{
    public class AuthResponseDTO
    {
        public int StatusCode { get; set; }
        public string Message { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
    }
}
