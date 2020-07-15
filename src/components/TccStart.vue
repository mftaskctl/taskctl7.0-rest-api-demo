<template>
  <div class="login">
    <i-form :model="form" :label-width="80" inline>
      <Form-item label="appid">
        <i-input v-model="form.appid" placeholder="工程编号"></i-input>
      </Form-item>
      <Form-item label="tccid">
        <i-input v-model="form.tccid" placeholder="容器编号"></i-input>
      </Form-item>
      <Form-item>
        <i-button type="primary" :loading="loading" @click.native="tccStart(form.appid, form.tccid)" >正常模式启动</i-button >
      </Form-item>
    </i-form>
    <Divider>request/response</Divider>
<pre :key="headersJsonStr + rspStr"><code v-highlight>
  // headers 头部认证信息
  {{ headersJsonStr }} 

  // response 请求返回值
  {{ rspStr }} 
</code></pre>
    <Divider>Code Preview</Divider>
    <pre v-once><code v-highlight>
    import axios from "axios";
    import qs from "qs";

    /**
    * 正常模式启动单个容器
    * @param appid 工程编号
    * @param tccid 容器编号
    */
    async tccStart(appid: string, tccid: string) {
      // 运行模式: 0-正常模式, 1-自由模式, 2-虚拟模式
      const runMode = "0";
      // 虚拟运行倍率
      const virrate = 1;
      // application/json - 请求
      const data = { tccidOrName: tccid, runMode, virrate };
      console.log(data);
      this.loading = true;
      const rsp: any = await axios.post(`/tcc/start?appid=${appid}`, data, {
        headers: this.headers
      });
      this.rspStr = JSON.stringify({...rsp, success: undefined}, null, 2);
      this.loading = false;
      if (!rsp.success) return;
      this.$Message.success("启动成功");
    }
    </code></pre>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import axios from "axios";
import qs from "qs";
// import { Message } from "iview";

@Component({ storage: { keys: ['form'], namespace: 'login' }})
export default class CtlStart extends Vue {
  /** { Authorization: `Bearer ${token}` } */
  @Prop() headers;
  /** */
  form = { appid: "", tccid: "" };
  /** 规则 */
  rules = {};

  loading = false;

  rspStr = "";

  get headersJsonStr() {
    return JSON.stringify(this.headers);
  }

  /**
   * 正常模式启动单个容器
   * @param appid 工程编号
   * @param tccid 容器编号
   */
  async tccStart(appid: string, tccid: string) {
    // 运行模式: 0-正常模式, 1-自由模式, 2-虚拟模式
    const runMode = "0";
    // 虚拟运行倍率
    const virrate = 1;
    // application/json - 请求
    const data = { tccidOrName: tccid, runMode, virrate };
    this.loading = true;
    const rsp: any = await axios.post(`/tcc/start?appid=${appid}`, data, {
      headers: this.headers
    });
    this.rspStr = JSON.stringify({...rsp, success: undefined}, null, 2);
    this.loading = false;
    if (!rsp.success) return;
    this.$Message.success("启动成功");
  }
}
</script>
