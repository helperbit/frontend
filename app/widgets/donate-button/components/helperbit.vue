<template lang='pug'>
  div(v-if="wallets.length > 0")
    div
      div {{ $t('You are donating') }} <strong>{{payment.amountbtc}}</strong><i class="cc BTC-alt"></i> using '<strong>{{choosenWallet.label}}</strong>' wallet.
      span Address <strong>{{choosenWallet.address}}</strong>

    a.mdl-button.mdl-button--colored.mdl-js-button.mdl-js-ripple-effect(v-if="wallets.length>1",@click="collapseWallet = !collapseWallet")
      span or choose another wallet &nbsp;
      i#collapseIcon.fa.fa-chevron-up(:class="{'rotate': collapseWallet}")
    ul#walletList.mdl-list(:class="{collapse: collapseWallet}")
      li.mdl-list__item.mdl-list__item--two-line(v-for='wallet in wallets')
        label.mdl-list__item-primary-content(:for="wallet.address")
          span {{wallet.label}}
          span.mdl-list__item-sub-title {{wallet.address}}
        span.mdl-list__item-secondary-action
          label.mdl-radio.mdl-js-radio.mdl-js-ripple-effect
            input.mdl-radio__button(type="radio",v-model="choosenAddress",name="choosenWallet",:value="wallet.address",:id="wallet.address")
    span.error(v-show="error") {{error}}
    a#next.mdl-button.mdl-button--raised.mdl-button--colored.mdl-js-button.mdl-js-ripple-effect(@click='next()') Donate
  
  div(v-else)
    div {{ $t('You have no wallet yet or not enough fund on it. Please create one first, or select a different method.') }}
</template>
<script>

import '../../../lib/distribution'
import util from 'util'

export default {
  name: 'helperbit',
  mounted () {
    const wallets = util.get('wallets')
    this.payment = util.get('payment')

    // retrieve balance of each wallets
    wallets.wallets.forEach( wallet => {
      util.getBalance(wallet.address)
      .then(res => {
        // check if has enougth fund to donate
        if (res.balance >= this.payment.amountbtc) {
          this.wallets.push(wallet)
          this.choosenWallet = wallet
          this.choosenAddress = wallet.address
        }
      })
    })
  },
  methods: {
    next () {
      const baseUrl = util.get('envConfig').baseUrl
      const params = util.get('params')

      // check if selected wallet has enough fund
      util.getBalance(this.choosenAddress)
      .then( (balance) => {
        if (balance.balance < this.payment.amountbtc) {
          this.error = 'Not enough fund in this wallet'
          setTimeout( () => this.error = '', 2000)
          return
        }
        let distrib
        if (params.restype === 'event') {
          // la distribution mi arriva dall'advanced donation
          if (params.distribution)
            distrib = params.distribution;
          else {
            const envConfig = util.get('envConfig')
            const dist = new Distribution(util.get('affected'), this.payment.amountbtc, 100, envConfig.userTypes)
            distrib = dist.toFormatted();
          }
          distrib = encodeURIComponent(JSON.stringify(distrib));
        }

        var url = `${baseUrl}/me/wallet/donate/${params.restype}/${params.resid}?wallet=${this.choosenAddress}&amount=${this.payment.amountbtc}`

		if(params.campaign)
			url += `&campaign=${params.campaign}`;
        if (distrib)
          url += `&distribution=${distrib}`

        // TOFIX: this should be done with a POST (as user distributions could be too long)
        window.open(url, '_blank')
      })
    }
  },
  watch: {
    choosenAddress (address) {
      this.choosenWallet = this.wallets.filter(w => w.address === address)[0]
    }
  },
  data () {
    return {
      error: '',
      choosenWallet: {},
      choosenAddress: null,
      wallets: [],
      payment: {},
      collapseWallet: true
    }
  }
}
</script>
<style scoped>

.error {
  color: red;
  position: absolute;
  right: 130px;
  bottom: 25px;
}

#next {
  float: right;
}

#walletList {
  overflow: hidden;
  transition: max-height .5s;
  max-height: 400px;
}

#walletList.collapse {
  max-height: 0px;
}

.mdl-radio {
  display: inline;
}

label.mdl-list__item-primary-content {
  height: 100%;
  width:100%;
  cursor: pointer;
}

#collapseIcon {
  transition: .5s transform;
}

#collapseIcon.rotate {
  transform: rotate(-180deg);
}

</style>