<template>
  <div class="login">
    <i-form :model="form" :label-width="140" style="padding-right: 80px; max-width: 800px;">
      <Form-item label="uri">
        <i-input v-model="form.uri" placeholder="请求地址"></i-input>
      </Form-item>
      <Form-item label="method">
        <i-input v-model="form.method" placeholder="请求方法" readonly></i-input>
      </Form-item>
      <Form-item label="queryStringParameters">
        <i-input v-model="form.queryStringParameters" :rows="4" placeholder="请求参数(格式xx1=xx1&xx2=xx2,多个使用'&'连接)" type="textarea"></i-input>
      </Form-item>
      <Form-item label="reqestPayload">
        <i-input v-model="form.requestPayload" :rows="10" placeholder="applicaiton/json" type="textarea" ></i-input>
      </Form-item>
      <Form-item>
        <i-button type="primary" :loading="loading" @click.native="invokeRestfulApi2(form.uri, form.method, form.queryStringParameters, form.requestPayload)">执行</i-button >
        &nbsp;
        <i-button type="info" :loading="loading" @click.native="invokeJobList">查询作业列表(状态：错误待执行)</i-button>
        &nbsp;
        <i-button type="info" :loading="loading" @click.native="invokeAllJobList">查询作业列表(所有作业)</i-button>
      </Form-item>
    </i-form>
    <Divider>request/response</Divider>
<pre :key="headersJsonStr + rspStr"><code v-highlight>
// headers 头部认证信息
{{ headersJsonStr }} 

// request 请求信息
{{ reqStr }} 

// response 请求返回值
{{ rspStr }} 
</code></pre>
    <Divider>Code Preview</Divider>
    <pre v-once><code v-highlight>
    import axios from "axios";

    /**
    * 调用 Restful 接口
    * @param uri 请求相对路径(统一资源标识符)
    * @param method 请求方法
    * @param queryStringParameters 请求参数(查询字符串参数),如xx1=xx1&xx2=xx2,多个使用'&'连接
    * @param requestPayload 请求体(application/json)
    * @return void
    */
    async invokeRestfulApi(uri: string, method: uri, queryStringParameters: stirng, requestPayload: { [key: stirng]: any } = {}) {
      this.loading = true;
      const data = requestPayload;
      const rsp: any = await axios.post(`${uri}?${queryStringParameters}`, data, {
        headers: this.headers
      });
      this.reqStr = JSON.stringify({uri, method, queryStringParameters, requestPayload});
      this.rspStr = JSON.stringify({...rsp, success: undefined});
      this.loading = false;
      if (!rsp.success) return;
      this.$Message.success("调用成功");
    }
    </code></pre>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import axios from "axios";

@Component({storage: { keys: ['form'], namespace: 'login' }})
export default class InvokeRestfulApi extends Vue {
  /** { Authorization: `Bearer ${token}` } */
  @Prop() headers;
  /** */
  form = { uri: "", method: 'post', queryStringParameters: "", requestPayload: "" };
  /** 规则 */
  rules = {};

  loading = false;

  reqStr = "";
  rspStr = "";

  get headersJsonStr() {
    return JSON.stringify(this.headers);
  }

  /** */
  invokeRestfulApi2(uri: string, method: string, queryStringParameters: string, requestPayload: string) {
    const json = JSON.parse(requestPayload);
    return this.invokeRestfulApi(uri, method, queryStringParameters, json);
  }

  invokeJobList() {
    const uri = '/ana/jobtotal';
    const method = 'post';
    const queryStringParameters = "appid=&tcctype=&tccid=&modulname=&runStates=20,25&jobTypes=&runAgent=&lock=&disable=&svrnodeName=svrnode";
    const requestPayload = JSON.stringify({"pageIndex":1,"pageSize":20,"sortField":"","asc":true});
    this.invokeRestfulApi2(uri, method, queryStringParameters, requestPayload);
  }

  invokeAllJobList() {
    const uri = '/ana/jobtotal';
    const method = 'post';
    const queryStringParameters = "appid=&tcctype=&tccid=&modulname=&runStates=&jobTypes=&runAgent=&lock=&disable=&svrnodeName=svrnode";
    const requestPayload = JSON.stringify({"pageIndex":1,"pageSize":20,"sortField":"","asc":true});
    this.invokeRestfulApi2(uri, method, queryStringParameters, requestPayload);
  }

  /**
   * 调用 Restful 接口
   * @param uri 请求相对路径(统一资源标识符)
   * @param method 请求方法
   * @param queryStringParameters 请求参数(查询字符串参数),如xx1=xx1&xx2=xx2,多个使用'&'连接
   * @param requestPayload 请求体(application/json)
   * @return void
   */
  async invokeRestfulApi(uri: string, method: string, queryStringParameters: string, requestPayload: { [key: string]: any } = {}) {
    this.loading = true;
    const data = requestPayload;
    const rsp: any = await axios.post(`${uri}?${queryStringParameters}`, data, {
      headers: this.headers
    });
    this.reqStr = JSON.stringify({uri, method, queryStringParameters, requestPayload});
    this.rspStr = JSON.stringify({...rsp, success: undefined});
    this.loading = false;
    if (!rsp.success) return;
    this.$Message.success("调用成功");
  }
}
</script>
