<template>
  <div class="dashboard-container">
    <!-- <div class="dashboard-title">UserInfo:</div>
    <div class="dashboard-text">name:{{ name }}{{userInfo.name.value}}</div>
    <div class="dashboard-text">Email:{{email}} </div>
    <div class="dashboard-text">Phone:{{phone}}</div>
    <div class="dashboard-text">roles:<span v-for="role in roles" :key="role">{{ role }}</span></div>-->
    <p class="dashboard-title">Account Information</p>
    <el-form :inline="true" :model="userInfo" class="demo-form-inline">
      <el-form-item label="Name :" v-if="!userInfo.nickName.status">{{name}}</el-form-item>
      <el-form-item label="Name :" v-else>
        <el-input v-model="userInfo.nickName.value" placeholder="username"></el-input>
        <span class="inputmsg">{{namemsg}}</span>
      </el-form-item>
      <el-form-item>
        <!-- <el-button type="primary" @click="change('nickName')" v-if="!userInfo.nickName.status">修改</el-button> -->
        <svg-icon
          icon-class="edit"
          class="editicon"
          @click="change('nickName')"
          v-if="!userInfo.nickName.status"
        />
        <span v-else>
          <el-button type="primary" @click="submit('nickName')" size="small">Confirm</el-button>
          <el-button @click="cancle('nickName')" size="small">Cancel</el-button>
          <span
            class="namemsg"
          > Allow up to 20 characters, not including special characters other than "_".</span>
        </span>
      </el-form-item>
      <br>
      <el-form-item label="Email :" v-if="!userInfo.email.status">{{email}}</el-form-item>
      <br>
      <el-form-item label="Phone :" v-if="!userInfo.phone.status"><span v-if='phone'>+</span>{{phone}}</el-form-item>
      <el-form-item label="Phone :" class="elphone" v-else>
        <!-- <el-input v-model="userInfo.phone.value" placeholder="phone"></el-input> -->
        <el-col :span="8">
          <el-form-item>
            <el-select v-model="country" placeholder="country">
              <el-option label="+86(China)" value="86"></el-option>
              <el-option label="+81(Japan)" value="81"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="0.5">-&nbsp;&nbsp;</el-col>
        <el-col :span="10">
          <el-form-item>
            <el-input v-model="num" autocomplete="off"></el-input>
            <span class="inputmsg phonemsg">{{phonemsg}}</span>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item>
        <!-- <el-button type="primary" @click="change('phone')" v-if="!userInfo.phone.status">修改</el-button> -->
        <svg-icon
          icon-class="edit"
          class="editicon"
          @click="change('phone')"
          v-if="!userInfo.phone.status"
        />
        <span v-else>
          <el-button type="primary" @click="submit('phone')" size="small">Confirm</el-button>
          <el-button @click="cancle('phone')" size="small">Cancel</el-button>
        </span>
      </el-form-item>
      <br>
      <el-form-item label="Role :" v-if="!userInfo.roles.status">{{roles[0] | characters}}</el-form-item>
      <br>
      <el-form-item label="Access Key :" v-if="!userInfo.roles.status">{{companyinfo.accessKey}}</el-form-item>
      <br>
      <el-form-item label="Secret Key :" v-if="!userInfo.roles.status">{{companyinfo.secret}}</el-form-item>
      <el-form-item>
        <el-button type="primary" @click="reset()" v-if="!opeid" size="small">Reset</el-button>
        <span class="msg">{{msg}}</span>
      </el-form-item>
      <br>
      <p class="dashboard-title">Company Information</p>
      <el-form-item label="Company Name :" v-if="!userInfo.roles.status">{{companyinfo.name}}</el-form-item>
      <br>
      <el-form-item
        label="Registration Country :"
        v-if="!userInfo.roles.status"
      >{{companyinfo.registration | registration}}</el-form-item>
      <br>
      <el-form-item
        label="Company code :"
        v-if="!userInfo.roles.status"
      >{{companyinfo.companyCode}}</el-form-item>
      <br>
      <el-form-item
        label="Business Industry :"
        v-if="!userInfo.roles.status"
      >{{companyinfo.industry | industry}}</el-form-item>
      <br>
      <el-form-item
        label="Company Size(employees) :"
        v-if="!userInfo.roles.status"
      >{{companyinfo.companySize | companysize}}</el-form-item>
      <br>
      <el-form-item
        label="Telephone :"
        v-if="!userInfo.roles.status"
      >{{companyinfo.telephone}}</el-form-item>
      <br>
      <el-form-item
        label="Contact Person :"
        v-if="!userInfo.roles.status"
      >{{companyinfo.contactName}}</el-form-item>
      <br>
      <el-form-item label="Address :" v-if="!userInfo.roles.status">{{companyinfo.address}}</el-form-item>
    </el-form>
    <div class="time" v-show="0">{{time}}</div>
    <!-- <span class="show-pwd" @click="showPwd('pwdtype')">
            <svg-icon :icon-class="pwdtype === 'password' ? 'eye' : 'eye-open'"/>
    </span> -->
  </div>
</template>

