using Booklee.API.DTOs.Company;
using Booklee.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Booklee.API.Controllers;

[ApiController]
[Route("api/companies")]
public class CompaniesController : ControllerBase
{
    private readonly ICompanyService _companies;

    public CompaniesController(ICompanyService companies) => _companies = companies;

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _companies.GetAllAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id) =>
        Ok(await _companies.GetByIdAsync(id));

    [Authorize(Roles = "Owner")]
    [HttpGet("mine")]
    public async Task<IActionResult> GetMine()
    {
        var ownerId = GetUserId();
        return Ok(await _companies.GetByOwnerIdAsync(ownerId));
    }

    [Authorize(Roles = "Owner")]
    [HttpPost]
    public async Task<IActionResult> Create(CreateCompanyDto dto)
    {
        var ownerId = GetUserId();
        var result = await _companies.CreateAsync(ownerId, dto);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [Authorize(Roles = "Owner")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, CreateCompanyDto dto)
    {
        var ownerId = GetUserId();
        return Ok(await _companies.UpdateAsync(id, ownerId, dto));
    }

    private int GetUserId() =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
}
