<template>
  <div class="app">
    <Menu mode="horizontal" theme="primary">
      <Menu-item name="title">
        <h3>TASKCTL 业界领先ETL批量调度专家（7.0 rest-api demo）</h3>
      </Menu-item>
      <div class="forkme">
        <a href="https://gitee.com/mftaskctl/taskctl7.0-rest-api-demo">Fork me on Gitee</a>
      </div>
    </Menu>
    <Collapse v-model="activeKeys" accordion >
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
      <Panel key="restfulapi">
        <span>4.调用 Restful API | POST </span>
        <InvokeRestFulApi slot="content" :headers="headers"/>
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
import InvokeRestFulApi from "./components/InvokeRestFulApi.vue";

// axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://127.0.0.1:8099";
axios.defaults.timeout = 5 * 1000;
@Component({ 
  components: { Login, TccStart, TccJobStart, InvokeRestFulApi }, 
  storage: { keys: ['headers', "baseURL"], namespace: 'app', driver: vuejsStorage.drivers.sessionStorage} 
})
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
    // 处理开发模式，热加载，多次注册拦截器
    axios.interceptors.response['handlers'].splice(0);
    // 拦截器
    axios.interceptors.response.use(
      (...args) => {
        console.warn(args);
        const [{ data: res = {} }] = args;
        res.success = res.code === 0;
        if (!res.success) {
          const message = typeof res.data == "string" ? res.data : res.message;
          // this.$Message.error(message || res.message || "操作失败");
          this.$Notice.error({ title: `请求异常 [${res.code}]`, desc: message || res.message || "操作失败"})
        }
        return res;
      },
      error => {
        if (!error.response) error.response = {};
        if (typeof error.response.status != "number") error.response.status = 504;
        // 未登录
        if (error.response.status == 401) {
          this.$Modal.confirm({
            title: "权限认证",
            content: "用户未登录，请登录！",
            okText: "去登录",
            onOk: () => this.activeKeys = ["login"]
          });
        } else if (error.response.status == 403) {
          this.$Modal.confirm({
            title: "权限认证",
            content: "用户已失效，请重新登录!",
            okText: "去登录",
            onOk: () => this.activeKeys = ["login"]
          });
        } else if (error.response.status == 404) {
          this.$Modal.confirm({
            title: "请求404",
            content: "请检查请求地址uri是否正确？<br>请检查baseUrl配置是否正确？",
            okText: "去配置baseURL",
            onOk: () => this.activeKeys = ["login"]
          });
        } else {
          // this.$Message.error(error.message || error || "操作失误");
           this.$Notice.error({ title: `请求异常 [${error.response.status}]`, desc: error.message || error || "操作失败"})
        }
        return {
          success: false,
          code: error.response.status,
          message: error.message,
          data: error.response.data
        };
      }
    );

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
.ivu-collapse {
  margin: 5px;
  height: calc(100vh - 70px);
  overflow: auto;
}
.ivu-collapse-content {
  max-height: calc(100vh - 70px - 40px * 4);
  overflow: auto;
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
pre > code {
  overflow: hidden;
  word-break: break-all;
  white-space: pre-wrap;
}
</style>
