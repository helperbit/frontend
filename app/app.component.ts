import { Component } from '@angular/core';

// <loading-bar></loading-bar>
// <header-component ng-if="!$window.oldBrowser.showMainAlert"></header-component>
// <div ng-show="!$window.oldBrowser.showMainAlert" class="container fullwidth index-main-container">
// 	<div class="index-main-container-inner view-frame" ng-view></div>
// 	<footer-component></footer-component>
// </div>
// <old-browser-component></old-browser-component>

@Component({
	selector: 'helperbit-app',
	template: `
	<loading-bar></loading-bar>
	<header-component></header-component>
	<div class="container fullwidth index-main-container">
		<router-outlet></router-outlet>
		<footer-component></footer-component>
	</div>`
})
export class AppComponent { }
