<template lang='pug'>
  div
    dialog.mdl-dialog#giftDialog(style="top:0")
      div.mdl-dialog__content(style="padding:0")
        button.mdl-button.mdl-button--icon.mdl-js-button.mdl-js-ripple-effect(@click='closeGiftDialog', style="float:right")
          i.fa.fa-close
        span(v-if="params.campaign") {{ $t('GIFT_CAMPAIGN_DESCRIPTION') }}
        span(v-else) {{ $t('GIFT_DESCRIPTION') }}
        br
        .mdl-textfield.mdl-js-textfield(style="width:100%; padding: 5px")
          input.mdl-textfield__input(type="text",v-model='giftdata.name', placeholder="Name")
        .mdl-textfield.mdl-js-textfield(style="width:100%; padding: 5px")
          input.mdl-textfield__input(type="text",v-model='giftdata.message', placeholder="Message")
        .mdl-textfield.mdl-js-textfield(v-if="!params.campaign", style="width:100%; padding: 5px")
          input.mdl-textfield__input(type="text",placeholder="Email", v-model='giftdata.email')
      div.mdl-dialog__actions.mdl-dialog__actions--full-width(style="padding-top: 12px")
        button.mdl-button.mdl-js-button.mdl-button--raised.mdl-button--colored(type="button", :disabled="isGiftDataInvalid()", @click='setGiftDialog') Continue

    div(v-if="params.restype != 'event' || !params.distribution")
      span {{ $t('Insert the amount you want to donate') }} {{params.description}}
      form
        .mdl-grid
          .mdl-cell.mdl-cell--6-col.mdl-cell--4-col-tablet.mdl-cell--2-col-phone
            #textfieldbtc.mdl-textfield.mdl-textfield--floating-label.mdl-js-textfield(:class="{'is-invalid': invalid.btc, 'is-dirty': true}")
              input#bitcoinamount.mdl-textfield__input(type="number",step="0.00000001",@keyup="updateeur",v-model='amountbtc')
              label.mdl-textfield__label(for='bitcoinamount') Bitcoin
              span.mdl-textfield__error {{error}}
          .mdl-cell.mdl-cell--6-col.mdl-cell--4-col-tablet.mdl-cell--2-col-phone
            #textfieldeur.mdl-textfield.mdl-js-textfield.mdl-textfield--floating-label(:class="{'is-invalid': invalid.eur, 'is-dirty': true}")
              input#euroamount.mdl-textfield__input(type="number",step="0.01",@keyup="updatebtc",v-model='amount')
              label.mdl-textfield__label(for='euroamount') Euro
              span.mdl-textfield__error {{error}}
    div(v-else)
      p {{ $t('You are donating') }} {{amountbtc}}<i class="cc BTC-alt"></i> {{ $t('with following distribution') }}:
      ul.mdl-list
        li.user.mdl-list__item(v-for="(amount, username) in params.distribution")
          label.mdl-list__item-primary-content(:for='username') {{username}}
          span.block.mdl-list__item-secondary-content {{amount}} <i class="fa fa-bitcoin"></i>

    div(v-if="(params.restype != 'event' || !params.distribution) && giftEnabled")
      label.mdl-checkbox.mdl-js-checkbox.mdl-js-ripple-effect(for="giftCheckbox")
        input.mdl-checkbox__input#giftCheckbox(type="checkbox", :checked='gift', @change="$event.target.checked=false; dialog.showModal()")
        span(v-if="params.campaign").mdl-checkbox__label {{ $t('Send a message to the campaign creator') }}
        span(v-else).mdl-checkbox__label {{ $t('This donation is a gift') }}

    //- div(v-if="conf.mistralpay || conf.flypme")
    div
      p#payments {{$t('Select the payment method:')}}
        br
        a.mdl-button.mdl-button--raised.mdl-button--colored.mdl-js-button.mdl-js-ripple-effect(@click='donateHelperbit') Helperbit
        a.mdl-button.mdl-button--raised.mdl-button--colored.mdl-js-button.mdl-js-ripple-effect(@click='donateBitcoin') Bitcoin 
          i.fa.fa-btc
        //- a.mdl-button.mdl-button--raised.mdl-button--colored.mdl-js-button.mdl-js-ripple-effect(@click='donateEuro',v-show="conf.mistralpay") Credit/Debit card 
        //-   i.fa.fa-credit-card
        a.mdl-button.mdl-button--raised.mdl-button--colored.mdl-js-button.mdl-js-ripple-effect(@click='donateAltcoins',v-show="conf.flypme") Altcoins 
          i.fa.fa-flash
        a.mdl-button.mdl-button--raised.mdl-button--colored.mdl-js-button.mdl-js-ripple-effect(@click='donateMetamask',v-show="conf.flypme && metamask") Metamask 
          i(v-if="!selectMetamask",:class="[ 'cc', 'ETH-alt' ]")
          i.fa.fa-circle-o-notch.fa-spin.fa-fw(v-else)
