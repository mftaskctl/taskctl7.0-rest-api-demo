<template>
  <div class="app">
    <div class="forkme">
      <a href="https://gitee.com/mftaskctl/taskctl7.0-rest-api-demo">Fork me on Gitee</a>
    </div>
    <Menu mode="horizontal" theme="primary">
      <Menu-item name="title">
        <h3>TASKCTL 业界领先ETL批量调度专家（7.0 rest-api demo）</h3>
      </Menu-item>
    </Menu>
    <Collapse v-model="activeKeys">
      <Panel name="config">
        <span>Cors Request baseURL</span>
        <i-form slot="content" :label-width="80" inline>
          <Form-item label="baseURL">
            <i-input v-model="baseURL" placeholder="http://xxxx:8099" style="width: 200px;"></i-input>
          </Form-item>
         </i-form>
      </Panel>
      <Panel name="login">
        <span>1.用户登录 | POST /user/login</span>
        <Login slot="content" v-model="headers" />
      </Panel>
      <Panel key="ctlstart">
        <span>2.启动容器 | POST /tcc/start</span>
        <TccStart slot="content" :headers="headers"/>
      </Panel>
      <Panel key="ctljobstart">
        <span>3.运行作业 | POST /job/doit</span>
        <TccJobStart slot="content" :headers="headers"/>
      </Panel>
    </Collapse>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import vuejsStorage from "vuejs-storage";
import axios from "axios";
import { Message } from "iview";
import Login from "./components/Login.vue";
import TccStart from "./components/TccStart.vue";
import TccJobStart from "./components/TccJobStart.vue";


axios.interceptors.response.use(
  ({ data: res }) => {
    res.success = res.code === 0;
    if (!res.success) {
      const message = typeof res.data == "string" ? res.data : res.message;
      Message.error(message || res.message || "操作失败");
    }
    return res;
  },
  error => {
    Message.error(error.message || error || "操作失误");
    return {
      success: false,
      message: error.message,
      error
    };
  }
);

// axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://127.0.0.1:8099";
@Component({ 
  components: { Login, TccStart, TccJobStart }, 
  storage: { keys: ['headers', "baseURL"], namespace: 'app', driver: vuejsStorage.drivers.sessionStorage
 } })
export default class App extends Vue {
  /**  */
  activeKeys = ["login", "ctlstart"];
  /** 头部信息 */
  headers = {};
  /** baseURL */
  baseURL = "";

  @Watch("baseURL", { immediate: true }) onWatchBaseURL() {
    axios.defaults.withCredentials = this.baseURL.length == 0;
    axios.defaults.baseURL = this.baseURL;
  }

  created() {
    if (process.env.NODE_ENV == 'production') {
      axios.defaults.withCredentials = false;
      if (!this.baseURL) this.baseURL = "http://192.168.0.199:8099";
      return 
    }
  }
}
</script>

<style>
.app {
  position: relative;
}
.forkme { 
  position: absolute;
  top: 0;
  right: 0;
  z-index: 999;
  line-height: 60px;
  padding: 0 20px;
}
.forkme a {
  color: #fff!important;
  font-size: 16px;
}
</style>
