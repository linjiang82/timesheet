<template>
  <view class="container">
    <uni-forms ref="form" :modelValue="formData" :rules="rules">
      <uni-forms-item label="Date" name="date">
        <uni-datetime-picker type="date" v-model="formData.date" />
      </uni-forms-item>
      <uni-forms-item label="Hours" name="hours">
        <uni-easyinput type="number" v-model="formData.hours" placeholder="Enter hours" />
      </uni-forms-item>
      <uni-forms-item label="Description" name="description">
        <uni-easyinput type="textarea" v-model="formData.description" placeholder="What did you work on?" />
      </uni-forms-item>
    </uni-forms>
    <button class="submit-btn" @click="submit">Submit Timesheet</button>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { submitTimesheet, type TimesheetEntry } from '@/utils/timesheet'

const form = ref<any>(null)
const formData = reactive<TimesheetEntry>({
  date: new Date().toISOString().split('T')[0],
  hours: 0,
  description: ''
})

const rules = {
  date: { rules: [{ required: true, errorMessage: 'Date is required' }] },
  hours: { rules: [{ required: true, errorMessage: 'Hours is required' }] },
  description: { rules: [{ required: true, errorMessage: 'Description is required' }] }
}

const submit = async () => {
  try {
    await form.value.validate()
    await submitTimesheet({
      ...formData,
      hours: parseFloat(formData.hours)
    })
    uni.showToast({ title: 'Submitted successfully' })
    setTimeout(() => uni.navigateBack(), 1500)
  } catch (err) {
    console.error(err)
  }
}
</script>

<style>
.container {
  padding: 30rpx;
}
.submit-btn {
  margin-top: 60rpx;
  background-color: #007aff;
  color: white;
}
</style>
