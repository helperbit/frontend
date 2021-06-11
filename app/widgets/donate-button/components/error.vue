<template lang='pug'>
  div
    div(align='center')
      i.icon.fa(v-if="$route.params.icon",:class="[$route.params.icon]")
      i.icon.fa.fa-exclamation-triangle(v-else)
      br
      br
      span {{$t('Error.')}} {{$t($route.params.error)}}
    br
    div(align='right')
      a.mdl-button.mdl-button--raised.mdl-button--colored.mdl-js-button.mdl-js-ripple-effect(@click="retry",align='right')
        i.fa.fa-refresh  
        span  {{$t('Retry')}}

</template>
<script>
export default {
  name: 'error',
  methods: {
    retry () {
      this.$router.replace('/')
    }
  }
}
</script>
<style>
.icon {
  font-size: 5em;
  color: #d01f2f;
}
</style>