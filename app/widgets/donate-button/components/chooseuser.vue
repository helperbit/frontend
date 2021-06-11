<template lang='pug'>
  div
    p(v-if="payment.fiat") {{ $t('Choose an user to donate') }} {{payment.amount}}€ to:
    p(v-else) {{ $t('Choose an user to donate') }} {{payment.amountbtc}}<i class="cc BTC-alt"></i> to:
    ul.mdl-list
      li.user.mdl-list__item(v-for="username in users")
        label.mdl-list__item-primary-content.mdl-radio.mdl-js-radio.mdl-js-ripple-effect(:for='username') {{username}}
          input.mdl-radio__button(type='radio', :id='username', name='choosen', :value="username",v-model='choosen')
    p#payments
      span.error(v-show="error") {{error}}
      a.mdl-button.mdl-button--raised.mdl-button--colored.mdl-js-button.mdl-js-ripple-effect(@click='donate') Donate 
</template>

<script>
  import util from 'util'

  export default {
    name: 'chooseuser',
    mounted () {
      const envConfig = util.get('envConfig')
      this.payment = util.get('payment')
      this.params = util.get('params')
      // quick donation!, we don't have precalculated distribution!
      if (!this.params.distribution) {
        const affected = util.get('affected')
        const dist = new Distribution(affected, 1, 100, envConfig.userTypes, envConfig.minDonation)
        const shakemaps = util.get('shakemaps')
        if (shakemaps.features.length > 0) {
          dist.updateShakemap(shakemaps)
          dist.update()
        }
        this.distribution = dist.toFormatted()
      } else {
        this.distribution = this.params.distribution
      }
      for(let user in this.distribution) {
        if(user!=='helperbit') this.users.push(user)
      }
      this.$nextTick( () => componentHandler.upgradeElements(document.querySelectorAll('li')) )
    },
    methods: {
      donate () {
        if (!this.choosen) {
          this.error = 'Please select an user'
          setTimeout( () => this.error = '', 2000)
          return
        }

        if (!this.payment.fiat) {
          util.getDonate('user', this.choosen, this.payment.amountbtc, 'bitcoin', {})
          .then( data => {
            util.set('donate', data)
            this.$router.push('/address')
          })
        } else {
          this.$router.push(`/mistralpay/${this.choosen}`)
        }
      }
    },
    data () {
      return {
        payment: {},
        users: [],
        choosen :null,
        error: ''
      }
    }
  }
</script>
<style>
.error {
  color: red;
  position: absolute;
  right: 130px;
  bottom: 30px;
}
</style>