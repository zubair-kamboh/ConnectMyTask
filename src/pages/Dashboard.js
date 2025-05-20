import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import Layout from '../components/Layout'

import step1 from '../assets/features.svg'
import step2 from '../assets/testimonial.svg'
import step3 from '../assets/success.svg'

export default function UserDashboard() {
  const [userName, setUserName] = useState('User')
  const { t } = useTranslation()

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'))
    setUserName(storedUser?.name || 'User')
  }, [])

  const steps = [step1, step2, step3]
  const titles = t('features.titles', { returnObjects: true })
  const descriptions = t('features.descriptions', { returnObjects: true })

  return (
    <Layout>
      <div className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 min-h-screen px-6 py-12 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-primary dark:text-white mb-2">
            {t('welcome', { name: userName })}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t('intro')}
          </p>
        </motion.div>

        <section className="grid gap-8 md:grid-cols-3 text-center">
          {steps.map((img, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 hover:shadow-lg transition"
            >
              <img
                src={img}
                alt={titles[idx]}
                className="mx-auto w-14 h-14 mb-4"
              />
              <h3 className="text-xl font-semibold text-primary dark:text-white mb-2">
                {titles[idx]}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {descriptions[idx]}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-20 bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-primary dark:text-white mb-4">
            {t('why_love')}
          </h2>
          <div className="grid md:grid-cols-2 gap-8 text-gray-700 dark:text-gray-300">
            <div>
              <p className="italic">{t('testimonial1')}</p>
              <p className="font-semibold mt-2">{t('sarah')}</p>
            </div>
            <div>
              <p className="italic">{t('testimonial2')}</p>
              <p className="font-semibold mt-2">{t('daniel')}</p>
            </div>
          </div>
        </section>

        <section className="mt-20 text-center">
          <h2 className="text-xl font-semibold text-green-600 dark:text-green-400 mb-2">
            {t('cta')}
          </h2>
          <div className="space-x-4 mt-4">
            <NavLink
              className="bg-green-600 hover:bg-green-700 text-white text-base px-6 py-3 rounded-full shadow-md"
              to="/user/dashboard/tasks"
            >
              {t('post_task')}
            </NavLink>
            <NavLink
              className="text-primary border border-primary px-6 py-3 rounded-full hover:bg-blue-50 dark:hover:bg-gray-700 transition"
              to="/user/messages"
            >
              {t('messages')}
            </NavLink>
          </div>
        </section>
      </div>
    </Layout>
  )
}
