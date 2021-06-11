import { NgModule } from '@angular/core';
import { Router, Routes, RouterModule, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Location, APP_BASE_HREF } from '@angular/common';
import { MetaGuard } from 'ng2-meta';

const routes: Routes = [
	// { path: ":lang", component: AppComponent },
	// { path: "", pathMatch: "full", redirectTo: "/en" },
	{
		pathMatch: 'prefix',
		path: '',
		canActivate: [MetaGuard],
		loadChildren: () => import('./components/policy/policy.module').then(m => m.PolicyModule)
	},
	{
		pathMatch: 'prefix',
		path: 'i',
		canActivate: [MetaGuard],
		loadChildren: () => import('./components/staticpages/staticpages.module').then(m => m.StaticPagesModule)
	},
	{
		pathMatch: 'prefix',
		path: 'event',
		canActivate: [MetaGuard],
		loadChildren: () => import('./components/event/event.module').then(m => m.EventModule)
	},
	{
		pathMatch: 'prefix',
		path: 'stats',
		canActivate: [MetaGuard],
		loadChildren: () => import('./components/stats/stats.module').then(m => m.StatsModule)
	},
	{
		pathMatch: 'prefix',
		path: 'me',
		canActivate: [MetaGuard],
		loadChildren: () => import('./components/dashboard/dashboard.module').then(m => m.DashboardModule)
	},
	{
		pathMatch: 'prefix',
		path: 'me/wallet',
		canActivate: [MetaGuard],
		loadChildren: () => import('./components/dashboard.wallet/dashboard.wallet.module').then(m => m.DashboardWalletModule)
	},
	{
		pathMatch: 'prefix',
		path: 'about',
		canActivate: [MetaGuard],
		loadChildren: () => import('./components/about/about.module').then(m => m.AboutModule)
	},
	{
		pathMatch: 'prefix',
		path: 'campaign',
		canActivate: [MetaGuard],
		loadChildren: () => import('./components/campaign/campaign.module').then(m => m.CampaignModule)
	},
	{
		pathMatch: 'prefix',
		path: 'project',
		canActivate: [MetaGuard],
		loadChildren: () => import('./components/project/project.module').then(m => m.ProjectModule)
	},
	{
		pathMatch: 'prefix',
		path: 'donation',
		canActivate: [MetaGuard],
		loadChildren: () => import('./components/donation/donation.module').then(m => m.DonationModule)
	},
	{
		pathMatch: 'prefix',
		path: 'charity',
		canActivate: [MetaGuard],
		loadChildren: () => import('./components/charity/charity.module').then(m => m.CharityModule)
	},
	{
		pathMatch: 'prefix',
		path: 'user',
		canActivate: [MetaGuard],
		loadChildren: () => import('./components/profile/profile.module').then(m => m.ProfileModule)
	},
	{
		pathMatch: 'prefix',
		path: 'auth',
		canActivate: [MetaGuard],
		loadChildren: () => import('./components/auth/auth.module').then(m => m.AuthModule)
	},

	/* Back compatibility redirects */
	{
		path: 'events',
		redirectTo: 'event/list'
	},
	{
		path: 'donations',
		redirectTo: 'donation/list'
	},
	{
		path: 'transaction/:txid',
		redirectTo: 'donation/transaction/:txid'
	},
	{
		path: 'projects',
		redirectTo: 'project/list'
	},
	{
		path: 'faq',
		redirectTo: 'about/faq'
	},
	{
		path: 'cookies',
		redirectTo: 'about/cookies'
	},
	// {
	// 	path: 'jobs',
	// 	redirectTo: 'about/jobs'
	// },
	{
		path: 'list-proposed-charities-crypto-donations',
		redirectTo: 'charity/proposed'
	},
	{
		path: 'charity-organizations-list-accept-bitcoin-donation',
		redirectTo: 'charity/list'

	},
	{
		path: 'organizations',
		redirectTo: 'charity/list'
	},
	{
		path: 'proposednpo',
		redirectTo: 'charity/proposed'
	},
	{
		path: 'me',
		redirectTo: 'user/me'
	},
	{
		path: 'me/recovery',
		redirectTo: 'auth/me/recovery'
	},
	{
		path: 'me/campaign',
		redirectTo: 'campaign/create'
	},
	{
		path: 'login',
		redirectTo: 'auth/login'
	},
	{
		path: 'signup',
		redirectTo: 'auth/signup'
	},
	{
		path: 'recovery',
		redirectTo: 'auth/recovery'
	},
	{
		path: 'signup/landing/:type',
		redirectTo: 'auth/signup/landing/:type'
	},

	/* Default */
	{
		path: '**',
		redirectTo: ''
	}
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, {
			scrollPositionRestoration: 'top',
			anchorScrolling: 'enabled',
			enableTracing: false,
			//useHash: false, initialNavigation: true, 
		})
	],
	exports: [
		RouterModule
	],
	providers: [
		{ provide: APP_BASE_HREF, useValue: '/' } // AppSettings.baseUrl + '/' },
	]
})
export class AppRoutingModule {
	constructor(
		router: Router,
		location: Location,
		route: ActivatedRoute
	) {
		// https://stackoverflow.com/questions/50297558/angular-4-create-different-language-path-route-to-the-same-component
		router.events.subscribe(ev => {
			if (ev instanceof NavigationEnd) {
				window.ga('send', {
					'hitType': 'pageview',
					'page': location.path()
				});
			}
			// else if (ev instanceof ActivationStart) {
			// 	// translateService.detectLanguage();
			// }
		})
	}
}


