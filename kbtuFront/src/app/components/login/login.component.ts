import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.username, this.password).subscribe({
      next: (res) => {
        console.log('Получен ответ от сервера:', res);
        this.errorMessage = '';
        this.authService.saveToken(res.access, res.refresh);
        this.router.navigate(['/dashboard']); 
      },
      error: (err) => {
        this.errorMessage = 'Неверный логин или пароль';
        console.error(err);
      }
    });
  }
}
