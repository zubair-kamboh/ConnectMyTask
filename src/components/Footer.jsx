export default function Footer() {
  return (
    <footer className="bg-[#1A3D8F] text-white shadow dark:bg-[#0F1B47] dark:text-white  px-6 md:px-10 py-4 border-b dark:border-[#334466]">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-lg font-semibold">ConnectMyTask</h2>

        <div className="flex justify-center gap-6 mt-4 flex-wrap">
          <a href="/about" className="hover:underline hover:text-gray-200">
            About
          </a>
          <a href="/privacy" className="hover:underline hover:text-gray-200">
            Privacy Policy
          </a>
          <a href="/terms" className="hover:underline hover:text-gray-200">
            Terms & Conditions
          </a>
          <a href="/contact" className="hover:underline hover:text-gray-200">
            Contact
          </a>
        </div>

        <p className="text-sm mt-4">
          © {new Date().getFullYear()} ConnectMyTask. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