<script>
import { mapGetters, Store } from "vuex";
import store from "@/store";
import { updata } from "@/api/updata";
import { getCusInfo } from "@/api/login";
import { reset } from "@/api/reset";
import { getOpeID } from '@/utils/auth'
export default {
  name: "Dashboard",
  data() {
    return {
       opeid : getOpeID(),
      pwdtype:'password',
      userInfo: {
        nickName: {
          status: 0,
          value: ""
        },
        roles: {
          status: 0
        },
        email: {
          status: 0
        },
        phone: {
          status: 0,
          value: ""
        }
      },
      cusInfo: {},
      msg: "",
      country: null,
      num: "",
      namemsg: "",
      phonemsg: "",
    };
  },
  created() {},
  computed: {
    ...mapGetters(["name", "roles", "email", "phone", "companyinfo"]),
    time() {
      return new Date();
    }
  },
  methods: {
    change(value) {
      if (value === "nickName") {
        this.userInfo[value].value = store.getters.name;
      } else {
        if(store.getters.phone){
          const arr = store.getters.phone.split("-");
          this.num = arr[1];
          this.country = arr[0];
        }else{
          this.num = ''
          this.country = '81'
        }
      }
      this.userInfo[value].status = 1;
    },
    submit(name) {
      if (name === "phone") {
        if (!/^\d{11}$/.test(this.num)) {
          return (this.phonemsg = "Please enter a correct phone number!");
        } else {
          this.userInfo[name].value = this.country + "-" + this.num;
        }
      }
      if (name === "nickName") {
        if (
          !/^[\u4E00-\u9FA5A-Za-z0-9_]{1,20}$/.test(this.userInfo[name].value)
        ) {
          return (this.namemsg = "Please enter a correct name!");
        }
      }
      if (this.userInfo[name].value) {
        const data = {};
        data[name] = this.userInfo[name].value;
        const value = name.toUpperCase();
        updata(data).then(Response => {
              if(Response.data===''){
                this.namemsg = ''
                this.phonemsg = ''
                store.commit('SET_'+value, this.userInfo[name].value)
                this.userInfo[name].status=0
              }else{
                this.$message.error(Response.data.msg);
              }
          });
      } else {
        this.$message.error("Please enter the correct " + name);
      }
    },
    cancle(value) {
      this.namemsg = "";
      this.phonemsg = "";
      this.userInfo[value].status = 0;
    },
    reset() {
      this.$confirm(
        "After the secret key is reset, the system service is called to be reconfigured, and the tasks being executed shall all be stopped. Confirm to reset the key?",
        "Information",
        {
          confirmButtonText: "Yes",
          cancelButtonText: "No",
          type: "warning"
        }
      )
        .then(() => {
          this.$prompt("Please enter your password:", "Information", {
            // dangerouslyUseHTMLString: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            inputType: this.pwdtype,
            ref:'aaa',
            inputPattern: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\W_!@#$%^&*`~()-+=]+$)(?![0-9\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\W_!@#$%^&*`~()-+=]{8,}$/,
            inputErrorMessage: 'Please enter the correct password!',
          })
            .then(({ value }) => {
              const data = {};
              // data.userId = store.getters.id;
              // data.custId = store.getters.companyinfo.custId;
              data.password = value;
              reset(data).then(Response => {
                if (Response.data.code === 0) {
                  this.msg =
                    "A verification email has been sent. Please click on the link in the email to complete the email verification.";
                } else {
                  this.$message({
                    type: "error",
                    message: Response.data.msg
                  });
                }
              });
            })
            .catch(() => {
              // this.$message({
              //   type: "info",
              //   message: "Cancel Input"
              // });
            });
        })
        .catch(() => {
          // this.$message({
          //   type: "info",
          //   message: "Cancel Reset"
          // });
        });
    },
    showPwd(inputname) {
      if (this.pwdtype === "password") {
        this.pwdtype = "text";
      } else {
        this.pwdtype = "password";
      }
    }
  },
  filters: {
    characters: function(value) {
      const allcharacter = {
        1: "Admin",
        2: "Operator Admin",
        3: "Operator",
        4: "Customer"
      };
      return allcharacter[value];
    },
    registration: function(value) {
      const allregistration = {
        1: "Japan",
        2: "China"
      };
      return allregistration[value];
    },
    industry: function(value) {
      const allindustry = {
        1: "Computer/Internet/Communication/Electronics",
        2: "Accounting/Finance/Banking/Insurance",
        3: "Trade/Consumption/Manufacturing/Operation",
        4: "Pharmaceutical/Medical",
        5: "Advertising/Media",
        6: "Real estate/Construction",
        7: "Professional Services/Education/Training",
        8: "Service Industry",
        9: "Logistics/Transportation",
        10: "Energy/Raw Materials",
        11: "Government/n-profit Organization/Others"
      };
      return allindustry[value];
    },
    companysize: function(value) {
      const allcompanysize = {
        1: "<500",
        2: "500-1000",
        3: "1000-5000",
        4: ">5000"
      };
      return allcompanysize[value];
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
    // border: 1px solid #f00;
  }
  &-title {
    font-size: 25px;
    line-height: 30px;
  }
  .demo-form-inline {
    .el-form-item {
      margin-left: 30px;
    }
  }
}
.msg {
  color: #f00;
}
.editicon {
  width: 30px;
  height: 40px;
  position: absolute;
  color: #409eff;
}
.elphone {
  margin-right: -100px;
}
.namemsg {
  color: #a69999;
  font-size: 12px;
  width: 300px;
  height: 25px;
  display: inline-block;
  line-height: 12px;
  padding-top: 3px;
  vertical-align: -4px;
}
.inputmsg {
  height: 15px;
  line-height: 15px;
  padding-left: 5px;
  font-size: 12px;
  position: absolute;
  top: 43px;
  left: 0;
  color: #f00;
}
.phonemsg {
  width: 200px;
}
.pwdmsg{
  color: #f00;
  position:absolute;
  top: 0;
}
//  .show-pwd {
//     position: absolute;
//     right: 41%;
//     top: 40.6%;
//     font-size: 16px;
//     color: gray;
//     cursor: pointer;
//     user-select: none;
//     z-index: 10000;
//   }
</style>
