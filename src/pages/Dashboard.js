// pages/DashboardPage.js
import Layout from '../components/Layout'
import { useState } from 'react'
import { Typography } from '@mui/material'
import ProfilePage from '../components/ProfilePage'
import TasksPage from '../components/TaskPage'

export default function UserDashboard() {
  return (
    <Layout>
      <Typography variant="h4">Dashboard</Typography>
    </Layout>
  )
}
