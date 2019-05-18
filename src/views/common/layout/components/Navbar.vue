<template>
  <div class="navbar">
    <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/>
     <breadcrumb />
    <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        {{company}}
        <svg-icon icon-class="usericon" class="user-avatar"/>{{name}}
        <i class="el-icon-caret-bottom"/>
      </div>
      <el-dropdown-menu slot="dropdown" class="user-dropdown">
        <router-link class="inlineBlock" :to="roleid!=4?'/sysprofile':'/cusprofile'">
          <el-dropdown-item>
            Profile
          </el-dropdown-item>
        </router-link>
        <router-link class="inlineBlock" to="/changepwd" >
          <el-dropdown-item v-if="!opeid">
            Change Password
          </el-dropdown-item>
        </router-link>
        <el-dropdown-item divided>
          <span style="display:block;" @click="logout">Logout <span class="opfont" v-if="opeid">(operator)</span> </span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { getRoleID, getOpeID, removeOpeID, removeSysID } from '@/utils/auth'
export default {
  data(){
    return {
      roleid : getRoleID(),
      opeid : getOpeID()
    }
  },
  created(){
  },
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'name',
      'company',
      'operid'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      if(this.opeid){
        this.$router.push({ path: '/' })
        this.$store.dispatch('OperatorLogOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
          this.$router.push({ path: '/sysuser/list' })
        })
      }else{
        this.$store.dispatch('LogOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
           this.$router.push({ path: '/login' })
        })
      }
    },
    toch(){
      // console.log('this.$router',this.$router)
    }
    // clearlog(){
    //   if(getRoleID()!=4 && getOpeID()){
    //     removeOpeID()
    //     removeSysID()
    //     location.reload()
    //   }
    // }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  box-shadow: 0 1px 3px 0 rgba(0,0,0,.12), 0 0 3px 0 rgba(0,0,0,.04);
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      line-height: initial;
      .user-avatar {
        width: 25px;
        height: 25px;
        border-radius: 10px;
        margin-top: 12px;
        margin-right: 5px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}
.opfont{
  color: #f00;
}
</style>

