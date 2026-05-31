using System.ComponentModel.DataAnnotations;

namespace Booklee.API.DTOs.Company;

public class CreateCompanyDto
{
    [Required] public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    [Required] public string Category { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? Address { get; set; }
}
