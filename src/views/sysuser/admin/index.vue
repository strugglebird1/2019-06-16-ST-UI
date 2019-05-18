<template>
  <div class="app-container">
    <div class="box">
      <p class="title">Administrator Registration</p>
      <el-steps :active="active" finish-status="success" class="steps">
        <el-step title="Bind Email"></el-step>
        <el-step title="Complete your personal information"></el-step>
        <el-step title="Binding succeeds"></el-step>
      </el-steps>
      <div class="stepbox" v-if="active==0">
        <el-form
          v-if="!success"
          :model="dynamicValidateForm"
          ref="dynamicValidateForm"
          label-width="100px"
          class="demo-dynamic"
        >
          <el-form-item
            prop="email"
            label="Email"
            :rules="[
        { required: true, message: 'Please enter a correct E-mail address', trigger: 'blur' },
        { type: 'email', message: 'Please enter a correct E-mail address', trigger: ['blur'] }
      ]"
          >
            <el-input v-model="dynamicValidateForm.email" class="emailminput"></el-input>
          </el-form-item>
          <el-button type="primary" style="margin-top: 12px;" @click="next('dynamicValidateForm')">next</el-button>
        </el-form>
        <span class="emailsucc" v-if="success">
          <svg-icon icon-class="success"/>The verification email has been sent to your email address. Please click on the link in the email to activate the account.
        </span>
      </div>
      <div class="stepbox" v-if="active==1">
        <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="150px"
          class="demo-ruleForm"
        >
          <el-form-item label="Phone" required>
            <el-col :span="7">
              <el-form-item prop="areacode">
                <el-select v-model="ruleForm.areacode" placeholder="Areacode">
                  <el-option label="+86(China)" value="86"></el-option>
                  <el-option label="+81(Japan)" value="81"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="0.5">-</el-col>
            <el-col :span="11">
              <el-form-item prop="phone">
                <el-input v-model="ruleForm.phone" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="Password" prop="pass" required>
            <el-input :type="pwdtype" v-model="ruleForm.pass" autocomplete="off" class="pwdinput"></el-input>
            <span class="show-pwd" @click="showPwd('pwdtype')">
              <svg-icon :icon-class="pwdtype === 'password' ? 'eye' : 'eye-open'"/>
            </span>
            <span class="passmsg">The password is at least 8 digits and must contain three types of combinations: uppercase letters, lowercase letters, numbers, and special symbols.</span>
          </el-form-item>
          <el-form-item label="Confirm Password" prop="checkPass" required>
            <el-input
              :type="checkpwdtype"
              v-model="ruleForm.checkPass"
              autocomplete="off"
              class="pwdinput"
            ></el-input>
            <span class="show-pwd" @click="showPwd('checkpwdtype')">
              <svg-icon :icon-class="checkpwdtype === 'password' ? 'eye' : 'eye-open'"/>
            </span>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')" class="subbmit">submit</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="stepbox" v-if="active==2">
        <div class="step3">
          <span>
            <svg-icon icon-class="success" class="iconsucc" style="color:'#f00'"/>Successful activation, automatically jump to the login page...
          </span>
          <p class="tologin">If there is no jump after 10 seconds, click the button.
            <el-button size="mini" @click="tologin">Click</el-button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { emailInit, setInfo } from "@/api/emailInit";