</template>

<script>
import util from "util";
import dialogPolyfill from "dialog-polyfill/dialog-polyfill";
import "../../../lib/distribution";

export default {
  name: "amount",
  mounted() {
    this.params = util.get("params");
    this.conf = this.params.conf;
    this.info = util.get("info");
    this.giftEnabled = util.get("envConfig").features.donationcomment;
    this.gift = false;
    let fiatdonation = this.info.fiatdonation;
    if (
      fiatdonation.available === 0 ||
      util.btc2eur(fiatdonation.available) < fiatdonation.limits.eur.min
    ) {
      this.conf.mistralpay = false;
    }

    this.amountbtc = this.$parent.getAmount();
    this.updateeur();
    this.$nextTick(componentHandler.upgradeDom);

    const dialog = document.getElementById("giftDialog");
    if (!dialog.showModal) {
      dialogPolyfill.registerDialog(dialog);
    }
    this.dialog = dialog;
	this.metamask = window.web3 != undefined;
	
    ga("send", {
      hitType: "event",
      eventCategory: "Donation",
      eventAction: "widget_open",
      eventLabel: ""
    });
  },
  methods: {
    checkEmail(e) {
      const mail_re = /^([\w-+]+(?:\.[\w-+]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
      return mail_re.test(e);
    },
    isGiftDataInvalid() {
      if (this.giftdata.message.length < 4) return true;
      if (!this.params.campaign && !this.checkEmail(this.giftdata.email))
        return true;
      if (this.giftdata.name.length < 2) return true;
      return false;
    },
    closeGiftDialog() {
      this.gift = false;
      document.querySelector(".mdl-js-checkbox").MaterialCheckbox.uncheck();
      util.set("gift", null);
      this.dialog.close();
    },
    setGiftDialog() {
      this.gift = true;
      document.querySelector(".mdl-js-checkbox").MaterialCheckbox.check();
      util.set("gift", this.giftdata);
      this.dialog.close();
    },
    donateHelperbit() {
      let err = util.checkAmount(this.amount * 1, this.amountbtc * 1);
      if (err) {
        this.invalid.btc = true;
        this.invalid.eur = false;
        this.error = err;
        return;
      }

      util.set("payment", {
        amount: this.amount,
        amountbtc: this.amountbtc,
        method: "hb"
      });
      const envConfig = util.get("envConfig");
      if (util.get("logged")) {
        // check how many wallets user own
        const wallets = util.get("wallets");

        // directly redir user to hb in case of single wallet
        if (wallets.wallets.length === 1) {
          var url = `${envConfig.baseUrl}/me/wallet/donate/${this.params.restype}/${this.params.resid}?wallet=${wallets.wallets[0].address}&amount=${this.amountbtc}`;

          if (util.get("campaign")) url += `&campaign=${util.get("campaign")}`;

          const gift = util.get("gift");
          if (gift) {
            url += `&giftmessage=${gift.message}`;
            url += `&giftname=${gift.name}`;
            if (!util.get("campaign")) url += `&giftemail=${gift.email}`;
          }
          window.open(url, "_blank");
          return;
        }
        this.$router.push("/helperbit");
      } else {
        window.open(`${envConfig.baseUrl}/login`, "_blank");
      }
    },
    donateBitcoin() {
      let restype = this.params.restype;
      let resid = this.params.resid;

      let err = util.checkAmount(this.amount * 1, this.amountbtc * 1);
      if (err) {
        this.invalid.btc = true;
        this.invalid.eur = false;
        this.error = err;
        return;
      }
      util.set("payment", {
        amount: this.amount,
        amountbtc: this.amountbtc,
        fiat: false,
        method: "btc"
      });

      if (restype === "event") {
        this.$router.push("/chooseuser");
        return;
      }
      // TODO: loading icon in bitcoin button
      util
        .getDonate(restype, resid, this.amountbtc, "bitcoin")
        .then(data => {
          util.set("donate", data);
          this.$router.push("/address");
        })
        .catch(err => {
          this.invalid.btc = true;
          err = err.response.data;
          if (err.error == "E3") {
            if (err.data.reason === "small")
              this.error = `${this.$t(
                "Invalid amount: should be higher than"
              )} ${err.data.min}.`;
            else if (err.data.reason === "big")
              this.error = `${this.$t(
                "Invalid amount: should be lower than"
              )} ${err.data.max}.`;
            else this.error = this.$t("Invalid amount.");
          }
        });
    },
    donateEuro() {
      let err;
      if ((err = util.checkAmountFIAT(this.amount * 1, this.amountbtc * 1))) {
        this.invalid.eur = true;
        this.invalid.btc = false;
        this.error = err;
        return;
      }

      util.set("payment", {
        amount: this.amount * 1,
        amountbtc: this.amountbtc * 1,
        fiat: true,
        method: "fiat"
      });

      if (this.params.restype === "event") {
        this.$router.push("/chooseuser");
      } else {
        this.$router.push("/mistralpay");
      }
    },
    donateMetamask() {
      this.selectMetamask = true;

      try {
        window.web3 = new Web3(web3.currentProvider);
        window.ethereum.enable();
        util
          .getDonate(
            this.params.restype,
            this.params.resid,
            this.amountbtc,
            "ETH"
          )
          .then(data => {
            util.set("donate", data);
            this.$router.push("/altcoinwait");
          })
          .catch(e => {
            console.error("ERROR IN DONATE: ", e);
            alert("Error");
          });
      } catch(err) {
        alert('Error initializing metamask');
      }
    },
    donateAltcoins() {
      let err = util.checkAmount(this.amount * 1, this.amountbtc * 1);
      if (err) {
        this.invalid.btc = true;
        this.invalid.eur = false;
        this.error = err;
        return;
      }

      util.set("payment", {
        amount: this.amount * 1,
        amountbtc: this.amountbtc * 1,
        method: "alt"
      });

      this.$router.push("/altcoin");
    },
    updatebtc() {
      this.invalid.eur = false;
      this.invalid.btc = false;
      this.error = "";
      this.amountbtc = util.eur2btc(this.amount);
    },
    updateeur() {
      this.invalid.btc = false;
      this.invalid.eur = false;
      this.error = "";
      this.amount = util.btc2eur(this.amountbtc);
    }
  },
  data() {
    return {
      selectMetamask: false,
      conf: {},
      params: {},
      amount: 200,
      amountbtc: 0.1,
      error: "",
      invalid: { eur: false, btc: false },
      showradio: false,
      choosen: null,
      gift: false,
      giftEnabled: false,
      dialog: null,
      giftdata: {
        message: "",
        name: "",
        email: ""
      }
    };
  }
};
</script>

<style>
.block.mdl-list__item-secondary-content {
  display: block !important;
}

.user {
  min-height: 0px;
  padding: 0px;
  padding-top: 3px;
}

.amount {
  float: right;
}

#payments {
  text-align: right;
}

#payments a {
  margin-left: 5px;
  margin-bottom: 5px;
}

.mdl-list {
  max-height: 150px;
  overflow-y: auto;
}

input:invalid {
  box-shadow: none;
}
</style>