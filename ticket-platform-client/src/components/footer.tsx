export default function Footer() {
  return (
    <footer className="relative bg-[#0A0A0A] text-white pt-20 pb-8 overflow-hidden border-t border-white/10 mt-auto">
      <style>{`
        @keyframes blob-bounce-auth {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(40px, -60px) scale(1.15); }
            66% { transform: translate(-30px, 40px) scale(0.9); }
        }
        @keyframes blob-bounce-auth-2 {
            0%, 100% { transform: translate(0, 0) scale(1.1); }
            50% { transform: translate(-50px, 50px) scale(0.85); }
        }
        @keyframes blob-bounce-auth-3 {
            0%, 100% { transform: translate(0, 0) scale(0.9); }
            50% { transform: translate(60px, -30px) scale(1.2); }
        }
        @keyframes blob-bounce-auth-4 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(-40px, -40px) scale(0.95); }
        }
        .animate-blob-auth-1 { animation: blob-bounce-auth 20s ease-in-out infinite; }
        .animate-blob-auth-2 { animation: blob-bounce-auth-2 25s ease-in-out infinite; }
        .animate-blob-auth-3 { animation: blob-bounce-auth-3 18s ease-in-out infinite; }
        .animate-blob-auth-4 { animation: blob-bounce-auth-4 28s ease-in-out infinite; }
      `}</style>
      
      {/* Background Animated Blobs */}
      <div className="absolute top-[-150px] left-[-100px] w-[600px] h-[600px] bg-gradient-to-br from-[#0066ff] to-[#0047b3] rounded-full animate-blob-auth-1 blur-[100px] opacity-30 pointer-events-none"></div>
      <div className="absolute bottom-[-150px] right-[-100px] w-[500px] h-[500px] bg-gradient-to-tr from-[#00bfff] to-[#0047b3] rounded-full animate-blob-auth-2 blur-[100px] opacity-20 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-tl from-[#0066ff] to-[#003d99] rounded-full animate-blob-auth-3 blur-[80px] opacity-20 pointer-events-none"></div>
      <div className="absolute top-[20%] right-[20%] w-[300px] h-[300px] bg-[#0066ff] rounded-full animate-blob-auth-4 blur-[90px] opacity-20 pointer-events-none"></div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        
        {/* Top Section (Newsletter) */}
        <div className="flex flex-col lg:flex-row items-center justify-between pb-12 mb-12 border-b border-white/10 gap-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight">Let's find harmony together.</h2>
          
          <div className="w-full lg:w-auto flex-1 max-w-lg">
            <form className="flex w-full items-center border border-white/20 rounded-md overflow-hidden bg-transparent focus-within:border-white/60 transition-colors">
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full bg-transparent px-4 py-3.5 text-sm text-white outline-none placeholder:text-gray-500" 
              />
              <button 
                type="submit" 
                className="px-6 py-3.5 text-sm font-semibold text-white bg-transparent hover:bg-white/10 transition-colors whitespace-nowrap"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="lg:col-span-1">
             <h2 className="text-2xl font-bold mb-6 tracking-widest uppercase">TICKET<span className="text-[#0066ff]">PRO</span></h2>
             <p className="text-gray-400 text-sm mb-8 leading-relaxed max-w-xs">
               Sound Healing & Music Therapy Elementor Template Kit
             </p>
             <p className="text-white font-medium text-sm">
               Listen Live 4PM PST @TicketPro
             </p>
          </div>
          
          <div>
            <h3 className="font-bold text-white mb-6 text-base tracking-wide">Shop</h3>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Sound baths</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Guided meditations</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Yoga music</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Chakra healing sounds</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-white mb-6 text-base tracking-wide">Quick Links</h3>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Services</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Retreat</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Events</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-white mb-6 text-base tracking-wide">Stay in Touch</h3>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-white transition-colors">YouTube</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Spotify</a></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10 text-[#6E6E6E] text-xs">
          <p>Copyright &copy; {new Date().getFullYear()} TicketPro. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
