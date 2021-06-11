<template lang='pug'>
div
	.mdl-card.mdl-shadow--2dp
		img#avatar(v-show="username",:src="avatar",:title='avatar_tooltip')
		.mdl-card__title(:class="{'loaded': loaded}",:style="{ backgroundImage: 'url(' + this.media + ')'}")
			h2.mdl-card__title-text {{title}}

			#received(v-show="params.restype !== 'event'") {{received.toFixed(4)}}<i class='cc BTC-alt'></i> &nbsp;{{$t('received')}}
		#progress.mdl-progress.mdl-js-progress(v-show="params.restype === 'project'")

		#container.mdl-card__supporting-text
			.spinner(v-show="!loaded")
				.mdl-spinner.mdl-js-spinner(:class="{'is-active': !loaded}")
			transition(name="slide",v-on:enter="enter",v-on:after-enter="enter")
				keep-alive(include="amount")
					router-view(class="view")

		.mdl-card__menu
			button.mdl-button.mdl-button--icon.mdl-js-button.mdl-js-ripple-effect(@click='back',v-show='showback')
				i.fa.fa-arrow-left
			button.mdl-button.mdl-button--icon.mdl-js-button.mdl-js-ripple-effect(@click='close')
				i.fa.fa-close
	<div align="center" class="by"><span>{{$t('Powered by')}}</span> <a target="_blank" href="https://helperbit.com">helperbit.com</a></div>
</template>

<script>
import util from "util";
import countries from "../../../assets/data/country.json";

export default {
  mounted() {
    this.params = util.initialize();

    setInterval(this.checkLogged, 10000);
    util
      .getResourceInfo(this.params.restype, this.params.resid)
      .then(this.infoComplete)
      .catch(this.error);
  },
  watch: {
    // TODO could be better
    $route(to, from) {
      this.showback = to.path !== "/amount";
    }
  },
  methods: {
    enter(el) {
      componentHandler.upgradeDom();
      if (el.clientHeight)
        document.getElementById("container").style.minHeight =
          el.clientHeight + "px";
    },
    back() {
      this.$router.go(-1);
    },
    getAmount() {
      return this.params.am;
    },
    close() {
      parent.postMessage("close", this.params.host);
    },
    error(e) {
      console.error("Error: ", e);
      this.title = "ERROR";
      this.loaded = true;
      this.$router.replace(
        "/error/Helperbit platform is unreachable, please try again later."
      );
    },
    checkLogged() {
      return util
        .getUser()
        .then(user => {
          const logged = util.get("logged");
          if (logged) return;
          const envConfig = util.get("envConfig");
          util.set("logged", true);
          util.set("username", user.username);
          this.username = user.username;
          this.avatar = `${envConfig.apiUrl}/user/${user.username}/avatar`;
          this.avatar_tooltip = `Logged in as ${this.username}`;
          return util.getWallets();
        })
        .catch(() => {
          util.set("logged", false);
          this.username = "";
          this.avatar = "";
          this.avatar_tooltip = "";
          util.set("wallets", []);
        })
        .then(wallets => {
          if (wallets) util.set("wallets", wallets);
        });
    },
    infoComplete(data) {
      let envConfig = util.get("envConfig");
      util.set("resource_info", data);

      if (this.params.restype === "user") {
        this.title = data.fullname;
        util.set("nponame", this.title);
        this.media = `${envConfig.apiUrl}/media/${data.avatar}`;
        this.received = data.received;
      } else if (this.params.restype === "project") {
        // project
        this.title = data.title[util.getLang()]
          ? data.title[util.getLang()]
          : data.title.en;
        util.set("nponame", this.title);
        if (data.media.length)
          this.media = `${envConfig.apiUrl}/media/${data.media[0]}`;
      } else if (this.params.restype === "event") {
        const affectedCountries = data.affectedcountries
          .map(c => countries[c])
          .join(", ");
        this.title = `${data.type} in ${affectedCountries}`;
        util.set("nponame", affectedCountries);
      }

      util
        .getInfo()
        .then(info => {
          util.set("info", info);

          if (this.params.restype === "project") {
            let targbtc =
              data.target / info.prices[data.currency.toLowerCase()];
            let usedbtc = data.used / info.prices[data.currency.toLowerCase()];
            this.received = data.received;
            this.target = targbtc;
            this.percentage = (100.0 * (data.pending + usedbtc)) / targbtc;
            document
              .querySelector("#progress")
              .MaterialProgress.setProgress(this.percentage);
          } else if (
            this.params.restype === "event" &&
            !this.params.distribution
          ) {
            // save shakemaps
            const sm = { type: "FeatureCollection", features: [] };
            let maxMagnitudeShakemap = false;
            data.shakemaps.forEach(sm => {
              if (
                !maxMagnitudeShakemap ||
                sm.properties.magnitude >
                  maxMagnitudeShakemap.properties.magnitude
              )
                maxMagnitudeShakemap = sm;
            });
            sm.features = [maxMagnitudeShakemap];
            util.set("shakemaps", sm);
            // get affected users
            return util.getAffected(this.params.resid);
          }
        })
        .then(affected => {
          if (affected) {
            util.set("affected", affected);
          }
          return this.checkLogged();
        })
        .then(() => {
          this.$router.replace("/amount", () =>
            setTimeout(() => (this.loaded = true), 200)
          );
        });
    }
  },
  data() {
    return {
      showback: false,
      title: "",
      media: "",
      target: 0,
      received: 0,
      percentage: 0.0,
      loaded: false,
      avatar: "",
      avatar_tooltip: "",
      username: false,
      params: { description: "" }
    };
  }
};
</script>

