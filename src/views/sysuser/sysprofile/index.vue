<template>
  <div class="dashboard-container">
    <!-- <div class="dashboard-title">UserInfo:</div>
    <div class="dashboard-text">name:{{ name }}{{userInfo.name.value}}</div>
    <div class="dashboard-text">Email:{{email}} </div>
    <div class="dashboard-text">Phone:{{phone}}</div>
    <div class="dashboard-text">roles:<span v-for="role in roles" :key="role">{{ role }}</span></div> -->
    <el-form :inline="true" :model="userInfo" class="demo-form-inline">
      <el-form-item label="Name :" v-if="!userInfo.nickName.status">
      {{name}}
      </el-form-item>
      <el-form-item label="Name :"  v-else>
        <el-input v-model="userInfo.nickName.value" placeholder="username"></el-input>
        <span class="inputmsg">{{namemsg}}</span>
      </el-form-item>
      <el-form-item>
        <svg-icon icon-class="edit" class='editicon' @click="change('nickName')" v-if="!userInfo.nickName.status"/>
        <span v-else>
              <el-button type="primary" @click="submit('nickName')" size='small'>Confirm</el-button>
              <el-button  @click="cancle('nickName')" size='small'>Cancel</el-button>
              <span class="namemsg">Allow up to 20 characters, not including special characters other than "_".</span>
        </span>
      </el-form-item> <br/>
      <el-form-item label="Email :" v-if="!userInfo.email.status">
       {{email}}
      </el-form-item>
      <el-form-item label="Email" v-else>
        <el-input v-model="email" placeholder="email"></el-input>
      </el-form-item><br/>
      <el-form-item label="Phone :" v-if="!userInfo.phone.status">
       +{{phone}}
      </el-form-item>
      <el-form-item label="Phone :" class="elphone" v-else>
        <!-- <el-input v-model="userInfo.phone.value" placeholder="phone"></el-input> -->
        <el-col :span="8">
              <el-form-item >
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
        <svg-icon icon-class="edit" class='editicon' @click="change('phone')" v-if="!userInfo.phone.status"/>
        <span v-else>
              <el-button type="primary" @click="submit('phone')" size='small'>Confirm</el-button>
              <el-button @click="cancle('phone')" size='small'>Cancel</el-button>
        </span>
      </el-form-item><br/>
      <el-form-item label="Role :" v-if="!userInfo.roles.status">
        {{roles[0] | characters}}
      </el-form-item>
      <el-form-item label="Role" v-else>
        <el-input v-model="roles" placeholder="Role"></el-input>
      </el-form-item> 
    </el-form>
  </div>
</template>

<script>
import { mapGetters, Store } from 'vuex'
import store from '@/store'
import { updata } from "@/api/updata"
export default {
  name: 'Dashboard',
  data(){
    return{
      userInfo:{
        'nickName' : {
           'status': 0,
           'value' : ''
        },
        'roles' : {
           'status': 0
        },
        'email' : {
           'status': 0
        },
        'phone' : {
           'status': 0,
           'value' : 143
        },
      },
      'country' : null,
      'num' :'',
      'namemsg':'',
      'phonemsg':''
    }
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
        // console.log('value',store.getters.name)
        if(value==='nickName'){
          this.userInfo[value].value = store.getters.name
        }else{
          const arr = store.getters.phone.split('-')
          this.num = arr[1]
          this.country = arr[0]
        }
        this.userInfo[value].status=1;
      },
      submit(name){
        // console.log("name", name,"value", this.userInfo[name].value)
        if(name==='phone'){
          if(!/^\d{11}$/.test(this.num)){
             return this.phonemsg='Please enter a correct phone number!';
          }else{
            this.userInfo[name].value =this.country+'-'+this.num
          }
        }
        if(name==='nickName'){
          if(!/^[\u4E00-\u9FA5A-Za-z0-9_]{1,20}$/.test(this.userInfo[name].value)){
             return this.namemsg='Please enter a correct name!';
          }
        }
        if(this.userInfo[name].value){
          const data ={}
          data[name]=this.userInfo[name].value
          const value = name.toUpperCase()
          // console.log('data',data)
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
        }else{
           this.$message.error('Please enter a correct '+name);
        }
      },
      cancle(value) { 
        this.namemsg = ''
        this.phonemsg = ''
        this.userInfo[value].status=0;
      }
    },
    filters:{
      characters:function(value){
        // console.log(value)
        const allcharacter= {
        1:'Admin',
        2:'Operator Admin',
        3:'Operator',
        4:'Customer'
      }
        return allcharacter[value]
      }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-title {
    font-size: 35px;
    line-height: 46px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.editicon{
  width: 25px;
  height: 35px;
  position:absolute;
  color: #409EFF;
}
.demo-form-inline .elphone{
  margin-right: -100px;
}
.namemsg{
  color: #A69999;
  font-size: 12px;
  width: 300px;
  height: 25px;
  position: relative;
  top: 5px;
  display: inline-block;
  line-height: 13px;
  padding-left:5px; 
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
.phonemsg{
  width: 200px;
}
</style>
