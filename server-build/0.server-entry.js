exports.ids=[0],exports.modules={38:function(n,a,t){var r=t(49);"string"==typeof r&&(r=[[n.i,r,""]]),r.locals&&(n.exports=r.locals);var e=t(3).default;n.exports.__inject__=function(n){e("4f85b284",r,!0,n)}},48:function(n,a,t){"use strict";t.r(a);var r=t(38),e=t.n(r);for(var s in r)"default"!==s&&function(n){t.d(a,n,function(){return r[n]})}(s);a.default=e.a},49:function(n,a,t){(n.exports=t(2)(!1)).push([n.i,".login-form[data-v-4e149a50] {\n  width: 450px;\n  margin: 200px auto;\n  box-shadow: 0 0 5px #666;\n  background-color: rgba(255, 255, 255, 0.3);\n  padding: 15px 30px;\n}\n.login-form h1[data-v-4e149a50] {\n    margin: 0 0 10px 0;\n}\n.login-form h1 .error-msg[data-v-4e149a50] {\n      color: #f40;\n      font-size: 16px;\n      font-weight: normal;\n}\n.login-input[data-v-4e149a50] {\n  font-size: 16px;\n  width: 100%;\n  height: 40px;\n  margin: 10px 0;\n  background-color: rgba(255, 255, 255, 0.5);\n  border: 1px solid rgba(255, 255, 255, 0.3);\n  border-radius: 4px;\n  box-shadow: 0 0 5px #999;\n  padding: 0 15px;\n}\n.login-btn[data-v-4e149a50] {\n  display: block;\n  width: 100%;\n  background-color: rgba(255, 255, 255, 0.5);\n  border: 0;\n  padding: 0;\n  line-height: 40px;\n  margin: 10px 0 0 0;\n}\n",""])},51:function(n,a,t){"use strict";t.r(a);t(14);var r=t(4),e={metaInfo:{title:"Logo Page"},data:()=>({username:"admin",password:"admin",errorMsg:""}),methods:{...Object(r.mapActions)(["login"]),doSubmit(n){n.preventDefault(),this.validate()&&this.login({username:this.username,password:this.password}).then(()=>{this.$router.replace("/")}).catch(n=>{this.$notify({content:n.message})})},validate(){return this.username?this.password?(this.errorMsg="",!0):(this.errorMsg="password is required",!1):(this.errorMsg="username is required",!1)}}},s=t(0);var o=Object(s.a)(e,function(){var n=this,a=n.$createElement;return(n._self._c||a)("form",{staticClass:"login-form",on:{submit:n.doSubmit}},[n._ssrNode('<h1 data-v-4e149a50><span data-v-4e149a50>Login</span> <span class="error-msg"'+n._ssrStyle(null,null,{display:n.errorMsg?"":"none"})+" data-v-4e149a50>"+n._ssrEscape(n._s(n.errorMsg))+'</span></h1> <input type="text" autocomplete="off" placeholder="User Name"'+n._ssrAttr("value",n.username)+' class="login-input" data-v-4e149a50> <input type="password" autocomplete="off" placeholder="PassWord"'+n._ssrAttr("value",n.password)+' class="login-input" data-v-4e149a50> <button type="submit" class="login-btn" data-v-4e149a50>登陆</button>')])},[],!1,function(n){var a=t(48);a.__inject__&&a.__inject__(n)},"4e149a50","656fe358");a.default=o.exports}};
//# sourceMappingURL=0.server-entry.js.map