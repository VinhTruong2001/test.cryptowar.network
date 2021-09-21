import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import VTooltip from 'v-tooltip';
import BootstrapVue from 'bootstrap-vue';
import { BootstrapVueIcons } from 'bootstrap-vue';
import BootstrapVueDialog from 'bootstrap-vue-dialog';
const SweetModal = require('sweet-modal-vue');

import VueI18n from 'vue-i18n'

import Web3 from 'web3';

import { createStore } from './store';
import createRouter from './router';

import App from './App.vue';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import vnMessage from './lang/vi.json';
import enMessage from './lang/en.json';
import krMessage from './lang/kr.json';

import {
  raid as featureFlagRaid,
  stakeOnly as featureFlagStakeOnly,
  reforging as featureFlagReforging
} from './feature-flags';

let expectedNetworkId: number | null = null;
if (process.env.VUE_APP_EXPECTED_NETWORK_ID) {
  expectedNetworkId = parseInt(process.env.VUE_APP_EXPECTED_NETWORK_ID, 10);
}
const expectedNetworkName = process.env.VUE_APP_EXPECTED_NETWORK_NAME;

const web3 = new Web3(Web3.givenProvider || process.env.VUE_APP_WEB3_FALLBACK_PROVIDER);

Vue.config.productionTip = false;

Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(VTooltip);
Vue.use(BootstrapVue);
Vue.use(BootstrapVueDialog);

Vue.use(BootstrapVueIcons);
Vue.use(VueI18n);
Vue.use(SweetModal);

const store = createStore(web3);
const router = createRouter();

const messages = {
  vi: vnMessage,
  en: enMessage,
  kr: krMessage
}

const i18n = new VueI18n({
  locale: 'en', // set locale
  messages,
  fallbackLocale: 'en',
})

router.beforeEach((to, from, next) => {
  const hasLang = to.params && to.params.lang;
  const hadLang = from.params && from.params.lang;

  // If the language hasn't changed since last route we're done
  if (hasLang && hadLang && from.params.lang.toLowerCase() === to.params.lang.toLowerCase()) {
    next();
  }

  // Get the save language if it exists
  // let lang = localStorage.getItem('lang_elastic') ? localStorage.getItem('lang_elastic').toLowerCase() : 'en';
  let lang = localStorage.lang ? localStorage.lang.toLowerCase() : 'en';

  // Overwrite the language with the route if there is one
  if (hasLang) {
    lang = to.params.lang.toLowerCase();
  }

  // Make sure the language is valid
  if (!['vi', 'kr'].includes(lang)) {
    lang = 'en';
  }

  // Set the website language based on the URL
  i18n.locale = lang;
  localStorage.lang = lang;

  // Redirect to a url with the language
  if (!hasLang) {
    if (lang !== 'en') return next(`/${lang}${to.fullPath}`);
    else return next();
  }

  return next();
});

new Vue({
  render: h => h(App),
  router, store, i18n,
  provide: {
    web3,
    // maybe feature flags should just reference the feature-flags.ts module directly?
    featureFlagStakeOnly, featureFlagRaid, featureFlagReforging,
    expectedNetworkId, expectedNetworkName
  }
}).$mount('#app');
