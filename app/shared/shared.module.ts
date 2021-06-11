import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { InfoBoxComponent } from './components/info-box/info-box';
import { SpinnerComponent } from './components/spinner/spinner';
import { SVGIconComponent } from './components/svg-icon/svg-icon';
import { PageHeaderComponent } from './components/page-header/page-header';
import { WizardProcedureComponent } from './components/wizard-procedure/wizard-procedure';
import { ButtonsGroupComponent } from './components/buttons-group/buttons-group';
// import ChartComponent from './components/chart/chart';
import { ModalInnerComponent } from './components/modal/oldModal/modal-inner';
import { ArchwizardModule } from 'angular-archwizard';

import { OrdinalPipe } from './filters/ordinal';
import { CropPipe } from './filters/crop';
import { ExplorerPipe } from './filters/explorer';
// import { TranslatePipe } from './filters/translate';
import { MoneyPipe } from './filters/money';
// import { FeatureDirective } from './directives/feature';
import { TimediffPipe } from './filters/timediff';
import { CountryPipe } from './filters/country';
import { CurrencyPipe } from './filters/currency';
import { AvatarPipe } from './filters/avatar';
import { MediaPipe } from './filters/media';
import { MagnitudePipe } from './filters/magnitude';
import { NumberFormatterPipe } from './filters/number-formatter';
import { UsertypePipe } from './filters/usertype';
import { TranslatedComponent } from './components/translated/translated';
import { LanguageSelectorComponent } from './components/language-selector/language-selector';
import { TooltipDirective } from './directives/tooltip';
// import TranslateDirective from './directives/translate';
import { AddressBalanceComponent } from './components/address-balance/address-balance';
// import LightboxComponent from './components/lightbox/lightbox';
import { ImgAttrsDirective } from './directives/img-attrs';
import { TagsInfoComponent } from './components/tags-info/tags-info';
import { ProgressBarComponent } from './components/progress-bar/progress-bar';
import { ProjectComponent } from './components/project/project';
import { SeourlPipe } from './filters/seourl';
import { TextLimitPipe } from './filters/text-limit';
import { StranslatePipe } from './filters/stranslate';
import { MoneyUSDPipe } from './filters/moneyUSD';
import { MoneyFIATPipe } from './filters/moneyFIAT';
import { MoneyToBTCPipe } from './filters/money-to-btc';
import { LinkyCompilePipe } from './filters/linky-compile';
import { CurrencySelectorComponent } from './components/currency-selector/currency-selector';
import { RoundImageProgressComponent } from './components/round-image-progress/round-image-progress';
import { SidebarComponent } from './components/sidebar/sidebar';
import { CopyToClipboardDirective } from './directives/copy-to-clipboard';
import { SocialShareComponent } from './components/social-share/social-share';
import { BadgesGridComponent } from './components/badges-grid/badges-grid';
import { ExternalLinkComponent } from './components/external-link/external-link';
import { OptionsSidebarComponent } from './components/options-sidebar/options-sidebar';
// import SlidershowComponent from './components/slidershow/slidershow';
import { EventComponent } from './components/event/event';
import { PaginationComponent } from './components/pagination/pagination';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
// import { SliderComponent } from './components/mv-slider';
import { DonationListComponent } from './components/donation-list/donation-list';
import { FileSelectDirective } from './directives/file-select';
import { CountriesMapComponent } from './components/countries-map/countries-map';
// import FileThumbComponent from './components/file-thumb/file-thumb';
import { RecaptchaModule } from 'ng-recaptcha';
import { FormlyModule } from '@ngx-formly/core';
import { ResponseMessagesComponent } from './components/response-messages/response-messages';
import { DecimalPipe } from '@angular/common';
// import { FormlyWrapperFormField } from './ngx-formly/wrapper/form-field';
import { FormlyFieldRecaptcha } from './ngx-formly/fields/recaptcha/recaptcha';
import { LoadingDirective } from './directives/loading';
import { FormlyFieldPolicyConsent } from './ngx-formly/fields/policy-consent/policy-consent';
import { HomeTopComponent } from './components/home-top/home-top';
import { HomeStatsComponent } from './components/home-stats/home-stats';
import { AuthGuard } from './helpers/auth-guard';
import { KeysPipe } from './filters/ngForKeys';
import { FormlyFieldFieldGroupLabel } from './ngx-formly/fields/field-group-label/field-group-label';
import { ModalComponent2 } from './components/modal/modal';
import { TranslateModule } from '@ngx-translate/core';
import { ModalComponent } from './components/modal/oldModal/modal';
import { ProposedNpoInsertComponent } from './components/proposednpo-insert/proposednpo-insert';
import { FormlyFieldFieldLabel } from './ngx-formly/fields/field-label/field-label';
import { MoneyInputDirective } from './directives/money-input';
import { CropUrlPipe } from './filters/crop-url';
import { ProjectLandscapeComponent } from './components/project-landscape/project-landscape';
// import { NgxBootstrapSliderModule } from 'ngx-bootstrap-slider';
// import CountdownComponent from './components/countdown/countdown';
// import ChatComponent from './components/chat/chat';
// import FormlyFieldToggleSwitch from './ngx-formly/fields/toggle-switch';
// import DateSelectorComponent from './components/date-selector/date-selector';
// import FormlyFieldDateSelector from './ngx-formly/fields/date-selector';
// import FormlyFieldDropzone from './ngx-formly/fields/dropzone/dropzone';
// import DropzoneComponent from './components/dropzone/dropzone';
// import NumberDecimalComponent from './components/number-decimal/number-decimal';
// import FormlyFieldNumberDecimal from './ngx-formly/fields/number-decimal';
// import TagsButtonsComponent from './components/tags-buttons/tags-buttons';
// import FormlyFieldTagsButtons from './ngx-formly/fields/tags-buttons';
// import ChooseElementsModalComponent from './components/choose-elements/choose-elements';
// import FormlyFieldChooseElements from './ngx-formly/fields/choose-elements';
// import MultiLanguageTextComponent from './components/multi-language-text/multi-language-text';
// import FormlyFieldMultiLanguageText from './ngx-formly/fields/multi-language-text';
// import FormlyFieldPhoneNumber from './ngx-formly/fields/phone-number/phone-number';
// import { Ng2TelInputDirective } from './directives/ng2-tel-input';
// import FormlyFieldTags from './ngx-formly/fields/tags/tags';
// import { TagInputModule } from 'ngx-chips';
// import FormlyFieldUrlYoutube from './ngx-formly/fields/url-youtube/url-youtube';
// import FormlyFieldButtonsGroup from './ngx-formly/fields/buttons-group/buttons-group';

