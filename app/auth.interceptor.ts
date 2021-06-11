
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { AuthService } from './models/auth';
import { Router } from '@angular/router';
import { getLocalStorage } from './shared/helpers/utils';
import AppSettings from './app.settings';
import { CookieService } from 'ngx-cookie-service';

export class AuthInterceptor implements HttpInterceptor {
	localStorage = getLocalStorage();

	constructor(
		private authService: AuthService,
		private cookieService: CookieService,
		private router: Router
	) { }

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		// this.cfpLoadingBar.start();

		// this.cfpLoadingBar.set(50);

		const headers = {};
		if (localStorage.getItem('token'))
			headers['Authorization'] = 'Bearer ' + localStorage.getItem('token');
		if (localStorage.getItem('captcha'))
			headers['captcha'] = localStorage.getItem('captcha');
		if (!AppSettings.features.captcha)
			headers['captcha'] = 'e2e';

		const request = req.clone({ setHeaders: headers });
		return next.handle(request).pipe(
			// retry(5),
			tap(next => {
				// this.cfpLoadingBar.complete();
			}, error => {
				if (error.status == 401) {
					switch (error.error.error) {
						case 'E1':
							this.cookieService.delete('token', '/');
							this.localStorage.removeItem('token');
							this.localStorage.removeItem('username');
							this.authService.onLoginStatusChange.emit(false);
							this.router.navigateByUrl('/auth/login');
							break;
						case 'E5':					
							this.router.navigateByUrl('/me/socialedit');
							break;
					}
				}
			}),
			// map((res) => {
			// 	this.cfpLoadingBar.complete();
			// 	return res;
			// }),
			// Da risolvere, dobbiamo poter intercettare / far andare avanti
			// catchError((error, $catch) => {
			// 	console.log('Catch', error);
			// 	// let errorMessage = '';
			// 	// if (error.error instanceof ErrorEvent) {
			// 	//   // client-side error
			// 	//   errorMessage = `Error: ${error.error.message}`;
			// 	// } else {
			// 	//   // server-side error
			// 	//   errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
			// 	// }
			// 	// window.alert(errorMessage);
			// 	return of(error);
			// 	// return $catch;
			//   })
		);
	}
}
