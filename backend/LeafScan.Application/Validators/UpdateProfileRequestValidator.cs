using FluentValidation;
using LeafScan.Application.DTOs;

namespace LeafScan.Application.Validators;

public class UpdateProfileRequestValidator : AbstractValidator<UpdateProfileRequest>
{
    public UpdateProfileRequestValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MinimumLength(3);
        RuleFor(x => x.NewPassword).MinimumLength(6).When(x => !string.IsNullOrEmpty(x.NewPassword));
    }
}
