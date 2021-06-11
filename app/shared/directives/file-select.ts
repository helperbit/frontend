import { Directive, EventEmitter, ElementRef, HostListener, Output } from '@angular/core';

@Directive({ selector: '[fileSelect]' })
export class FileSelectDirective {
	@Output() public select: EventEmitter<File[]> = new EventEmitter<File[]>();

	public constructor(private element: ElementRef) { }

	@HostListener('change')
	public onChange(): any {
		const files = this.element.nativeElement.files;
		this.select.emit(files[0]);
	}
}