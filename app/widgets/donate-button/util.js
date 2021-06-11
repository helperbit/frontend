
import {get, post} from 'axios'

// import "old" js is done using exports-loader
import envConfig from 'exports-loader?envConfig!../../config.js'

let sharedStates = {}
const Util = {

  getCookie (name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
  },

  getLocalStorageItem (name) {
	return window.localStorage.getItem(name);
  },

  btc2eur (btc){
    let prices = this.get('info').prices
    return parseFloat((btc * prices.eur).toFixed(2))
  },

  eur2btc (eur) {
    let prices = this.get('info').prices
    return parseFloat((eur / prices.eur).toFixed(8))
  },

  // language detection
  getLang () {
    if (window.navigator.languages && window.navigator.languages.length !== 0)
      return window.navigator.languages[0].split ('-')[0]
    else
      return 'en'
  },

  // ref: https://bitbucket.org/helperbit/frontend/issues/824/widget-bugs-enanchements
  checkAmountFIAT (amount, amountbtc) {
    const i18n = window.hb_widget._i18n
    let fiatdonation = this.get('info').fiatdonation
    let max = Math.min(this.btc2eur(fiatdonation.limits.btc.max), fiatdonation.limits.eur.max, this.btc2eur(fiatdonation.available))
    let min = Math.max(this.btc2eur(fiatdonation.limits.btc.min), fiatdonation.limits.eur.min)

    if (isNaN(amount) || isNaN(amountbtc))
      return i18n.t('Invalid amount.')

    if (amount<min)
      return i18n.t('Invalid amount: should be higher than') + ' ' + min + '€'

    if (amount>max)
      return i18n.t('Invalid amount: should be lower than') + ' ' + max + '€'
  },

  checkAmount (amount, amountbtc) {
    const i18n = window.hb_widget._i18n
    const min = 0.001
    const max = 21000000.0

    if (isNaN(amount) || isNaN(amountbtc))
      return i18n.t('Invalid amount.')

    if (amountbtc<min)
      return i18n.t('Invalid amount: should be higher than') + ' ' + min + ' BTC'

    if (amountbtc>max)
      return i18n.t('Invalid amount: should be lower than') + ' ' + max + ' BTC'
  },

  // helper method to retrieve url query params
  getUrlParameter (sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
      sURLVariables = sPageURL.split('&'),
      sParameterName,
      i;

    for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split('=');

      if (sParameterName[0] === sParam) {
        return sParameterName[1] === undefined ? true : sParameterName[1];
      }
    }
  },

  getDonate (resType, resId, amount, method) {
    let url = `/${resType}/${resId}/donate?amount=${amount}`

    if (method!='bitcoin')
      url += `&altcurrency=${method}&extended=true`

    if (this.get('username'))
      url += `&username=${this.get('username')}`

    if (this.get('campaign'))
      url += `&campaign=${this.get('campaign')}`

    const gift = this.get('gift');
    if (gift) {
      url += `&giftmessage=${gift.message}`;
      url += `&giftname=${gift.name}`;
      if (!this.get('campaign'))
        url += `&giftemail=${gift.email}`;
    }

    return this.getApi(url)
  },

  getResourceInfo (resType, resId) {
    return this.getApi(`/${resType}/${resId}`)
  },

  // deprecated?
  getPrices () {
    return this.getApi(`/blockchain/prices`)
  },

  getInfo () {
    return this.getApi(`/info`)
  },

  getDonation (donation) {
    return this.getApi(`/donation/i/${donation}`)
  },

  getAltDonation (donation) {
    return this.getApi(`/donation/i/${donation}/alt`)
  },

  getUser () {
    return this.getApi(`/me`)
  },

  getBalance (wallet) {
    return this.getApi(`/wallet/${wallet}/balance`)
  },

  getWallets () {
    return this.getApi('/wallet')
  },

  getAffected (eventId) {
    return this.getApi(`/event/${eventId}/affectedusers`)
  },

  getApi (path) {
    const headers = {
      'X-Auth-Token': this.getCookie('alphatoken'),
      'Authorization': 'Bearer ' + this.getCookie('token')
    }
    const config = { withCredential: true, headers }
    return get(envConfig.apiUrl + path, config).then(data => data.data)
  },

  initialize () {
    let params = {}
    /* Get data */
    params.restype = this.getUrlParameter('t');
    params.resid = this.getUrlParameter('i');
    params.description = this.getUrlParameter('d');
    params.host = this.getUrlParameter('h');
    params.pathname = this.getUrlParameter('p');
    params.am = this.getUrlParameter('am') || 0.005;
    params.campaign = this.getUrlParameter('camp') || null;
    params.distribution = this.getUrlParameter('dis') ? JSON.parse(decodeURIComponent(this.getUrlParameter('dis'))) : null;
    params.prices = null;

    params.conf = {
      bitcoin: false,
      flypme: true,
      mistralpay: true
    };

    /** enable payment methods when needed **/
    var conft = this.getUrlParameter('c');
    if (conft) {
      conft.split (',').forEach ( e => params.conf[e] = true  )
    }

    this.set('params', params);
    this.set('campaign', params.campaign);
    return params
  },

  set (key, value) {
    sharedStates[key] = value
  },

  get: key => sharedStates[key]

}

export default Util