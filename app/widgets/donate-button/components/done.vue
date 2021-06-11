<template lang='pug'>
  <!-- Done -->
  div
    div(align='center')
      i#heart.fa.fa-heart
    div(align='center')
      span {{$t('Transaction received, the donation is confirmed. Thank you for your support!')}}

      br
      br

      //- facebook
      a(:href="`https://www.facebook.com/dialog/feed?app_id=923885957687450&display=popup&link=https://helperbit.com/donation/${txid}&redirect_uri=https://helperbit.com&quote=${text}`", target="_blank")
        span.fa-stack.fa-lg
          i.fa.fa-circle.fa-stack-2x
          i.fa.fa-facebook.fa-stack-1x.fa-inverse
      
      //- twitter
      a(:href="`https://twitter.com/share?url=https://helperbit.com/donation/${txid}&via=&hashtags=&text=${text}`", target="_blank")
        span.fa-stack.fa-lg
          i.fa.fa-circle.fa-stack-2x
          i.fa.fa-twitter.fa-stack-1x.fa-inverse

      //- linkedin
      a(:href="`http://www.linkedin.com/shareArticle?url=https://helperbit.com/donation/${txid}&title=${text}`", target="_blank")
        span.fa-stack.fa-lg
          i.fa.fa-circle.fa-stack-2x
          i.fa.fa-linkedin.fa-stack-1x.fa-inverse

</template>
<script>
import util from "util";

export default {
  name: "done",
  mounted() {
    let donation = util.get("donation");
    let nponame = util.get("nponame");

    this.txid = donation.txid;
    this.text = `${this.$t("I've just donated")} ${
      donation.value
    } BTC ${this.$t("to")} "${nponame}" ${this.$t("via")} @helperbit.`;

    ga("send", {
      hitType: "donation",
      eventCategory: "Donation",
      eventAction: "donation_done",
      eventLabel: 'btc_' + donation.txid
    });
  },
  data() {
    return {
      text: ""
    };
  }
};
</script>
<style>
#heart {
  font-size: 5em;
  color: #05a852;
}
</style>