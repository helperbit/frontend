import { Injectable } from '@angular/core';
import {
	Router, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate
} from '@angular/router';
import { getLocalStorage } from './utils';


/* Guard for checking auth in routes */
@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private router: Router) { }

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
		if (!('auth' in route.data))
			return true;

		switch (route.data.auth.status) {
			//se è richiesta la sessione
			case 'logged': {
				//viene controllato se la sessione non esiste
				if (!getLocalStorage().getItem('token')) {
					//console.log('ERROR! No session');
					return this.router.parseUrl(route.data.auth.redirect.default);
				}
				//viene controllato se l'utente con la sessione attiva non può accedere a questa route
				else if ('allowedUserType' in route.data.auth && route.data.auth.allowedUserType.indexOf(getLocalStorage().getItem('usertype')) == -1) {
					//console.log('ERROR! User Unauthoraized');
					return this.router.parseUrl(route.data.auth.redirect.wrongUserType);
				}
				break;
			}
			//se non è richiesta la sessione,
			//viene controllato se la sessione esiste
			case 'notlogged': {
				/* Allow to override auth.status if allowquery strings are present all as get parameters;
				* ie: login?email=ciao&token=mondo not redirects a logged users if allowquery: ['email', 'token'] */
				let allowquerycond = true;
				if ('allowquery' in route.data.auth) {
					if (route.data.auth.allowquery.filter(q => route.queryParamMap.has(q)).length < route.data.auth.allowquery.length)
						allowquerycond = false;
				}

				if (getLocalStorage().getItem('token') && !allowquerycond) {
					return this.router.parseUrl(route.data.auth.redirect);
				}
				break;
			}
		}

		return true;
	}
}