<template>
  <view class="container">
    <view class="header">
      <text class="title">Timesheet & Expense</text>
    </view>
    
    <view class="content" v-if="!userInfo">
      <button class="btn" @click="handleLogin">Login with WeChat</button>
    </view>
    
    <view class="content" v-else>
      <text class="welcome">Welcome, {{ userInfo.nickname || 'User' }}</text>
      <text class="role">Role: {{ userInfo.role }}</text>
      
      <view class="menu" v-if="userInfo.role === 'employee'">
        <button class="menu-btn" @click="goTo('/pages/timesheet/add')">Log Hours</button>
        <button class="menu-btn" @click="goTo('/pages/expense/add')">Log Expense</button>
      </view>
      
      <view class="menu" v-if="userInfo.role === 'manager'">
        <button class="menu-btn" @click="goTo('/pages/manager/dashboard')">Manage Approvals</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { login, type UserInfo } from '@/utils/auth'

const userInfo = ref<UserInfo | null>(null)

onMounted(() => {
  userInfo.value = uni.getStorageSync('userInfo')
})

const handleLogin = async () => {
  try {
    const res = await login()
    userInfo.value = res.userInfo
  } catch (err) {
    console.error(err)
  }
}

const goTo = (url) => {
  uni.navigateTo({ url })
}
</script>

<style>
.container {
  padding: 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.header {
  margin-top: 100rpx;
  margin-bottom: 100rpx;
}
.title {
  font-size: 48rpx;
  font-weight: bold;
}
.content {
  width: 100%;
}
.btn {
  background-color: #07c160;
  color: white;
  margin-bottom: 40rpx;
}
.welcome {
  display: block;
  font-size: 36rpx;
  margin-bottom: 20rpx;
  text-align: center;
}
.role {
  display: block;
  font-size: 28rpx;
  color: #666;
  margin-bottom: 60rpx;
  text-align: center;
}
.menu {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}
.menu-btn {
  background-color: #007aff;
  color: white;
}
</style>
