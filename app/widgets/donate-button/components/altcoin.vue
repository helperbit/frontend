<template lang='pug'>
  <!-- Altcoin -->
  div#currency
    span {{$t('Click here to donate with altcoins (ethereum and other) through an external service:')}}
    br
    br

    //- ul#list.mdl-list
    //-   button.mdl-button.mdl-js-button.mdl-js-ripple-effect.mdl-list__item(v-for='(limits, coin) in coins', :show="limits.max",@click="donate(coin)") <i :class="[ 'cc', coin ]"></i> {{coin}}

    center
      a.mdl-button.mdl-button--raised.mdl-button--colored.mdl-js-button.mdl-js-ripple-effect(v-for='currency in sortedCurrencies',@click="donate(currency)") {{currency}}&nbsp;
        i(v-if="currency!=loading",:class="[ 'cc', currency ]")
        i.fa.fa-circle-o-notch.fa-spin.fa-fw(v-else)


</template>
<script>
import util from "util";
export default {
  name: "altcoin",
  mounted() {
    this.payment = util.get("payment");
    this.params = util.get("params");
    this.$nextTick(componentHandler.upgradeDom);

    ga("send", {
      hitType: "event",
      eventCategory: "Donation",
      eventAction: "widget_altcoin_selection",
      eventLabel: ""
    });
  },
  data() {
    return {
      loading: "",
      payment: {}
    };
  },
  computed: {
    sortedCurrencies() {
      let currencies = [];

      // show these currencies with priority
      let priorityCurrencies = ["ETH", "LTC", "DASH", "ZEC", "DOGE", "SYS"];

      // remove currencies with max limit = 0 (and BTC)
      // and build currencies array
      let limits = util.get("info").flypme.limits;
      for (let currency in limits) {
        if (limits[currency].max == 0 || currency === "BTC") continue;
        currencies.push(currency);
      }

      // remove currencies not needed from prio
      priorityCurrencies = priorityCurrencies.filter(
        c => currencies.indexOf(c) !== -1
      );
      return currencies.sort((a, b) => {
        let indexA = priorityCurrencies.indexOf(a);
        let indexB = priorityCurrencies.indexOf(b);

        if (indexA < 0 && indexB < 0) return 0;
        if (indexA >= 0 && indexB < 0) return -1;
        if (indexB >= 0 && indexA < 0) return 1;
        return indexA - indexB;
      });
    }
  },
  methods: {
    donate(currency) {
      this.loading = currency;
      this.username = util.get("username");

      // TODO: pass gift data
      util
        .getDonate(
          this.params.restype,
          this.params.resid,
          this.payment.amountbtc,
          currency
        )
        .then(data => {
          util.set("donate", data);
          this.$router.push("/altcoinwait");
        })
        .catch(e => {
          console.error("ERROR IN DONATE: ", e);
          this.$router.go(-1);
        });
    }
  }
};
</script>
<style>
#list {
  max-height: 200px;
  overflow-y: scroll;
}

#currency a {
  margin-right: 5px;
  margin-top: 5px;
}
</style>