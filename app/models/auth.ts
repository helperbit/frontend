import AppSettings from "../app.settings";
import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AuthStatus {
	status: 'ok' | 'none';
	username?: string;
}

export interface AuthLoginData {
	user: string;
	password: string;
	language?: string;
}

export interface AuthLogin {
	token: string;
	username: string;
	email: string;
	usertype: string;
	policyversion: {
		current: { terms: number; privacy: number };
		accepted: { terms: number; privacy: number };
	};
}

export interface ChangePasswordData {
	token?: string;
	oldpassword?: string;
	newpassword: string;
}

export interface AuthSocialEditData {
	email: string;
	password: string;
	password2: string;
}

export interface AuthSignupData {
	email: string;
	username: string;
	password: string;
	newsletter: boolean;
	refby?: string;
	language?: string;
	terms: boolean;
	usertype: string;
	subtype?: string;
}


@Injectable({
	providedIn: 'root'
})
export class AuthService {
	public onLoginStatusChange: EventEmitter<boolean> = new EventEmitter();

	constructor(private http: HttpClient) { }

	getStatus(): Observable<AuthStatus> {
		return this.http.get<AuthStatus>(AppSettings.apiUrl + '/auth/state');
	}

	activate(email: string, token: string): Observable<void> {
		return this.http.post<void>(AppSettings.apiUrl + '/auth/activate', { email: email, token: token });
	}

	resendActivation(email: string): Observable<void> {
		return this.http.post<void>(AppSettings.apiUrl + '/auth/activate/resend', { email: email });
	}

	login(loginData: AuthLoginData): Observable<AuthLogin> {
		return this.http.post<AuthLogin>(AppSettings.apiUrl + '/login', loginData);
	}

	logout(): Observable<void> {
		return this.http.post<void>(AppSettings.apiUrl + '/logout', {},
			{ headers: { ignoreLoadingBar: String(true) } });
	}

	changePassword(changeData: ChangePasswordData): Observable<void> {
		return this.http.post<void>(AppSettings.apiUrl + '/auth/change', changeData);
	}

	resetPassword(email: string): Observable<void> {
		return this.http.post<void>(AppSettings.apiUrl + '/auth/reset', { email: email });
	}

	socialEdit(editData: AuthSocialEditData): Observable<void> {
		return this.http.post<void>(AppSettings.apiUrl + '/auth/social/edit', editData);
	}

	signup(signupData: AuthSignupData): Observable<void> {
		return this.http.post<void>(AppSettings.apiUrl + '/signup', signupData);
	}
}