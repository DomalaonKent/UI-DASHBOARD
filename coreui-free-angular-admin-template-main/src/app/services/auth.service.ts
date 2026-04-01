import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userRole: string = 'HR';

  getUserRole(): string {  
    return this.userRole;
  }

  setUserRole(role: string): void {
    this.userRole = role;
  }

  logout(): void {
    this.userRole = '';
    localStorage.clear();
  }
}