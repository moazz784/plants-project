using FluentValidation;
using LeafScan.Application.DTOs;

namespace LeafScan.Application.Validators;

public class CreateMessageRequestValidator : AbstractValidator<CreateMessageRequest>
{
    public CreateMessageRequestValidator()
    {
        RuleFor(x => x.SenderFirstName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.SenderLastName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.SenderEmail).NotEmpty().EmailAddress();
        RuleFor(x => x.SenderPhone).MaximumLength(20).When(x => !string.IsNullOrEmpty(x.SenderPhone));
        RuleFor(x => x.Body).NotEmpty().MaximumLength(2000);
    }
}
