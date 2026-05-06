<template>
  <view class="container">
    <uni-segmented-control :current="currentTab" :values="['Timesheets', 'Expenses', 'Reports']" style-type="button" @clickItem="onClickItem" />
    
    <view class="list-container">
      <view v-if="currentTab === 0">
        <uni-list>
          <uni-list-item v-for="item in pending.timesheets" :key="item._id" :title="item.date" :note="item.description" :rightText="item.hours + ' hrs'">
            <template v-slot:footer>
              <view class="actions">
                <button size="mini" type="primary" @click="openActionPopup('timesheets', item._id, 'approve')">Approve</button>
                <button size="mini" type="warn" @click="openActionPopup('timesheets', item._id, 'reject')">Reject</button>
              </view>
            </template>
          </uni-list-item>
        </uni-list>
        <view v-if="pending.timesheets.length === 0" class="empty">No pending timesheets</view>
      </view>
      
      <view v-if="currentTab === 1">
        <uni-list>
          <uni-list-item v-for="item in pending.expenses" :key="item._id" :title="item.date" :note="item.category" :rightText="'$' + item.amount">
            <template v-slot:footer>
              <view class="actions">
                <button size="mini" type="primary" @click="openActionPopup('expenses', item._id, 'approve')">Approve</button>
                <button size="mini" type="warn" @click="openActionPopup('expenses', item._id, 'reject')">Reject</button>
              </view>
            </template>
          </uni-list-item>
        </uni-list>
        <view v-if="pending.expenses.length === 0" class="empty">No pending expenses</view>
      </view>

      <view v-if="currentTab === 2">
        <view class="report-setup">
          <text class="label">Select Month:</text>
          <uni-datetime-picker type="month" v-model="reportPeriod" />
          <button class="report-btn" @click="handleGenerateReport">Generate CSV Report</button>
        </view>
        <view v-if="reportCsv" class="report-output">
          <text class="label">Report Generated (CSV):</text>
          <textarea :value="reportCsv" class="csv-text" disabled />
          <button size="mini" @click="copyReport">Copy to Clipboard</button>
        </view>
      </view>
    </view>
    
    <!-- Action Popup -->
    <uni-popup ref="popup" type="center">
      <view class="popup-content">
        <text class="popup-title">{{ actionType === 'approve' ? 'Approve' : 'Reject' }} Submission</text>
        <uni-easyinput type="textarea" v-model="comment" placeholder="Optional comment" />
        <view class="popup-actions">
          <button size="mini" @click="closePopup">Cancel</button>
          <button size="mini" :type="actionType === 'approve' ? 'primary' : 'warn'" @click="confirmAction">Confirm</button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getPendingSubmissions, approveSubmission, rejectSubmission, type PendingData } from '@/utils/manager'
import { getReportData, generateCSV } from '@/utils/report'

const currentTab = ref(0)
const pending = ref<PendingData>({ timesheets: [], expenses: [] })
const popup = ref<any>(null)
const comment = ref('')
const actionType = ref<'approve' | 'reject' | ''>('')
const selectedType = ref<'timesheets' | 'expenses' | ''>('')
const selectedId = ref('')

const reportPeriod = ref(new Date().toISOString().substring(0, 7))
const reportCsv = ref('')

const fetchPending = async () => {
  try {
    const data = await getPendingSubmissions()
    pending.value = data
  } catch (err) {
    console.error(err)
  }
}

onMounted(fetchPending)

const onClickItem = (e) => {
  currentTab.value = e.currentIndex
}

const openActionPopup = (type, id, action) => {
  selectedType.value = type
  selectedId.value = id
  actionType.value = action
  comment.value = ''
  popup.value.open()
}

const closePopup = () => {
  popup.value.close()
}

const confirmAction = async () => {
  try {
    if (actionType.value === 'approve') {
      await approveSubmission(selectedType.value, selectedId.value, comment.value)
    } else {
      await rejectSubmission(selectedType.value, selectedId.value, comment.value)
    }
    uni.showToast({ title: 'Success' })
    closePopup()
    fetchPending()
  } catch (err) {
    console.error(err)
  }
}

const handleGenerateReport = async () => {
  try {
    const data = await getReportData(reportPeriod.value)
    reportCsv.value = generateCSV(data)
  } catch (err) {
    console.error(err)
  }
}

const copyReport = () => {
  uni.setClipboardData({
    data: reportCsv.value,
    success: () => uni.showToast({ title: 'Copied to clipboard' })
  })
}
</script>

<style>
.container {
  padding: 20rpx;
}
.list-container {
  margin-top: 30rpx;
}
.actions {
  display: flex;
  gap: 10rpx;
  align-items: center;
}
.empty {
  text-align: center;
  padding: 100rpx;
  color: #999;
}
.popup-content {
  background-color: white;
  padding: 40rpx;
  border-radius: 20rpx;
  width: 600rpx;
}
.popup-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 30rpx;
  display: block;
  text-align: center;
}
.popup-actions {
  display: flex;
  justify-content: flex-end;
  gap: 20rpx;
  margin-top: 40rpx;
}
.report-setup {
  padding: 40rpx;
}
.label {
  display: block;
  margin-bottom: 20rpx;
  font-weight: bold;
}
.report-btn {
  margin-top: 40rpx;
  background-color: #007aff;
  color: white;
}
.report-output {
  margin-top: 60rpx;
  padding: 20rpx;
  background-color: #f0f0f0;
}
.csv-text {
  width: 100%;
  height: 300rpx;
  font-family: monospace;
  font-size: 24rpx;
  margin-bottom: 20rpx;
  background-color: white;
  padding: 10rpx;
}
</style>
