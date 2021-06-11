<template lang='pug'>
  div
      div(v-if="status=='WAITING_FOR_DEPOSIT'")
        span {{$t('Send exactly')}} {{donate.altamount}} {{donate.altcurrency}} {{$t('to the following address.')}}
        br
        br
        input#donateaddress.mdl-textfield__input(type="text",:value="donate.altaddress")
        button#cp.mdl-button.mdl-button--icon.mdl-js-button(v-clipboard:copy="donate.altaddress",v-clipboard:success="copied")
          i.fa.fa-paperclip
        label(for='donateaddress') {{donate.altcurrency}} address
        .mdl-tooltip(for='cp') {{$t(copy)}}
        br
        br
        #status.mdl-progress.mdl-js-progress.mdl-progress__indeterminate
        span {{$t(status)}}
        //- i.fa.fa-circle-o-notch.fa-spin.fa-fw

        span#expires {{$t('expires',[expiry])}}
        br
        br
        #metamask
          a.mdl-button.mdl-button--raised.mdl-button--colored.mdl-js-button.mdl-js-ripple-effect(:disabled="paidMetamask", @click='payMetamask',v-show="metamask && donate.altcurrency == 'ETH'") Pay with Metamask 
            i(v-if="!paidMetamask",:class="[ 'cc', 'ETH-alt' ]")
            i.fa.fa-circle-o-notch.fa-spin.fa-fw(v-else)

      div(v-if="status=='DEPOSIT_RECEIVED'")
        span {{$t(status)}}

        #confirm.mdl-progress.mdl-js-progress
        span {{confirmation}}/{{tot_confirmation}}

      div(v-if="status=='EXECUTED'")
        .mdl-progress.mdl-js-progress.mdl-progress__indeterminate
        span {{$t(status)}}
    
      div(v-if="status=='DONE'")
        div(align='center')
          i#heart.fa.fa-heart
        div(align='center')
          span {{$t('Transaction received, the donation is confirmed. Thank you for your support!')}}
          span {{$t('You can check your donation ')}}
            a(:href="txurl") {{$t('on helperbit')}}


</template>
<script>
// const statusMap = {
//   'WAITING_FOR_DEPOSIT': 10,
//   'DEPOSIT_RECEIVED': 50,
//   'DEPOSIT_CONFIRMED': 75,
//   'EXECUTED': 90
// }

import util from "util";
import { distanceInWordsToNow, differenceInSeconds } from "date-fns";

import localeIt from "date-fns/locale/it";
import localeEn from "date-fns/locale/en";

const locale = util.getLang() === "it" ? localeIt : localeEn;

let interval;

export default {
  name: "altcoinwait",
  destroyed() {
    clearInterval(interval);
  },
  mounted() {
    let payment = util.get("payment");
    this.metamask = window.web3 != undefined;
    this.paidMetamask = false;
    this.donate = util.get("donate");
    this.expiry = distanceInWordsToNow(this.donate.expiry, { locale });
    this.$nextTick(() => {
      componentHandler.upgradeDom();
      // document.querySelector('#status').MaterialProgress.setProgress(0)
    });
	interval = setInterval(() => this.checkDonation(this.donate), 5000);
	
    ga("send", {
      hitType: "event",
      eventCategory: "Donation",
      eventAction: "widget_altcoin_pending",
      eventLabel: "coin: " + this.donate.altcurrency
    });
  },
  methods: {
    copied() {
      this.copy = "Copied";
      setTimeout(() => (this.copy = "Copy address"), 2000);
    },
    payMetamask() {
      try {
        web3.eth.sendTransaction(
          {
            to: this.donate.altaddress.toLowerCase(),
            value: web3.toWei(this.donate.altamount, "ether")
          },
          (err, transactionId) => {
            if (err) {
              alert("Payment failed!");
              console.log("Payment failed", err);
              $("#status").html("Payment failed");
            } else {
              this.paidMetamask = true;
            }
          }
        );
      } catch (err) {
        alert("Payment failed!");
      }
    },
    checkDonation(donation) {
      this.$nextTick(() => {
        componentHandler.upgradeDom();
      });
      this.expiry = distanceInWordsToNow(donation.expiry, { locale });
      util.getAltDonation(donation.donation).then(donation => {
        this.status = donation.status;
        // document.querySelector('#status').MaterialProgress.setProgress(statusMap[this.status])
        switch (this.status) {
          case "EXPIRED":
            clearInterval(interval);
            this.$router.replace(
              "/error/The address is expired without receiving the donation./fa-clock-o"
            );
            break;
          case "CANCELED":
            console.error("canceled", this.status);
            clearInterval(interval);
            this.$router.replace(
              "/error/The address is expired without receiving the donation./fa-clock-o"
            );
            break;
          case "DEPOSIT_RECEIVED":
            [
              this.confirmation,
              this.tot_confirmation
            ] = donation.confirmations.split("/");
            if (this.tot_confirmation)
              document
                .getElementById("confirm")
                .MaterialProgress.setProgress(
                  (this.confirmation * 100) / this.tot_confirmation
                );
            break;
          case "EXECUTED":
            clearInterval(interval);
            this.checkFinalDonation(this.donate);
            interval = setInterval(
              () => this.checkFinalDonation(this.donate),
              5000
            );
            break;
        }
      });
    },
    checkFinalDonation(donation) {
      // if (differenceInSeconds(new Date(), donation.expiry) > 0) {
      //   clearInterval(interval)
      //   this.$router.replace('/error/The address is expired without receiving the donation./fa-clock-o')
      //   return
      // }
      // this.expiry = distanceInWordsToNow(donation.expiry, {locale})
      util.getDonation(donation.donation).then(donation => {
        if (donation.status !== "waiting") {
          this.status = "DONE";
          clearInterval(interval);
          let baseurl = util.get("envConfig").baseUrl;
		  this.txurl = `${baseurl}/donation/${donation.txid}`;
		  
          ga("send", {
            hitType: "event",
            eventCategory: "Donation",
            eventAction: "donation_done",
            eventLabel: 'alt_' + donation.txid
          });
          // util.set('donation', donation)
          // this.$router.replace('/done')
        }
      });
    }
  },
  data() {
    return {
      paidMetamask: false,
      copy: "Copy address",
      expiry: "",
      donate: {},
      status: "WAITING_FOR_DEPOSIT",
      confirmation: 0,
      tot_confirmation: 0,
      txurl: ""
    };
  }
};
</script>
<style>
#donateaddress {
  width: 90%;
  display: inline;
}

#status > .auxbar,
#status > .progressbar {
  background-color: #fe8b37;
}

#expires {
  float: right;
  font-size: 85%;
}

#metamask {
  text-align: center;
}
</style>