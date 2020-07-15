import Vue from "vue";

import ViewUI from "iview";
import "iview/dist/styles/iview.css";
import Highlight from './plugins/highlight'; // from 路径是highlight.js的路径，纯属自定义
Vue.use(Highlight);

import vuejsStorage from "vuejs-storage";
Vue.use(vuejsStorage);
import App from "./App.vue";
Vue.use(ViewUI);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount("#app");