import { removeToken, removeState, getRoleID, removeRoleID ,getState} from "@/utils/auth";
import store from "@/store";
import { isPassword } from "@/utils/index";
export default {
  data() {
    var validatePass = (rule, value, callback) => {
     if (value === "") {
        callback(new Error("Please enter your password!"));
      } else if(!isPassword(value)){
        callback(new Error("Please enter the correct password!"));
      }else{
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please enter your password again!"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("Inconsistent passwords. Please re-enter!"));
      } else {
        callback();
      }
    };
    var validatePhone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please enter phone number!"));
      } else if (!/^\d{11}$/.test(value)) {
        callback(new Error("Please enter a correct phone number!"));
      } else {
        callback();
      }
    };
    var ckAreacode = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please select the international area code!"));
      } else {
        callback();
      }
    };
    return {
      active: 0,
      success: 0,
      pwdtype:'password',
      checkpwdtype:'password',
      dynamicValidateForm: {
        email: ""
      },
      ruleForm: {
        pass: "",
        checkPass: "",
        areacode: "86",
        phone: ""
      },
      rules: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
        phone: [{ validator: validatePhone, trigger: "blur" }],
        areacode: [{ validator: ckAreacode, trigger: "blur" }]
      },
      timeout:null,
      code_router:{}
    };
  },
  created() {
    this.status();
  },
  destroyed(){
    clearTimeout(this.timeout)
  },
  methods: {
    next(formName) {
      // if (this.active++ > 2) this.active = 0;
      this.$refs[formName].validate(valid => {
        if (valid) {
          const data = this.dynamicValidateForm;
          if (this.active == 0) {
            emailInit(data).then(Response => {
              if(Response.data.code === 0){
                this.success = 1;
              }else{
                this.$message.error(Response.data.msg);
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const data = {};
          data.code = this.code_route.code;
          data.phone = this.ruleForm.areacode + "-" + this.ruleForm.phone;
          data.password = this.ruleForm.pass;
          setInfo(data).then(Response => {
            if (Response.data.code === 0) {
              this.active = 2;
              this.$message({
                message: "Change succeeded!",
                type: "success"
              });
              removeToken();
              removeState();
              this.timeout =setTimeout(()=>{
                this.$store.dispatch("LogOut").then(() => {
                  // location.reload(); // 为了重新实例化vue-router对象 避免bug
                  this.$router.push({ path: "/login" });
                });
              },1000*10)
            } else {
              this.$message.error(Response.data.msg);
            }
          });
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    status() {
      if(this.$route.query.code_route!==undefined){
        this.code_route = JSON.parse(this.$route.query.code_route)
        this.active = 1;
      }else{
        if(getRoleID()==='1'&&getState()==='1'){
          this.active = 0;
        }else{
          this.$router.push({ path: "/" });
        }
      }
    },
    tologin() {
      removeToken();
      removeState();
      this.$store.dispatch("LogOut").then(() => {
        // location.reload(); // 为了重新实例化vue-router对象 避免bug
        this.$router.push({ path: "/login" });
      });
    },
    showPwd(inputname) {
      if (this[inputname] === "password") {
        this[inputname] = "";
      } else {
        this[inputname] = "password";
      }
    }
  }
};
</script>
<style rel='stylesheet/scss' lang='scss' scoped>
.app-container {
  width: 100%;
  height: 100%;
  background-color: #eee;
}
.box {
  width: 70%;
  margin-left: 50%;
  margin-top: 7%;
  transform: translate(-50%);
  .title {
    font-size: 30px;
    text-align: center;
    padding: 10px;
  }
}
.demo-dynamic {
  width: 40%;
  text-align: center;
  margin-left: 50%;
  transform: translate(-60%)
}
.demo-ruleForm {
  width: 600px;
  margin: 0 auto;
  .pwdinput {
    width: 340px;
  }
}
.steps {
  width: 80%;
  margin: 0 auto;
}
.stepbox {
  width: 90%;
  padding-top: 30px;
  margin: 0 auto;
  .el-input__suffix {
    color: #c0c4cc;
  }
  .forminput {
    width: 98%;
  }
  .tologin {
    font-size: 11px;
    padding-left: 30px;
  }
  .emailminput {
    width: 98%;
  }
}
.step3 {
  margin: 3% 25%;
  width: 100%;
}
.subbmit{
  margin-left: 100px;
}
.passmsg{
  position:absolute;
  width: 300px;
  font-size: 12px;
  line-height: 12px;
  padding-left: 10px;
  color: #999999;
}
 .show-pwd {
    position: absolute;
    right: 135px;
    top: 2px;
    font-size: 16px;
    color: gray;
    cursor: pointer;
    user-select: none;
  }
  .emailsucc{
    margin-left: 150px;
  }
</style>
