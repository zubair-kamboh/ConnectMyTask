import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import heroImg from '../assets/hero.jpg'
import step1 from '../assets/features.svg'
import step2 from '../assets/testimonial.svg'
import step3 from '../assets/success.svg'
import testimonial from '../assets/testimonial.svg'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section
        className="relative bg-[#1A3D8F] text-white text-center py-20 overflow-hidden"
        style={{
          backgroundImage: `url(${heroImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="bg-black bg-opacity-60 absolute inset-0" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative max-w-3xl mx-auto px-4"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find Trusted Task Providers Instantly
          </h1>
          <p className="text-lg md:text-xl mb-6">
            Post a task, get bids, and hire the best service providers.
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-[#1A3D8F] font-semibold px-6 py-3 rounded-full shadow-md hover:bg-[#f2f2f2] transition-all"
          >
            Get Started
          </Link>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white text-center">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#1A3D8F] mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                img: step1,
                title: 'Post a Task',
                desc: 'Share details, budget & deadline.',
              },
              {
                img: step2,
                title: 'Get Offers',
                desc: 'Receive bids from reliable providers.',
              },
              {
                img: step3,
                title: 'Choose & Pay',
                desc: 'Select, track and pay securely.',
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                className="bg-white rounded-xl shadow-md p-6 border border-[#E5E7EB] hover:shadow-xl transition-all"
              >
                <img
                  src={step.img}
                  alt={step.title}
                  className="mx-auto mb-4 h-28 object-contain"
                />
                <h3 className="text-xl font-bold text-[#1A3D8F] mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-[#F9FAFB] py-20">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[#1A3D8F] mb-10">
            Why ConnectMyTask?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Secure Payments',
                desc: 'Your payments are held safely until work is complete.',
              },
              {
                title: 'Verified Providers',
                desc: 'All taskers are background checked and reviewed.',
              },
              {
                title: 'Easy Communication',
                desc: 'Chat and track task progress seamlessly.',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.15 }}
                className="p-6 bg-white rounded-xl shadow-md border border-[#E5E7EB] hover:shadow-lg"
              >
                <h3 className="text-xl font-semibold text-[#1A3D8F] mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#1A3D8F] mb-4">
            What Our Users Say
          </h2>
          <p className="text-gray-600 mb-6">
            Thousands of users trust ConnectMyTask to get their jobs done.
          </p>
          <motion.img
            src={testimonial}
            alt="Testimonial"
            className="mx-auto rounded-lg shadow-lg max-w-full"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          />
        </div>
      </section>

      {/* Final CTA */}
      <section className=" text-[#C2F4EB]  py-20 text-center">
        <div className="max-w-6xl mx-auto px-6 bg-white rounded-3xl shadow-xl border border-[#E5E7EB] p-10">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A3D8F] mb-4">
            Ready to Post Your First Task?
          </h2>
          <p className="text-gray-700 mb-8">
            Join thousands who trust{' '}
            <span className="text-[#00A991] font-semibold">ConnectMyTask</span>{' '}
            every day.
          </p>
          <Link
            to="/register"
            className="inline-block bg-[#00A991] text-white font-bold px-8 py-3 rounded-full shadow-md hover:bg-[#00c2aa] transition-all"
          >
            Get Started
          </Link>
        </div>
      </section>

      <Footer />
    </>
  )
}
