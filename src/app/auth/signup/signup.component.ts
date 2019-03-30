import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  	signupForm: FormGroup;
	submitted = false;
	returnUrl: string;
	error: {};
	signupError: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
    ) { }

   ngOnInit() {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      profileImage: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.authService.logout();
  }

  get username() { return this.signupForm.get('username'); }
  get password() { return this.signupForm.get('password'); }
  get email() { return this.signupForm.get('email'); }
  get profileImage() { return this.signupForm.get('profileImage'); }

  onSelectedFile(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.signupForm.get('profileImage').setValue(file);
    }
  }

  onSubmit() {
    this.submitted = true;
 	const formData = new FormData();
    formData.append('username', this.signupForm.get('username').value);
    formData.append('email', this.signupForm.get('email').value);
    formData.append('password', this.signupForm.get('password').value);
    formData.append('profileImage', this.signupForm.get('profileImage').value);

    this.authService.signup(formData).subscribe((data) => {

        if(data.status=="fail"){

            this.signupError = data.message;

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
