import * as $ from 'jquery';
import { Directive, HostListener, Input, ElementRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Directive({
	selector: '[copyToClipboard]'
})
export class CopyToClipboardDirective {
	@Input() copyToClipboard: string;
	@Input() copiedText: string;

	constructor(
		private element: ElementRef,
		private translate: TranslateService
	) { }

	@HostListener('click')
	public onClick() {
		const $element = this.element.nativeElement;
		const el = document.createElement('textarea');
		el.value = this.copyToClipboard;
		el.setAttribute('readonly', '');
		el.style.position = 'absolute';
		el.style.left = '-9999px';
		$element.appendChild(el);
		el.select();

		try { // webkit, opera, ff, ie 10, safari
			document.execCommand('copy');
		} catch (err) { // IE 9 fallback
			alert(this.translate.instant('Auto copy not available on this browser. Please press Ctrl/Cmd + C or right click + copy'));
		} finally {
			//save original tooltip content
			const originalText = $element.getAttribute('tooltip');

			$($element).tooltip('destroy');

			const title = (this.copiedText && this.copiedText.length > 0) ? this.copiedText : this.translate.instant('Copied!');

			$($element).tooltip({
				placement: 'bottom',
				animation: true,
				html: true,
				trigger: 'hover',
				title: title
			});

			$($element).tooltip('show');

			//remove tooltip of "copied" message and recreate the original tooltip
			$($element).mouseleave(function (event) {
				$($element).tooltip('destroy');

				$($element).tooltip({
					placement: 'bottom',
					animation: true,
					html: true,
					trigger: 'hover',
					title: originalText
				});
			});
		}

		$element.removeChild(el);
	}

	// ngOnInit() {
	// 	const $element = this.element.nativeElement;
	// 	$element.on('click', (event) => {
	// 		const el = document.createElement('textarea');
	// 		el.value = this.copyToClipboard;
	// 		el.setAttribute('readonly', '');
	// 		el.style.position = 'absolute';
	// 		el.style.left = '-9999px';
	// 		$element[0].appendChild(el);
	// 		el.select();

	// 		try { // webkit, opera, ff, ie 10, safari
	// 			document.execCommand('copy');
	// 		}
	// 		catch (err) { // IE 9 fallback
	// 			alert(this.translate.instant('Auto copy not available on this browser. Please press Ctrl/Cmd + C or right click + copy'));
	// 		}
	// 		finally {
	// 			//save original tooltip content
	// 			const originalText = $element[0].getAttribute('tooltip-content');

	// 			$($element).tooltip('destroy');

	// 			const title = (this.copiedText && this.copiedText.length > 0) ? this.copiedText : this.translate.instant('Copied!');

	// 			$($element).tooltip({
	// 				placement: 'bottom',
	// 				animation: true,
	// 				html: true,
	// 				trigger: 'hover',
	// 				title: title
	// 			});

	// 			$($element).tooltip('show');

	// 			//remove tooltip of "copied" message and recreate the original tooltip
	// 			$($element).mouseleave(function (event) {
	// 				$($element).tooltip('destroy');

	// 				$($element).tooltip({
	// 					placement: 'bottom',
	// 					animation: true,
	// 					html: true,
	// 					trigger: 'hover',
	// 					title: originalText
	// 				});
	// 			});
	// 		}

	// 		$element[0].removeChild(el);
	// 	});
	// }
}
