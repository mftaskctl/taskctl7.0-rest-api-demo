<template>
  <div class="login">
    <i-form :model="form" :rules="rules" inline>
      <Form-item prop="user">
        <i-input type="text" v-model="form.username" placeholder="用户名">
          <Icon type="ios-person-outline" slot="prepend"></Icon>
        </i-input>
      </Form-item>
      <Form-item prop="password">
        <i-input type="password" v-model="form.password" placeholder="密码">
          <Icon type="ios-locked-outline" slot="prepend"></Icon>
        </i-input>
      </Form-item>
      <Form-item>
        <i-button
          type="primary"
          :loading="loading"
          @click.native="login(form.username, form.password)"
          >登录</i-button
        >
      </Form-item>
    </i-form>
    <pre :key="headersJsonStr"><code v-highlight>
      // headers 头部认证信息
      {{ headersJsonStr }} 
    </code></pre>
    <Divider>Code Preview</Divider>
    <pre v-once><code v-highlight>
    import axios from "axios";
    import qs from "qs";
    
    /**
    * 登录
    * @param username 用户名
    * @param password 密码
    * @return 授权头部信息 { Authorization: `Bearer${token}` }
    */
    async login(username: string, password: string) {
      // application/x-www-form-urlencoded 
      const params = qs.stringify({ username, password });
      this.loading = true;
      const rsp: any = await axios.post("/user/login", params, this.headers);
      this.loading = false;
      if (!rsp.success) return;
      this.$Message.success("登录成功");

      const token = rsp.data;
      const headers = { Authorization: `Bearer${token}` };
      // 获取登录令牌，其他登录请携带令牌
      // axios.post('/xxx', params, { headers });
      this.$emit("input", headers);
      return headers;
    }
    </code></pre>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import axios from "axios";
import qs from "qs";
// import { Message } from "iview";

@Component({ model: {prop: 'headers'}, storage: { keys: ['form'], namespace: 'login' } })
export default class Login extends Vue {
  /** { Authorization: `Bearer ${token}` } */
  @Prop() headers;
  /** */
  form = { username: "", password: "" };
  /** 规则 */
  rules = {};

  loading = false;

  get headersJsonStr() {
    return JSON.stringify(this.headers);
  }

  /**
   * 登录
   * @param username 用户名
   * @param password 密码
   * @return 授权头部信息 { Authorization: `Bearer ${token}` }
   */
  async login(username: string, password: string) {
    // application/x-www-form-urlencoded 
    const params = qs.stringify({ username, password });
    this.loading = true;
    const rsp: any = await axios.post("/user/login", params);
    this.loading = false;
    if (!rsp.success) return;
    this.$Message.success("登录成功");

    const token = rsp.data;
    const headers = { Authorization: `Bearer ${token}` };
    // 获取登录令牌，其他登录请携带令牌
    // axios.post('/xxx', params, { headers });
    this.$emit("input", headers);
    return headers;
  }
}
</script>
