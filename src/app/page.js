'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="text-center py-16 bg-blue-500 text-white">
        <h2 className="text-4xl font-bold">
          Find Trusted Task Providers Instantly
        </h2>
        <p className="mt-4 text-lg">
          Post a task, get bids, and hire the best service providers.
        </p>
        <Link
          href="/register"
          className="mt-6 inline-block bg-white text-blue-500 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200"
        >
          Get Started
        </Link>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 grid md:grid-cols-3 gap-6 text-center">
        <div className="p-6 bg-white shadow-lg rounded-xl">
          <h3 className="text-xl font-semibold text-gray-900">Post a Task</h3>
          <p className="mt-2 text-gray-600">
            Easily post your task with details, budget, and deadline.
          </p>
        </div>
        <div className="p-6 bg-white shadow-lg rounded-xl">
          <h3 className="text-xl font-semibold text-gray-900">Get Bids</h3>
          <p className="mt-2 text-gray-600">
            Service providers bid on your task with competitive offers.
          </p>
        </div>
        <div className="p-6 bg-white shadow-lg rounded-xl">
          <h3 className="text-xl font-semibold text-gray-900">Hire & Pay</h3>
          <p className="mt-2 text-gray-600">
            Choose the best provider, track the task, and pay securely.
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-100 text-center text-gray-900">
        <h3 className="text-2xl font-bold">What Our Users Say</h3>
        <p className="mt-4 text-gray-600">
          See how ConnectMyTask has helped thousands of users.
        </p>
      </section>
    </div>
  )
}
