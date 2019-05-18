<template>
  <div class="dashboard-container">
    <!-- <div class="dashboard-title">UserInfo:</div>
    <div class="dashboard-text">name:{{ name }}{{userInfo.name.value}}</div>
    <div class="dashboard-text">Email:{{email}} </div>
    <div class="dashboard-text">Phone:{{phone}}</div>
    <div class="dashboard-text">roles:<span v-for="role in roles" :key="role">{{ role }}</span></div> -->
    <p class="dashboard-title">Account Information</p>
    <el-form  :model="userInfo" class="demo-form-inline">
      <el-form-item label="Name :">
      {{cusInfo.nick_name}}
      </el-form-item>
      <el-form-item label="Email :" >
      {{cusInfo.email}}
      </el-form-item>
      <el-form-item label="phone :" >
      +{{cusInfo.phone}}
      </el-form-item>
      <p class="dashboard-title">Company Information</p>
      <el-form-item label="Company Name :"   >
      {{cusInfo.company}}
      </el-form-item>
      <el-form-item label="Registration Country :"   >
      {{cusInfo.registration | registration}}
      </el-form-item>
      <el-form-item label="Company Code :"  >
      {{cusInfo.company_code}}
      </el-form-item>
      <el-form-item label="Business Industry :"   >
      {{cusInfo.industry | industry}}
      </el-form-item>
      <el-form-item label="Company Size(employees) :"   >
      {{cusInfo.company_size | companysize}}
      </el-form-item>
      <el-form-item label="Telephone :"   >
      +{{cusInfo.telephone}}
      </el-form-item>
      <el-form-item label="Contact Person :"   >
      {{cusInfo.contact_name}}
      </el-form-item>
      <el-form-item label="Address :"   >
      {{cusInfo.address}}
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters, Store } from 'vuex'
import store from '@/store'
import { updata } from "@/api/updata"
import { getUserCusInfo } from "@/api/login"
export default {
  name: 'Dashboard',
  data(){
    return{
      userInfo:{
      },
      cusInfo:{

      },
    }
  },
  created(){
    this.getcusinfo();
  },
  computed: {
    ...mapGetters([
      'name',
      'roles',
      'email',
      'phone'
    ])
  },
  methods: {
      change(value) {
        this.userInfo[value].status=1;
      },
      submit(name){
        const data ={}
        data[name]=this.userInfo[name].value
        const value = name.toUpperCase()
        updata(data).then(Response => {
            store.commit('SET_'+value, this.userInfo[name].value)
            this.userInfo[name].status=0
        });
      },
      cancle(value) { 
        this.userInfo[value].status=0;
      },
      getcusinfo(){
          const data = { custId : this.$route.query.custId }
          getUserCusInfo(data).then(Response => {
                if(Response.data.code === 0){
                  this.cusInfo = Response.data.data.userVsCust
                }else{
                  this.$message.error(Response.data.msg);
                }
            });
        // getCusInfo(data).then(Response => {
        //         this.cusInfo = Response.data
        //     });
      }
    },
    filters:{
      characters:function(value){
        const allcharacter= {
        1:'Admin',
        2:'Operator Admin',
        3:'Operator',
        4:'Customer'
      }
        return allcharacter[value]
      },
      registration:function(value){
        const allregistration= {
        1:'Japan',
        2:'China'
      }
        return allregistration[value]
      },
      industry:function(value){
        const allindustry= {
        1:'Computer/Internet/Communication/Electronics',
        2:'Accounting/Finance/Banking/Insurance',
        3:'Trade/Consumption/Manufacturing/Operation',
        4:'Pharmaceutical/Medical',
        5:'Advertising/Media',
        6:'Real estate/Construction',
        7:'Professional Services/Education/Training',
        8:'Service Industry',
        9:'Logistics/Transportation',
        10:'Energy/Raw Materials',
        11:'Government/n-profit Organization/Others',
      }
        return allindustry[value]
      },
      companysize:function(value){
        const allcompanysize= {
        1:'<500',
        2:'500-1000',
        3:'1000-5000',
        4:'>5000'
      }
        return allcompanysize[value]
      }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin-left: 50px;  
    overflow :auto;
    // border: 1px solid #f00;
  }
  &-title {
    font-size: 25px;
    line-height: 30px;
  }
  .demo-form-inline{
    .el-form-item{
      margin-left: 30px;
    }
  }
}
</style>
