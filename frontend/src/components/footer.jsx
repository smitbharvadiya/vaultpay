import { FaGithub, FaXTwitter, FaLinkedinIn } from "react-icons/fa6";
import Docs from "./docs";
import logo from "../assets/VaultPayLogo.png";

const Footer = () => {
  return (
    <footer className="bg-white border-t-1 border-[#dfdfdf] pt-20 pb-10 font-jakarta">
      <div className="max-w-7xl mx-auto px-6 md:px-20">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-2">
            <a href="/" className="text-2xl font-bold tracking-tighter text-slate-900 font-bricolage mb-4 block">
              <img src={logo} alt="VaultPay" className="h-7" />
            </a>
            <p className="text-slate-500 text-sm max-w-xs leading-relaxed mb-6">
              The unified abstraction layer for modern payments. Integrate once, scale everywhere.
            </p>
          </div>

          {/* Product Column */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-slate-500 font-inter">
              <li><a href="#" className="hover:text-black transition-colors">Unified API</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Adapters</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Webhooks</a></li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-6">Resources</h4>
            <ul className="space-y-4 text-sm text-slate-500 font-inter">
              <li><a href="/docs" className="hover:text-black transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-black transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Community</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Status</a></li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-6">Legal</h4>
            <ul className="space-y-4 text-sm text-slate-500 font-inter">
              <li><a href="#" className="hover:text-black transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Security</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t-1 border-[#dfdfdf] flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-slate-400 font-medium">
            © 2025 VaultPay Technologies Inc. Built for the modern web.
          </p>
          
          <div className="flex items-center gap-6 text-slate-400">
            <a href="https://github.com/smitbharvadiya/vaultpay" target="_blank" className="hover:text-slate-900 transition-colors"><FaGithub size={18} /></a>
            <a href="#" target="_blank" className="hover:text-slate-900 transition-colors"><FaXTwitter size={18} /></a>
            <a href="#" target="_blank" className="hover:text-slate-900 transition-colors"><FaLinkedinIn size={18} /></a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;