<style>
#avatar {
  border-radius: 50%;
  position: absolute;
  left: 16px;
  top: 16px;
  height: 4em;
  width: 4em;
}

/*
	TO FIX:
	customizing mdl style has to be done like this:
	https://github.com/google/material-design-lite/wiki/Customizing#customizing
	https://github.com/google/material-design-lite/wiki/Customizing-Colors
*/
.mdl-card {
  margin: auto auto;
  transition: all 1s;
  max-height: 600px;
}

.mdl-textfield--floating-label.is-focused .mdl-textfield__label,
.mdl-textfield--floating-label.is-dirty .mdl-textfield__label,
.mdl-textfield--floating-label.has-placeholder .mdl-textfield__label {
  color: black;
}

#progress {
  height: 12px;
}

#progress > .progressbar {
  background-color: #d01f2f;
}

.mdl-button--raised.mdl-button--colored {
  transition: background-color 0.5s;
  background-color: #feb737;
  color: black;
}

.mdl-button--raised.mdl-button--colored:hover {
  background-color: #fe8b37;
}

.view {
  top: 0px;
  left: 0px;
  padding: 16px;
  width: 100%;
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
  box-sizing: border-box;
  overflow: hidden;
  /*max-height: 600px;*/
}

.slide-leave-active,
.slide-enter {
  position: absolute;
  top: 0px;
  opacity: 0;
  transform: translateX(36px);
}

#container {
  transition-property: height, min-height;
  transition-duration: 0.5s;
  transition-timing-function: cubic-bezier(0.55, 0, 0.1, 1);
  position: relative;
  box-sizing: border-box;
  padding: 0px;
  min-height: 20px;
  width: 100%;
  overflow: hidden;
}

.spinner {
  text-align: center;
  padding: 16px;
}

.mdl-card {
  top: 50px;
  width: 470px;
}

.mdl-card__title {
  color: white;
  min-height: 176px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100%;
  z-index: -1;
  flex-direction: column;
  flex-grow: 5 1;
  justify-content: flex-end;
  padding: 4px 3px 0px 13px;
}

.mdl-card__title h2 {
  align-self: flex-start;
  font-family: "GoBold Regular";
  z-index: 1;
  word-break: break-all;
}

.mdl-card__title.loaded:after {
  opacity: 0.7;
}

.mdl-card__title:after {
  transition-property: opacity;
  transition-duration: 0.5s;
  transition-delay: 0.2s;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 176px;
  content: "";
  background: orange;
  opacity: 1;
}

@media (max-width: 600px) {
  .mdl-card {
    width: 97%;
  }
}

@media (max-height: 600px) {
  .mdl-card {
    top: 0px;
  }

  .mdl-card__title,
  .mdl-card__title:after {
    height: 100px;
    min-height: 100px;
  }

  #container {
    max-height: 300px;
  }
}

#received {
  display: flex;
  align-self: flex-end;
  z-index: 1;
}

a {
  color: #fe8b37;
}

/* remove dotted outline border on Firefox */
a:focus,
a:active,
button:focus,
input:focus {
  outline: none;
}

button::-moz-focus-inner,
input[type="button"]::-moz-focus-inner,
input[type="submit"]::-moz-focus-inner {
  border: 0;
}
</style>