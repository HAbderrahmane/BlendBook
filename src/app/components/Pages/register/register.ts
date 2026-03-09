import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
  NonNullableFormBuilder,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AppInput } from '../../Design/input/input';
import { Icon } from '../../Design/icon/icon';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { AuthService } from '../../../Services/auth.service';
import { I18nService } from '../../../Services/i18n.service';
import { ToastService } from '../../../Services/toast.service';

const passwordStrengthValidator: ValidatorFn = (control) => {
  const value = String(control.value ?? '');
  if (!value) return null;
  const strongEnough =
    /[A-Z]/.test(value) && /[a-z]/.test(value) && /\d/.test(value) && value.length >= 8;
  return strongEnough ? null : { passwordStrength: true };
};

const matchingPasswordsValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  if (!password || !confirmPassword) return null;
  return password === confirmPassword ? null : { passwordMismatch: true };
};

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, AppInput, Icon, TranslatePipe],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private readonly authService = inject(AuthService);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly i18nService = inject(I18nService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  readonly submitting = signal(false);
  readonly formSubmitted = signal(false);
  readonly registerForm = this.fb.group(
    {
      displayName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, passwordStrengthValidator]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: matchingPasswordsValidator },
  );

  async submit(): Promise<void> {
    this.formSubmitted.set(true);
    this.registerForm.markAllAsTouched();
    if (this.registerForm.invalid) return;

    this.submitting.set(true);
    try {
      const { displayName, email } = this.registerForm.getRawValue();
      const { password } = this.registerForm.getRawValue();
      await this.authService.signUp(email, password, displayName);
      this.submitting.set(false);
      this.toastService.success(this.i18nService.t('auth.register.toastSuccess'));
      this.router.navigateByUrl('/home');
    } catch (error) {
      this.submitting.set(false);
      this.toastService.error(
        error instanceof Error ? error.message : this.i18nService.t('auth.register.toastError'),
      );
    }
  }

  showError(controlName: 'displayName' | 'email' | 'password' | 'confirmPassword'): boolean {
    const control = this.registerForm.controls[controlName];
    return control.invalid && (control.touched || this.formSubmitted());
  }

  errorMessage(controlName: 'displayName' | 'email' | 'password' | 'confirmPassword'): string | null {
    const control = this.registerForm.controls[controlName];
    if (
      controlName === 'confirmPassword' &&
      this.registerForm.hasError('passwordMismatch') &&
      (control.touched || this.formSubmitted())
    ) {
      return this.i18nService.t('auth.validation.passwordMismatch');
    }
    if (!this.showError(controlName)) return null;
    const errors = control.errors;
    if (!errors) return null;
    if (errors['required']) return this.i18nService.t('auth.validation.required');
    if (errors['email']) return this.i18nService.t('auth.validation.email');
    if (errors['minlength']) return this.i18nService.t('auth.validation.displayNameLength');
    if (errors['passwordStrength']) return this.i18nService.t('auth.validation.passwordStrength');
    return this.i18nService.t('auth.validation.invalid');
  }
}
