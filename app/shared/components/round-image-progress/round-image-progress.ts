import { Component, Input } from '@angular/core';
import { UserModel, User } from 'app/models/user';
import { UserPrivateModel, UserPrivate } from 'app/models/dashboard';

export interface RoundImageProgressConfig {
	percentage: number;
	borderClass: string;
	user: UserModel | UserPrivateModel | UserPrivate | User;
}

@Component({
	selector: 'round-image-progress',
	templateUrl: 'round-image-progress.html',
	styleUrls: ['round-image-progress.scss']
})
export class RoundImageProgressComponent {
	@Input() config: RoundImageProgressConfig;
}
