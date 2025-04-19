import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [FormsModule],
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userData: any = {};  

  constructor(private authService: AuthService) {
  }
  logout() {
    this.authService.logout();
}

ngOnInit(): void {
  this.authService.getUserProfile().subscribe({
    next: (data) => {
      this.userData = data; // тут отобразятся данные пользователя
    },
    error: (err) => {
      console.error('Error when receiving user data', err);
    }
  });
}
updateProfile(updated: any) {
  console.log(this.userData)
  this.authService.updateUserProfile(this.userData).subscribe({
    next: (updated) => {
      this.userData = updated;
      console.log('Profile has been successfully updated');
    },
    error: (err) => {
      console.error('Error updating the profile', err);
    }
  });
}
deleteAccount() {
  if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
    this.authService.deleteUserAccount().subscribe({
      next: () => {
        alert('Account deleted successfully.');
        this.authService.logout(); // Выход из системы после удаления
      },
      error: (err: any) => {
        console.error('Account deletion error', err);
      }
    });
  }
}
}