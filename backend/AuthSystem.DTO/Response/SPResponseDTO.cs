namespace AuthSystem.DTO.Response
{
    public class SPResponseDTO
    {
        public int StatusCode { get; set; }
        public string Message { get; set; } = string.Empty;
        public UserDTO? User { get; set; }
    }
}
