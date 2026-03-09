import { Component, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators, NonNullableFormBuilder } from '@angular/forms';
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

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, AppInput, Icon, TranslatePipe],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly authService = inject(AuthService);
  private readonly i18nService = inject(I18nService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  readonly submitting = signal(false);
  readonly loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, passwordStrengthValidator]],
  });

  readonly formSubmitted = signal(false);
  readonly pageDescription = computed(() => this.i18nService.t('auth.login.description'));

  async submit(): Promise<void> {
    this.formSubmitted.set(true);
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) return;

    this.submitting.set(true);
    try {
      const { email, password } = this.loginForm.getRawValue();
      await this.authService.signIn(email, password);
      this.submitting.set(false);
      this.toastService.success(this.i18nService.t('auth.login.toastSuccess'));
      this.router.navigateByUrl('/home');
    } catch (error) {
      this.submitting.set(false);
      this.toastService.error(error instanceof Error ? error.message : this.i18nService.t('auth.login.toastError'));
    }
  }

  showError(controlName: 'email' | 'password'): boolean {
    const control = this.loginForm.controls[controlName];
    return control.invalid && (control.touched || this.formSubmitted());
  }

  errorMessage(controlName: 'email' | 'password'): string | null {
    const control = this.loginForm.controls[controlName];
    if (!this.showError(controlName)) return null;
    return this.messageForErrors(control.errors);
  }

  private messageForErrors(errors: ValidationErrors | null): string | null {
    if (!errors) return null;
    if (errors['required']) return this.i18nService.t('auth.validation.required');
    if (errors['email']) return this.i18nService.t('auth.validation.email');
    if (errors['passwordStrength']) return this.i18nService.t('auth.validation.passwordStrength');
    return this.i18nService.t('auth.validation.invalid');
  }
}
