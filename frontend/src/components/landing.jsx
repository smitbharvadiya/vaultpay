import razorpayLogo from "../assets/razorpay-icon.svg";
import stripeLogo from "../assets/stripe-logo.svg";
import paypalLogo from "../assets/paypal-logo.svg";
import cashfreeLogo from "../assets/cashfree-logo.svg";
import illustration from "../assets/illustration1.png";
import { BsArrowDownRightCircleFill } from "react-icons/bs";
import { GoShieldCheck } from "react-icons/go";
import { FaCheck } from "react-icons/fa6";
import { MdAttachMoney } from "react-icons/md";
import Footer from "./footer";

const Landing = ({ setOpenLogin }) => {

  const handleGenerateKey = () => {
    setOpenLogin(true);
  };

  return (
    <div className="bg-white">
      {/* 1. Hero / Main Heading Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

        {/* Grid Background - Positioned absolutely to stay behind content */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />

        {/* <div className="hidden lg:block">
          <div className="absolute rotate-10 top-[25%] right-[15%] border rounded-full text-sm pl-2 pr-3 py-1 flex justify-center items-center gap-3 bg-white font-semibold tracking-tight">
            <div className="bg-green-400 rounded-full p-1 text-white"><GoShieldCheck className="size-4" /></div>
            Secure Payment
          </div>

          <div className="absolute rotate-350 top-[45%] left-[10%] border rounded-full text-sm pl-2 pr-3 py-1 flex justify-center items-center gap-3 bg-white font-semibold tracking-tight">
            <div className="bg-green-400 rounded-full p-1 text-white"><FaCheck className="size-4" /></div>
            Payment Confirmed
          </div>
        </div> */}


        {/* Content Container - Centered and sitting above the grid */}
        <div className="relative z-10 flex flex-col items-center text-center px-4">

          {/* THE BADGE: Now inside the flex column */}
          <div className="mb-4 shadow-md inline-flex items-center rounded-full border border-slate-200 bg-slate-50/50 pl-1 pr-2 py-1 text-xs font-semibold text-teal-700 backdrop-blur-sm gap-2 ">
            <BsArrowDownRightCircleFill size={16} />
            <span>All in One Place</span>
          </div>

          <div className="font-bricolage font-medium tracking-tighter">
            <h1 className="text-7xl md:text-8xl">Scale Results.</h1>
            <h1 className="text-6xl md:text-7xl">Not workload.</h1>
          </div>

          <p className="mt-8 font-geist text-[#797c78] text-lg md:text-lg max-w-xl mx-auto tracking-tight">
            The developer-first API layer that standardizes your payment flow across every global gateway.
          </p>

        </div>
      </div>

      {/* 2. Payment Gateways Section */}
      <section className="py-10 border-t-1 border-[#dfdfdf] bg-white">
        <div className="container mx-auto">
          <h2 className="text-[#6e6e6e] text-center text-sm font-semibold uppercase tracking-[0.2em] mb-12">
            Integrate multiple Payment Gateways
          </h2>

          <div className="flex flex-wrap justify-evenly items-center px-6">
            <img src={razorpayLogo} alt="Razorpay" className="h-8 md:h-10 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300" />
            <img src={stripeLogo} alt="Stripe" className="h-8 md:h-10 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300" />
            <img src={paypalLogo} alt="PayPal" className="h-8 md:h-10 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300" />
            <img src={cashfreeLogo} alt="Cashfree" className="h-8 md:h-10 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300" />
          </div>
        </div>
      </section>

      {/* feauture list */}
      <div className="border-t-1 border-[#dfdfdf] px-20 py-15">
        <h1 className="text-4xl font-plus-jakarta-sans font-semibold text-center tracking-tight">The Backbone of Your Payment Flow</h1>
        <p className="text-center text-gray-400">Everything you need to build, scale, and secure your payment infrastructure.</p>

        <div className="flex justify-center py-8">
          <img
            src={illustration}
            alt="Unified Infrastructure"
            className="w-80"
          />
        </div>

        <div className="flex text-center border-t-1 border-[#dfdfdf]">
          <div className="p-6 border-r-1 border-[#dfdfdf]">
            <h1 className="text-lg pb-2 font-semibold font-radio-canada tracking-tight">Unified Payment API</h1>
            <p className="text-slate-600 leading-relaxed text-sm">
              One clean, consistent API to accept and manage payments across your
              applications—no fragmented integrations or provider lock-in.
            </p>
          </div>
          <div className="p-6 border-r-1 border-[#dfdfdf]">
            <h1 className="text-lg pb-2 font-semibold font-radio-canada tracking-tight">Built-in Security & Access Control</h1>
            <p className="text-slate-600 leading-relaxed text-sm">
              Secure API keys, request verification, and scoped access ensure every
              transaction is protected by default, not as an afterthought.
            </p>
          </div>
          <div className="p-6">
            <h1 className="text-lg pb-2 font-semibold font-radio-canada tracking-tight">Real-Time Webhooks & Observability</h1>
            <p className="text-slate-600 leading-relaxed text-sm">
              Track every payment lifecycle event in real time with reliable webhooks,
              detailed logs, and clear transaction status visibility.
            </p>
          </div>
        </div>


      </div>

      <Footer />

    </div>
  );
}

export default Landing;
