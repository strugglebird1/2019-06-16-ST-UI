<template>
  <div class="app-container">
    <p class="infotitle">Improve account information</p>
    <div class="infobox">
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
          <el-button type='primary' @click="submitForm('ruleForm')" class="setinfobtn">Submit</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { updata } from "@/api/updata";
import { initUser } from "@/api/emailInit";
import { removeToken, removeState, removeRoleID } from "@/utils/auth";
import store from "@/store";
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please enter your password!"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
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
      pwdtype:'password',
      checkpwdtype:'password',
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
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const data = {};
          data.phone = this.ruleForm.areacode + "-" + this.ruleForm.phone;
          data.password = this.ruleForm.pass;
          initUser(data).then(Response => {
            if(Response.data.code === 0){
              this.$message({
                message: "Change succeeded!",
                type: "success"
              });
              this.$store.dispatch("LogOut").then(() => {
                location.reload(); // 为了重新实例化vue-router对象 避免bug
                this.$router.push({ path: "/login" });
              });
            }else{
              this.$message.error(Response.data.msg);
            }
          });
        } else {
          // console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
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
  padding-top: 10%;
  background-color: #eee;
  color: #333;
}
.infotitle {
  text-align: center;
  font-size: 30px;
}
.infobox {
  width: 600px;
  margin: 0 auto;
  color: #fff !important;
  .el-form-item__label {
    color: #fff !important;
  }
  .pwdinput {
    width: 340px;
  }
}
.setinfobtn{
  margin-left: 120px;
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
</style>
