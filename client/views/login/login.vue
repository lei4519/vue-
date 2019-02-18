<template>
  <form class="login-form" @submit="doSubmit">
    <h1>
      <span>Login</span>
      <span class="error-msg" v-show="errorMsg">{{ errorMsg }}</span>
    </h1>
    <input
      type="text"
      class="login-input"
      v-model.trim="username"
      autocomplete="off"
      placeholder="User Name"
    >
    <input
      type="password"
      class="login-input"
      autocomplete="off"
      v-model.trim="password"
      placeholder="PassWord"
    >
    <button type="submit" class="login-btn">登陆</button>
  </form>
</template>

<script>
import axios from 'axios'
import { mapActions } from 'vuex';
export default {
  metaInfo: {
    title: 'Logo Page'
  },
  data() {
    return {
      username: 'admin',
      password: 'admin',
      errorMsg: ''
    }
  },
  methods: {
    ...mapActions(['login']),
    doSubmit(e) {
      e.preventDefault()
      if (this.validate()) {
        this.login({
          username: this.username,
          password: this.password
        })
          .then(() => {
            this.$router.replace('/')
          })
          .catch(err => {
            this.$notify({
              content: err.message
            })
          })
      }
    },
    validate() {
      if (!this.username) {
        this.errorMsg = 'username is required'
        return false
      }
      if (!this.password) {
        this.errorMsg = 'password is required'
        return false
      }
      this.errorMsg = ''
      return true
    }
  }
}
</script>

<style lang="scss" scoped>
.login-form {
  width: 450px;
  margin: 200px auto;
  box-shadow: 0 0 5px #666;
  background-color: rgba(255, 255, 255, 0.3);
  padding: 15px 30px;
  h1 {
    margin: 0 0 10px 0;
    .error-msg {
      color: #f40;
      font-size: 16px;
      font-weight: normal;
    }
  }
}
.login-input {
  font-size: 16px;
  width: 100%;
  height: 40px;
  margin: 10px 0;
  background-color: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  box-shadow: 0 0 5px #999;
  padding: 0 15px;
}
.login-btn {
  display: block;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.5);
  border: 0;
  padding: 0;
  line-height: 40px;
  margin: 10px 0 0 0;
}
</style>
