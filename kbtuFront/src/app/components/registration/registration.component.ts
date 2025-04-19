import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  selector: 'app-registration',
  styleUrls: ['./registration.component.css'],
  templateUrl: './registration.component.html',
})
export class RegistrationComponent {
  formData = {
    username: '',
    email: '',
    password: '',
    school: '',
    yearOfStudy: 1
  };

  successMessage = '';
  errorMessage = '';

  constructor(private authService: AuthService,private router: Router) {}

  registerUser() {
    this.authService.register(this.formData).subscribe({
      next: (res) => {
        console.log('Registered:', res);
        this.successMessage = res.message || 'Registered!';
        this.errorMessage = '';
        localStorage.setItem('userData', JSON.stringify(this.formData));
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage = 'Registration failed. Please try again.';
        this.successMessage = '';
      }
    });
  }
}
