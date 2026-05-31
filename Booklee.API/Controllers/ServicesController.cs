using Booklee.API.DTOs.Service;
using Booklee.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Booklee.API.Controllers;

[ApiController]
[Route("api/companies/{companyId}/services")]
public class ServicesController : ControllerBase
{
    private readonly IServiceService _services;

    public ServicesController(IServiceService services) => _services = services;

    [HttpGet]
    public async Task<IActionResult> GetAll(int companyId) =>
        Ok(await _services.GetByCompanyIdAsync(companyId));

    [Authorize(Roles = "Owner")]
    [HttpPost]
    public async Task<IActionResult> Create(int companyId, CreateServiceDto dto)
    {
        var ownerId = GetUserId();
        return Ok(await _services.CreateAsync(companyId, ownerId, dto));
    }

    [Authorize(Roles = "Owner")]
    [HttpPut("{serviceId}")]
    public async Task<IActionResult> Update(int companyId, int serviceId, CreateServiceDto dto)
    {
        var ownerId = GetUserId();
        return Ok(await _services.UpdateAsync(serviceId, ownerId, dto));
    }

    [Authorize(Roles = "Owner")]
    [HttpDelete("{serviceId}")]
    public async Task<IActionResult> Delete(int companyId, int serviceId)
    {
        var ownerId = GetUserId();
        await _services.DeleteAsync(serviceId, ownerId);
        return NoContent();
    }

    private int GetUserId() =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
}
