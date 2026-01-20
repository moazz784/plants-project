import { Phone, Mail, MapPin } from "lucide-react";
import plantIo from "./assets/flowem.png";

export default function Contact() {
  return (
    <section className="w-full min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
        
        {/* Left Side: Contact Information */}
        <div className="relative bg-green-800 text-white p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Contact Information</h2>
            <p className="text-sm text-green-100 mb-8">
              Say something to start a live chat!
            </p>

            <div className="space-y-10 text-sm">
              <div className="flex items-center z-20 gap-3">
                <Phone size={18} />
                <span className="z-20">+01015486616</span>
              </div>

              <div className="flex items-center z-20 gap-3">
                <Mail size={18} />
                <span className="z-20">Ahmedomarali23@gmail.com</span>
              </div>

              <div className="flex items-start z-20 gap-3">
                <MapPin size={18} className="mt-1" />
                <span className="z-20">
                  132 Dartmouth Street Abbas Elgaad,<br />
                  Cairo 02156 EGYPT
                </span>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-green-700 rounded-full opacity-40 translate-x-1/3 translate-y-1/3" />
          <div className="absolute bottom-12 right-12 w-24 h-24 bg-green-600 rounded-full opacity-40" />

          {/* Plant Image */}
          <img
            src={plantIo}
            alt="Plant"
            className="
              absolute
              -bottom-7
              -right-7
              w-40
              md:w-52
              lg:w-60
              z-1
              lg:z-20
              pointer-events-none
            "
          />
        </div>

        {/* Right Side: Contact Form */}
        <div className="p-8">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-semibold">First Name</label>
              <input
                type="text"
                className="w-full border-b outline-none py-2 focus:border-green-700 transition"
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Last Name</label>
              <input
                type="text"
                className="w-full border-b outline-none py-2 focus:border-green-700 transition"
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Email</label>
              <input
                type="email"
                className="w-full border-b outline-none py-2 focus:border-green-700 transition"
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Phone Number</label>
              <input
                type="text"
                className="w-full border-b outline-none py-2 focus:border-green-700 transition"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-semibold">Message</label>
              <textarea
                rows="3"
                placeholder="Write your message..."
                className="w-full border-b outline-none py-2 resize-none focus:border-green-700 transition"
              />
            </div>

            <div className="md:col-span-2 flex justify-end mt-6">
              <button 
                type="submit"
                className="bg-green-700 text-white px-8 py-3 rounded-lg shadow-md hover:bg-green-800 transition active:scale-95"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>

      </div>
    </section>
  );
}