import { Component } from '@angular/core';

@Component({
	selector: 'about-section-benefit-component',
	templateUrl: 'benefit.html',
	styleUrls: ['benefit.scss']
})
export class AboutSectionBenefitComponent { 
	currentBenefit: string = '';
}