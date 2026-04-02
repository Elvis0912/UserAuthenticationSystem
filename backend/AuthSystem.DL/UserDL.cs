using MySql.Data.MySqlClient;
using AuthSystem.DTO.Response;
using AuthSystem.DTO.Response;
using Microsoft.Extensions.Configuration;
using System.Data;

namespace AuthSystem.DL
{
    public class UserDL
    {
        private readonly string _connectionString;

        public UserDL(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection") 
                ?? throw new Exception("Connection string 'DefaultConnection' not found.");
        }

        public async Task<SPResponseDTO> ExecuteAuthSP(string action, string? name, string email, string? passwordHash)
        {
            using var connection = new MySqlConnection(_connectionString);
            await connection.OpenAsync();

            using var command = new MySqlCommand("sp_AuthUser", connection);
            command.CommandType = CommandType.StoredProcedure;

            command.Parameters.AddWithValue("p_Action", action);
            command.Parameters.AddWithValue("p_Name", name);
            command.Parameters.AddWithValue("p_Email", email);
            command.Parameters.AddWithValue("p_PasswordHash", passwordHash);

            using var reader = await command.ExecuteReaderAsync();
            var result = new SPResponseDTO();

            if (await reader.ReadAsync())
            {
                result.StatusCode = reader.GetInt32("StatusCode");
                
                // Safely handle the Message column while the user is adding it
                int messageOrdinal = -1;
                try { messageOrdinal = reader.GetOrdinal("Message"); } catch { /* Ignore */ }
                if (messageOrdinal == -1)
                try { messageOrdinal = reader.GetOrdinal("message"); } catch { /* Ignore */ }

                result.Message = messageOrdinal != -1 ? reader.GetString(messageOrdinal) : (result.StatusCode == 200 ? "Success" : "Operation Failed");

                if (reader.FieldCount > 2 && !reader.IsDBNull(reader.GetOrdinal("Id")))
                {
                    result.User = new UserDTO
                    {
                        Id = reader.GetInt32(reader.GetOrdinal("Id")),
                        Username = !reader.IsDBNull(reader.GetOrdinal("Name")) ? reader.GetString(reader.GetOrdinal("Name")) : string.Empty,
                        Email = !reader.IsDBNull(reader.GetOrdinal("Email")) ? reader.GetString(reader.GetOrdinal("Email")) : string.Empty,
                        PasswordHash = !reader.IsDBNull(reader.GetOrdinal("PasswordHash")) ? reader.GetString(reader.GetOrdinal("PasswordHash")) : string.Empty
                    };
                }
            }

            return result;
        }
    }
}
