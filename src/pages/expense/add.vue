<template>
  <view class="container">
    <uni-forms ref="form" :modelValue="formData" :rules="rules">
      <uni-forms-item label="Date" name="date">
        <uni-datetime-picker type="date" v-model="formData.date" />
      </uni-forms-item>
      <uni-forms-item label="Amount" name="amount">
        <uni-easyinput type="digit" v-model="formData.amount" placeholder="Enter amount" />
      </uni-forms-item>
      <uni-forms-item label="Category" name="category">
        <uni-data-checkbox v-model="formData.category" :localdata="categories" />
      </uni-forms-item>
      <uni-forms-item label="Receipt" name="receipt">
        <view class="upload-box" @click="chooseReceipt">
          <image v-if="formData.receipt_image_url" :src="formData.receipt_image_url" mode="aspectFit" class="preview" />
          <text v-else>Tap to upload receipt</text>
        </view>
      </uni-forms-item>
      <uni-forms-item label="Description" name="description">
        <uni-easyinput type="textarea" v-model="formData.description" placeholder="Optional description" />
      </uni-forms-item>
    </uni-forms>
    <button class="submit-btn" @click="submit" :loading="uploading">Submit Expense</button>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { submitExpense, type ExpenseEntry } from '@/utils/expense'

const form = ref<any>(null)
const uploading = ref(false)
const formData = reactive<ExpenseEntry>({
  date: new Date().toISOString().split('T')[0],
  amount: 0,
  category: 'Meal',
  receipt_image_url: '',
  description: ''
})

const categories = [
  { text: 'Meal', value: 'Meal' },
  { text: 'Travel', value: 'Travel' },
  { text: 'Supplies', value: 'Supplies' },
  { text: 'Other', value: 'Other' }
]

const rules = {
  date: { rules: [{ required: true, errorMessage: 'Date is required' }] },
  amount: { rules: [{ required: true, errorMessage: 'Amount is required' }] },
  category: { rules: [{ required: true, errorMessage: 'Category is required' }] }
}

const chooseReceipt = () => {
  uni.chooseImage({
    count: 1,
    success: async (res) => {
      const tempFilePath = res.tempFilePaths[0]
      uploading.value = true
      try {
        const uploadRes = await uniCloud.uploadFile({
          filePath: tempFilePath,
          cloudPath: `receipts/${Date.now()}-${Math.floor(Math.random() * 1000)}.jpg`
        })
        formData.receipt_image_url = uploadRes.fileID
      } catch (err) {
        console.error('Upload failed', err)
        uni.showToast({ title: 'Upload failed', icon: 'none' })
      } finally {
        uploading.value = false
      }
    }
  })
}

const submit = async () => {
  try {
    await form.value.validate()
    if (!formData.receipt_image_url) {
      uni.showToast({ title: 'Please upload a receipt', icon: 'none' })
      return
    }
    await submitExpense({
      ...formData,
      amount: parseFloat(formData.amount)
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
.upload-box {
  width: 100%;
  height: 300rpx;
  border: 2rpx dashed #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9f9f9;
}
.preview {
  width: 100%;
  height: 100%;
}
.submit-btn {
  margin-top: 60rpx;
  background-color: #007aff;
  color: white;
}
</style>
