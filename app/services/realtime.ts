import * as io from 'socket.io-client';
import AppSettings from '../app.settings';
import { Injectable } from '@angular/core'

@Injectable({
	providedIn: 'root'
})
export class RealtimeService {
	socket: io.socket;
	
	constructor() {
		this.socket = null;
	}

	init() {
		this.socket = io(AppSettings.apiUrl.replace('/api/v1', ''));
	}
}
