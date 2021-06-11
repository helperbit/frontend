<template lang='pug'>
  //- address and qrcode
  div
    span {{$t('Send exactly')}} {{donate.amount}} <i class="fa fa-bitcoin"></i> {{$t('to the following address.')}}
    a(:href="qrcode",target="_blank")
      center#qrcode
        qrcode-vue(:value="qrcode",size="120")

    div
      input#donateaddress.mdl-textfield__input(type="text",:value="donate.address")
      button#cp.mdl-button.mdl-button--icon.mdl-js-button(v-clipboard:copy="donate.address",v-clipboard:success="copied")
        i.fa.fa-paperclip
      label(for='donateaddress') bitcoin address
      .mdl-tooltip(for='cp') {{$t(copy)}}

      #status.mdl-progress.mdl-js-progress.mdl-progress__indeterminate

    span#expires {{$t('expires',[expiry])}}
</template>
<script>
import util from "util";
import QrcodeVue from "qrcode.vue";
import { distanceInWordsToNow, differenceInSeconds } from "date-fns";

import localeIt from "date-fns/locale/it";
import localeEn from "date-fns/locale/en";

const locale = util.getLang() === "it" ? localeIt : localeEn;

let interval;

export default {
  name: "address",
  components: { QrcodeVue },
  destroyed() {
    clearInterval(interval);
  },
  mounted() {
    let payment = util.get("payment");
    this.donate = util.get("donate");
    this.qrcode =
      "bitcoin:" + this.donate.address + "?amount=" + this.donate.amount;
    this.expiry = distanceInWordsToNow(this.donate.expiry, { locale });
    interval = setInterval(() => this.checkDonation(this.donate), 5000);
    this.$nextTick(componentHandler.upgradeDom);

    ga("send", {
      hitType: "event",
      eventCategory: "Donation",
      eventAction: "widget_bitcoin_pending",
      eventLabel: "amount: " + this.donate.amount
    });
  },
  methods: {
    copied() {
      this.copy = "Copied";
      setTimeout(() => (this.copy = "Copy address"), 2000);
    },
    checkDonation(donation) {
      if (differenceInSeconds(new Date(), donation.expiry) > 0) {
        clearInterval(interval);
        this.$router.replace(
          "/error/The address is expired without receiving the donation./fa-clock-o"
        );
        return;
      }
      this.expiry = distanceInWordsToNow(donation.expiry, { locale });
      util.getDonation(donation.donation).then(donation => {
        if (donation.status !== "waiting") {
          clearInterval(interval);
          util.set("donation", donation);
          this.$router.replace("/done");
        }
      });
    }
  },
  data() {
    return {
      copy: "Copy address",
      expiry: "",
      donate: {},
      qrcode: ""
    };
  }
};
</script>
<style>
#donateaddress {
  width: 90%;
  display: inline;
}

#qrcode {
  padding: 1em;
}

#expires {
  float: right;
  font-size: 85%;
}
</style>