import { Component, Input } from '@angular/core';

@Component({
	selector: 'spinner',
	templateUrl: 'spinner.html',
	styleUrls: ['spinner.scss']
})
export class SpinnerComponent {
	@Input() color: string;
}
