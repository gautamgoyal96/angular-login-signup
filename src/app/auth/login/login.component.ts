import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	loginForm: FormGroup;
	submitted = false;
	returnUrl: string;
	error: {};
	loginError: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
    ) { }

   ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.authService.logout();
  }

  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }

  onSubmit() {
    this.submitted = true;
      const formData = new FormData();
      formData.append('username', this.loginForm.get('username').value);
      formData.append('password', this.loginForm.get('password').value);
      this.authService.login(formData).subscribe((data) => {
      
        if(data.status=="fail"){

            this.loginError = data.message;

        }else{

          if (data.data) {
            localStorage.setItem('currentUser', JSON.stringify(data.data));
            const redirect = this.authService.redirectUrl ? this.authService.redirectUrl : '/admin';
            this.router.navigate([redirect]);
          }
        
        }
      },
      error => this.error = error
    );
  }

}
