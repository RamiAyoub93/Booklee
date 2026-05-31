using System.ComponentModel.DataAnnotations;

namespace Booklee.API.DTOs.Auth;

public class RegisterDto
{
    [Required] public string Name { get; set; } = string.Empty;
    [Required, EmailAddress] public string Email { get; set; } = string.Empty;
    [Required, MinLength(6)] public string Password { get; set; } = string.Empty;
    [Required] public string Role { get; set; } = "Customer"; // "Customer" | "Owner"
}