@NgModule({
	imports: [
		RouterModule,
		CommonModule,
		TranslateModule,
		LeafletModule,
		NgbModalModule,
		// NgxBootstrapSliderModule,
		RecaptchaModule,
		FormsModule,
		ReactiveFormsModule,
		FormlyModule,
		ArchwizardModule,
		// TagInputModule
	],
	exports: [
		//@components
		InfoBoxComponent,
		SpinnerComponent,
		SVGIconComponent,
		PageHeaderComponent,
		WizardProcedureComponent,
		TranslatedComponent,
		LanguageSelectorComponent,
		AddressBalanceComponent,
		// LightboxComponent,
		TagsInfoComponent,
		ProgressBarComponent,
		ProjectComponent,
		ProjectLandscapeComponent,
		ButtonsGroupComponent,
		// ChartComponent,
		ModalComponent2,
		ModalComponent,
		ModalInnerComponent,
		CurrencySelectorComponent,
		RoundImageProgressComponent,
		SidebarComponent,
		SocialShareComponent,
		BadgesGridComponent,
		ExternalLinkComponent,
		// SlidershowComponent,
		EventComponent,
		// SliderComponent,
		PaginationComponent,
		OptionsSidebarComponent,
		DonationListComponent,
		CountriesMapComponent,
		// FileThumbComponent,
		ResponseMessagesComponent,
		HomeStatsComponent,
		HomeTopComponent,
		// DateSelectorComponent,
		// DropzoneComponent,
		// NumberDecimalComponent,
		// TagsButtonsComponent,
		// ChooseElementsModalComponent,
		// MultiLanguageTextComponent,
		ProposedNpoInsertComponent,
		// ChatComponent,
		// CountdownComponent,

		//ngx formly fields
		// FormlyWrapperFormField,
		FormlyFieldRecaptcha,
		// FormlyFieldToggleSwitch,
		// FormlyFieldPolicyConsent,
		// FormlyFieldDateSelector,
		// FormlyFieldDropzone,
		// FormlyFieldNumberDecimal,
		// FormlyFieldTagsButtons,
		// FormlyFieldChooseElements,
		// FormlyFieldMultiLanguageText,
		FormlyFieldFieldLabel,
		FormlyFieldFieldGroupLabel,
		// FormlyFieldPhoneNumber,
		// FormlyFieldTags,
		// FormlyFieldUrlYoutube,
		// FormlyFieldButtonsGroup,

		TooltipDirective,
		ImgAttrsDirective,
		// TranslateDirective,
		// FeatureDirective,
		CopyToClipboardDirective,
		FileSelectDirective,
		LoadingDirective,
		MoneyInputDirective,
		// FileValueAccessorDirective,
		// Ng2TelInputDirective,

		//@pipes
		CropUrlPipe,
		OrdinalPipe,
		CropPipe,
		ExplorerPipe,
		// TranslatePipe,
		MoneyPipe,
		TimediffPipe,
		CountryPipe,
		CurrencyPipe,
		AvatarPipe,
		MagnitudePipe,
		MediaPipe,
		NumberFormatterPipe,
		UsertypePipe,
		SeourlPipe,
		TextLimitPipe,
		StranslatePipe,
		MoneyUSDPipe,
		MoneyFIATPipe,
		MoneyToBTCPipe,
		LinkyCompilePipe,
		KeysPipe
	],
	declarations: [
		//@components
		InfoBoxComponent,
		SpinnerComponent,
		SVGIconComponent,
		PageHeaderComponent,
		TranslatedComponent,
		WizardProcedureComponent,
		LanguageSelectorComponent,
		AddressBalanceComponent,
		// LightboxComponent,
		TagsInfoComponent,
		ProgressBarComponent,
		ProjectComponent,
		ProjectLandscapeComponent,
		ButtonsGroupComponent,
		// ChartComponent,
		ModalComponent2,
		ModalComponent,
		ModalInnerComponent,
		CurrencySelectorComponent,
		RoundImageProgressComponent,
		SidebarComponent,
		SocialShareComponent,
		BadgesGridComponent,
		ExternalLinkComponent,
		OptionsSidebarComponent,
		// SlidershowComponent,
		EventComponent,
		// SliderComponent,
		PaginationComponent,
		DonationListComponent,
		CountriesMapComponent,
		// FileThumbComponent,
		ResponseMessagesComponent,
		HomeStatsComponent,
		HomeTopComponent,
		// DateSelectorComponent,
		// DropzoneComponent,
		// NumberDecimalComponent,
		// TagsButtonsComponent,
		// ChooseElementsModalComponent,
		// MultiLanguageTextComponent,
		ProposedNpoInsertComponent,
		// ChatComponent,
		// CountdownComponent,

		//ngx formly fields
		// FormlyWrapperFormField,
		FormlyFieldRecaptcha,
		// FormlyFieldToggleSwitch,
		FormlyFieldPolicyConsent,
		// FormlyFieldDateSelector,
		// FormlyFieldDropzone,
		// FormlyFieldNumberDecimal,
		// FormlyFieldTagsButtons,
		// FormlyFieldChooseElements,
		// FormlyFieldMultiLanguageText,
		FormlyFieldFieldLabel,
		FormlyFieldFieldGroupLabel,
		// FormlyFieldPhoneNumber,
		// FormlyFieldTags,
		// FormlyFieldUrlYoutube,
		// FormlyFieldButtonsGroup,

		TooltipDirective,
		ImgAttrsDirective,
		// TranslateDirective,
		// FeatureDirective,
		CopyToClipboardDirective,
		FileSelectDirective,
		LoadingDirective,
		MoneyInputDirective,
		// FileValueAccessorDirective,
		// Ng2TelInputDirective,

		//@pipes
		CropUrlPipe,
		OrdinalPipe,
		CropPipe,
		// TranslatePipe,
		ExplorerPipe,
		MoneyPipe,
		TimediffPipe,
		CountryPipe,
		CurrencyPipe,
		AvatarPipe,
		MagnitudePipe,
		MediaPipe,
		NumberFormatterPipe,
		UsertypePipe,
		SeourlPipe,
		TextLimitPipe,
		StranslatePipe,
		MoneyUSDPipe,
		MoneyFIATPipe,
		MoneyToBTCPipe,
		LinkyCompilePipe,
		KeysPipe
	],
	entryComponents: [
		// InfoBoxComponent,
		// SpinnerComponent,
		// SVGIconComponent,
		// PageHeaderComponent,
		// WizardProcedureComponent,
		// TranslatedComponent,
		// AddressBalanceComponent,
		// LanguageSelectorComponent,
		// LightboxComponent,
		// TagsInfoComponent,
		// ProgressBarComponent,
		// ProjectComponent,
		// ProjectLandscapeComponent,
		// ButtonsGroupComponent,
		// ChartComponent,
		ModalComponent2,
		// ModalComponent,
		// ModalInnerComponent,
		// CurrencySelectorComponent,
		// RoundImageProgressComponent,
		// SidebarComponent,
		// SocialShareComponent,
		// BadgesGridComponent,
		// ExternalLinkComponent,
		// OptionsSidebarComponent,
		// SlidershowComponent,
		// EventComponent,
		// SliderComponent,
		// PaginationComponent,
		// DonationListComponent,
		// CountriesMapComponent,
		// FileThumbComponent,
		// ResponseMessagesComponent,
		// HomeStatsComponent,
		// HomeTopComponent,
		// DateSelectorComponent,
		// DropzoneComponent,
		// NumberDecimalComponent,
		// TagsButtonsComponent,
		// ChooseElementsModalComponent,
		// MultiLanguageTextComponent,
		// ChatComponent,
		// CountdownComponent,

		//ngx formly fields
		// FormlyWrapperFormField,
		FormlyFieldRecaptcha,
		// FormlyFieldToggleSwitch,
		FormlyFieldPolicyConsent,
		// FormlyFieldDateSelector,
		// FormlyFieldDropzone,
		// FormlyFieldNumberDecimal,
		// FormlyFieldTagsButtons,
		// FormlyFieldChooseElements,
		// FormlyFieldMultiLanguageText,
		FormlyFieldFieldLabel,
		FormlyFieldFieldGroupLabel,
		// FormlyFieldPhoneNumber,
		// FormlyFieldTags,
		// FormlyFieldUrlYoutube,
		// FormlyFieldButtonsGroup,

		ProposedNpoInsertComponent
	],
	providers: [
		AuthGuard,
		MoneyPipe,
		TimediffPipe,
		DecimalPipe,
		NgbModalModule
	]
})
export class SharedModule {
	constructor() { }
} 