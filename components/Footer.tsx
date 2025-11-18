const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#981b1b] text-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* University Info */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">EKiti State University</h3>
            <p className="text-gray-300 text-sm">
              Official Biometric Enrolment and Verification System for staff and student management.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/enrolment" className="text-gray-300 hover:text-white transition-colors">
                  Biometric Enrolment
                </a>
              </li>
              <li>
                <a href="/verification" className="text-gray-300 hover:text-white transition-colors">
                  Identity Verification
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-300 hover:text-white transition-colors">
                  About System
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <address className="text-gray-300 text-sm not-italic">
              <p>EKiti State University</p>
              <p>Ado-Ekiti, Ekiti State</p>
              <p>Nigeria</p>
            </address>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-300">
              © {currentYear} EKiti State University. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6 text-sm text-gray-300">
              <a href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;