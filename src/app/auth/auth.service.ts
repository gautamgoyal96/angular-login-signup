import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

	  serverUrl = 'http://localhost:8042/';
	  errorData: {};

	  isLoggedIn = false;

	  constructor(private http: HttpClient) { }

	  redirectUrl: string;

	  login(formData) {
	    return this.http.post<any>(this.serverUrl+'api/login', formData)
	    .pipe(
	      catchError(this.handleError)
	    );
	  }

	  signup(formData) {
		    return this.http.post<any>(this.serverUrl + 'api/signUp', formData)
		    .pipe(
		      catchError(this.handleError)
		    );
	  }


	  getAuthorizationToken() {
	   const currentUser = JSON.parse(localStorage.getItem('currentUser'));
	    if(currentUser){
	    	return currentUser.token;
		}else{
			return false;
		}
	  }

	  getLoginDetail() {
	    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
	    if(currentUser){
	    	return currentUser;
		}else{
			return false;
		}
	  }

	  logout() {
	    localStorage.removeItem('currentUser');
	    this.isLoggedIn = false;
	  }

	  private handleError(error: HttpErrorResponse) {
	    if (error.error instanceof ErrorEvent) {

	      // A client-side or network error occurred. Handle it accordingly.

	      console.error('An error occurred:', error.error.message);
	    } else {

	      // The backend returned an unsuccessful response code.

	      // The response body may contain clues as to what went wrong.

	      console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
	    }

	    // return an observable with a user-facing error message

	    this.errorData = {
	      errorTitle: 'Oops! Request for document failed',
	      errorDesc: 'Something bad happened. Please try again later.'
	    };
	    return throwError(this.errorData);
	  }
}
