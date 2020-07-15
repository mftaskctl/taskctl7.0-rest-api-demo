<template>
  <div class="login">
    <i-form :model="form" :label-width="80" inline>
      <Form-item label="appid">
        <i-input v-model="form.appid" placeholder="工程编号"></i-input>
      </Form-item>
      <Form-item label="tccid">
        <i-input v-model="form.tccid" placeholder="容器编号"></i-input>
      </Form-item>
      <Form-item label="jobname">
        <i-input v-model="form.jobname" placeholder="作业名称"></i-input>
      </Form-item>
      <Form-item>
        <i-button type="primary" :loading="loading" @click.native="tccJobStart(form.appid, form.tccid, form.jobname)" >运行作业</i-button >
      </Form-item>
    </i-form>
    <Divider>request/response</Divider>
<pre :key="headersJsonStr + rspStr">
<code v-highlight>
// headers 头部认证信息
{{ headersJsonStr }} 

// response 请求返回值
{{ rspStr }} 
</code>
</pre>
    <Divider>Code Preview</Divider>
    <pre v-once><code v-highlight>
    import axios from "axios";
    import qs from "qs";

    /**
    * 运行作业(容器必须已启动)
    * @param appid 工程编号
    * @param tccid 容器编号
    * @param jobname 作业名称
    */
    async tccJobStart(appid: string, tccid: string, jobname: string) {
      // application/x-www-form-urlencoded 
      const params = qs.stringify({ appid, tccid, jobname });
      this.loading = true;
      const rsp: any = await axios.post(`/job/doit`, params, {
        headers: this.headers
      });
      this.rspStr = JSON.stringify({...rsp, success: undefined}, null, 2);
      this.loading = false;
      if (!rsp.success) return;
      this.$Message.success("运行成功");
    }
    </code></pre>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import axios from "axios";
import qs from "qs";
// import { Message } from "iview";

@Component({storage: { keys: ['form'], namespace: 'login' }})
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
   * 运行作业(容器必须已启动)
   * @param appid 工程编号
   * @param tccid 容器编号
   * @param jobname 作业名称
   */
  async tccJobStart(appid: string, tccid: string, jobname: string) {
    // application/x-www-form-urlencoded 
    const params = qs.stringify({ appid, tccid, jobname });
    this.loading = true;
    const rsp: any = await axios.post(`/job/doit`, params, {
      headers: this.headers
    });
    this.rspStr = JSON.stringify({...rsp, success: undefined}, null, 2);
    this.loading = false;
    if (!rsp.success) return;
    this.$Message.success("运行成功");
  }
}
</script>
