import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private loginUrl = 'http://localhost:8080/auth/login';

  private registerUrl = 'http://localhost:8080/users';

  constructor(private http: HttpClient) {}

  register(Credentials: any) {
    return this.http.post<any>(this.registerUrl, Credentials);
  }

  login(Credentials: any) {
    return this.http.post<any>(this.loginUrl, Credentials).pipe(
      tap((response) => {
        if (response.token) {
          localStorage.setItem('auth_token', response.token);
        }
      }),
    );
  }
}
