<template lang='pug'>
  div.modal-body
    span {{$t('MISTRAL_RECAP', {price, resid, amountbtc, fixedcost: fiatdonation.fixedcost, fee: fiatdonation.fee, withdrawcost: fiatdonation.withdrawcost })}}
    br
    br
    div(align="center")
      form(method="post",target="_blank",:action="envconfig.mistralpay.paymenturi")
        input(name="button",type="hidden",:value="envconfig.mistralpay.button")
        input(name="account",type="hidden",:value="envconfig.mistralpay.account")
        input(name="item_name",type="hidden",:value="`Donation of ${amountbtc}BTC to ${nponame}`")
        input(name="order_reference",type="hidden",:value="resid")
        input(name="price",type="hidden",:value="price")
        input(name="currency",type="hidden",:value="currency")
        input(name="security",type="hidden",value="3d or no3d")
        input(name="language",type="hidden",value="en,it")
        input(name="custom1",type="hidden",:value="amountbtc")
        input(name="custom2",type="hidden",:value="username")
        input(name="custom3",type="hidden",:value="campaign")
        input(name="custom4",type="hidden",:value="rescombo")
        input(name="custom5",type="hidden",:value="giftdata")
        input(type="image",src="https://stg.secure.mistralpay.com/media/images/payment_buttons/en/DONATE.png",title="Donate now")
        //- GIFT: bisogna settare i custom per il commento; direi unico campo separato da |
    hr

    p {{$t('You will receive an email when the donation is finalized.')}}
</template>

<script>
import util from 'util'

export default {
  name: 'mistralpay',
  mounted () {
    let payment = util.get('payment');
    let params = util.get('params');
    let resinfo = util.get('resource_info');
    this.nponame = util.get('nponame');
    let fiatdonation = this.fiatdonation = util.get('info').fiatdonation;
    if (this.$route.params.user) {
      this.nponame = this.resid = this.$route.params.user;
    } else if (params.restype === 'project') {
      this.resid = params.resid;
      //this.resid = resinfo.owner
    } else {
      this.resid = params.resid;
    }

    this.restype = params.restype;
    this.rescombo = this.restype + '|' + this.resid;

    // TODO: settare i dati del gift da passare al backend

    // set some cookie to retrieve donationType and id when coming back from mistralpay
    document.cookie = `donationType=${params.restype}; path=/;`;
    document.cookie = `donationTarget=${this.nponame}; path=/;`;
    document.cookie = `donationOrigURL=${params.host}${params.pathname}; path=/;`;

    this.price = (payment.amount).toFixed(2);

    /* Remove the fee */
    let fee = (payment.amountbtc * fiatdonation.fee / 100) + util.eur2btc(fiatdonation.fixedcost) + fiatdonation.withdrawcost;
    this.amountbtc = (payment.amountbtc - fee).toFixed(8);

    /* Set the campaign id */
    this.campaign = params.campaign || null;

    /* Set the logged username */
    this.username = util.get('username');

    /* Set the gift data */
    const gift = util.get('gift');
    if (gift) {
      this.giftdata = `${gift.name}|${gift.email}|${gift.message}`;
    } else {
      this.giftdata = "";
    }
  },
  data () {
    return {
      price: 0.0,
      amountbtc: 0.0,
      currency: 'EUR',
      nponame: '',
      resid: '',
      restype: '',
      rescombo: '',
      envconfig: util.get('envConfig'),
      fiatdonation: {}
    };
  }

}
</script>
