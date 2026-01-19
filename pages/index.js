import { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';

// Icons Components
const Check = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const Menu = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const ArrowRight = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const Star = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

const HardHat = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z" />
    <path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5" />
    <path d="M4 15v-3a6 6 0 0 1 6-6h0" />
    <path d="M14 6h0a6 6 0 0 1 6 6v3" />
  </svg>
);

const Phone = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToForm = () => {
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    const formData = {
      fullName: e.target.fullName?.value,
      email: e.target.email?.value,
      mobilePhone: e.target.mobilePhone?.value,
      industry: e.target.industry?.value,
      hasWebsite: e.target.hasWebsite?.value,
      timeline: e.target.timeline?.value,
      calendarLink: typeof window !== 'undefined' ? window.location.origin + '/thank-you.html' : ''
    };

    // Track form submission in Meta Pixel
    if (typeof window !== 'undefined' && typeof window.fbq !== 'undefined') {
      window.fbq('track', 'Lead');
    }

    try {
      const apiUrl = '/api/send-email';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message);
      }

      setIsModalOpen(false);
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error('Form submission error:', error);
      // Still show success modal even if API fails
      setIsModalOpen(false);
      setIsSuccessModalOpen(true);
    }
  };

  return (
    <>
      <Head>
        <title>Professional Websites for US Contractors | Kove Media</title>
        <meta name="description" content="We build solid, professional websites specifically for construction companies, contractors, and trades in the US. Get more jobs with a website that works." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </Head>

      {/* Meta Pixel Script */}
      <Script
        id="facebook-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '4530724333821963');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <img height="1" width="1" style={{ display: 'none' }} src="https://www.facebook.com/tr?id=4530724333821963&ev=PageView&noscript=1" />
      </noscript>

      <div className="min-h-screen font-sans text-gray-800 bg-[#F9F9F7] selection:bg-red-700 selection:text-white antialiased">
        {/* Navigation */}
        <nav 
          className={`fixed w-full z-50 transition-all duration-300 ${
            scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 py-2' : 'bg-transparent py-4'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center group cursor-pointer">
                <svg className="h-10 w-auto" viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg">
                  <g>
                    <rect x="3" y="2" width="9" height="26" fill={scrolled ? "#000000" : "#ffffff"}/>
                    <polygon points="12,2 12,13 25,2 30,2 18,13 30,24 25,24 12,13" fill="#dc2626"/>
                    <polygon points="12,15 12,28 25,28 30,28 18,17 30,6 25,6 12,15" fill="#dc2626"/>
                  </g>
                  <text x="38" y="19" fontFamily="Arial, Helvetica, sans-serif" fontSize="23" fontWeight="bold" fill={scrolled ? "#000000" : "#ffffff"}>OVE</text>
                  <text x="38" y="37" fontFamily="Arial, Helvetica, sans-serif" fontSize="17" fontWeight="bold" fill={scrolled ? "#000000" : "#ffffff"}>MEDIA</text>
                </svg>
                {!scrolled && (
                  <div className="ml-3 text-xs text-gray-300 hidden md:block">Websites & ads for local US businesses</div>
                )}
              </div>
              
              <div className="hidden md:flex items-center space-x-8">
                <a href="#pain" className={`text-sm font-bold tracking-wide transition-colors ${scrolled ? 'text-gray-600 hover:text-red-600' : 'text-gray-300 hover:text-white'}`}>Why It Matters</a>
                <a href="#portfolio" className={`text-sm font-bold tracking-wide transition-colors ${scrolled ? 'text-gray-600 hover:text-red-600' : 'text-gray-300 hover:text-white'}`}>Our Work</a>
                <button
                  onClick={scrollToForm}
                  className="bg-red-700 hover:bg-red-800 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-all uppercase tracking-wider shadow-lg hover:shadow-red-700/40 hover:-translate-y-0.5"
                >
                  Get More Jobs
                </button>
              </div>
              <div className="md:hidden">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={scrolled ? 'text-gray-900' : 'text-white'}>
                  <Menu size={24} />
                </button>
              </div>
            </div>
          </div>
          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 p-4 animate-in slide-in-from-top-2">
              <a href="#pain" className="block py-3 px-4 rounded-lg hover:bg-gray-50 text-gray-600 font-medium" onClick={() => setIsMenuOpen(false)}>Why It Matters</a>
              <a href="#portfolio" className="block py-3 px-4 rounded-lg hover:bg-gray-50 text-gray-600 font-medium" onClick={() => setIsMenuOpen(false)}>Our Work</a>
              <button onClick={() => { scrollToForm(); setIsMenuOpen(false); }} className="block w-full text-left mt-2 py-3 px-4 bg-red-50 text-red-700 rounded-lg font-bold uppercase tracking-wide">
                GET MY SITE DEAL
              </button>
            </div>
          )}
        </nav>

        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden min-h-[90vh] flex items-center">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80" 
              alt="Construction Site Background" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/60"></div>
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="space-y-8 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-900/60 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-widest shadow-lg backdrop-blur-sm">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> WEB DESIGN FOR GENERAL CONTRACTORS
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-tight text-white drop-shadow-lg">
                  We Build Solid <br />
                  Websites for <br />
                  <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-400">
                    Construction Companies.
                    <svg className="absolute w-full h-3 -bottom-1 left-0 text-red-600 opacity-80" viewBox="0 0 200 9" fill="none">
                      <path d="M2.00025 6.99997C25.7201 5.20035 83.2727 7.4171 199.999 2.99992" stroke="currentColor" strokeWidth="3"></path>
                    </svg>
                  </span>
                </h1>
                
                <h2 className="text-lg md:text-xl text-gray-300 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium drop-shadow-md">
                  You are losing jobs to competitors with better websites. Stop leaving money on the table. Get a solid, professional website built specifically for Contractors.
                </h2>
                <div className="pt-4 flex flex-col sm:items-start items-center gap-4">
                  <button
                    onClick={scrollToForm}
                    className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white text-lg font-bold px-8 py-5 rounded-xl shadow-[0_0_40px_-10px_rgba(220,38,38,0.5)] hover:shadow-[0_0_60px_-15px_rgba(220,38,38,0.6)] transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3 group border border-red-500 uppercase tracking-wider"
                  >
                    START MY BUILD — FREE MOCKUP
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <p className="text-gray-400 text-sm italic font-medium">
                    100% Risk-Free. See the design before you pay.
                  </p>
                </div>
              </div>

              {/* Phone Mockups */}
              <div className="relative h-[450px] md:h-[600px] flex justify-center items-center">
                <div className="absolute left-0 lg:-left-4 top-20 w-40 md:w-52 bg-[#1A1A1A] rounded-[2rem] border-[8px] border-[#2a2a2a] shadow-2xl transform -rotate-12 scale-90 z-10 transition-transform hover:-translate-y-2 duration-500">
                  <div className="h-full bg-white rounded-[1.4rem] overflow-hidden flex flex-col relative">
                    <div className="h-full w-full relative">
                      <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80" className="absolute inset-0 w-full h-full object-cover opacity-80" alt="Map" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full p-2 shadow-xl animate-bounce">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur p-2 rounded-lg shadow-lg text-xs font-bold text-gray-800">
                        Apex Roofing <br/> <span className="text-[10px] text-gray-500">5.0 ★★★★★ (124)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute right-0 lg:-right-4 top-20 w-40 md:w-52 bg-[#1A1A1A] rounded-[2rem] border-[8px] border-[#2a2a2a] shadow-2xl transform rotate-12 scale-90 z-10 transition-transform hover:-translate-y-2 duration-500 delay-100">
                  <div className="h-full bg-white rounded-[1.4rem] overflow-hidden flex flex-col relative">
                    <div className="p-4 bg-gray-50 h-full overflow-hidden">
                      <div className="flex items-center gap-2 mb-4 border-b border-gray-200 pb-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">G</div>
                        <span className="font-bold text-xs">Google Reviews</span>
                      </div>
                      {[1, 2, 3].map((_, i) => (
                        <div key={i} className="mb-3 bg-white p-2 rounded shadow-sm border border-gray-100">
                          <div className="flex gap-0.5 mb-1">
                            {[...Array(5)].map((_,j) => <Star key={j} size={8} className="text-yellow-400 fill-yellow-400" />)}
                          </div>
                          <div className="h-1.5 w-full bg-gray-200 rounded mb-1"></div>
                          <div className="h-1.5 w-2/3 bg-gray-200 rounded"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="absolute top-4 w-48 md:w-60 bg-[#000] rounded-[2.5rem] border-[8px] border-[#333] shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-20 transition-transform hover:scale-105 duration-500">
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-[#000] rounded-b-xl z-30"></div>
                  <div className="h-full bg-white rounded-[2rem] overflow-hidden flex flex-col relative">
                    <div className="h-44 relative flex items-center justify-center overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80" alt="Roof" className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
                      <div className="text-center relative z-10">
                        <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase mb-1 inline-block">Best in Town</span>
                        <h3 className="text-white font-bold text-xl uppercase leading-none tracking-wider">Free<br/>Estimate</h3>
                      </div>
                    </div>
                    <div className="p-5 bg-white flex-1 flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80" className="w-8 h-8 rounded-full object-cover" alt="Agent" />
                        <div className="text-[10px] text-gray-500 leading-tight">
                          <span className="block font-bold text-gray-800">Mike's Roofing</span>
                          Ready to help!
                        </div>
                      </div>
                      <div className="h-8 w-full border border-gray-200 rounded-lg bg-gray-50 flex items-center px-3 text-[10px] text-gray-400">Your Name</div>
                      <div className="h-8 w-full border border-gray-200 rounded-lg bg-gray-50 flex items-center px-3 text-[10px] text-gray-400">Phone Number</div>
                      <button className="w-full py-2 bg-red-600 text-white text-[10px] font-bold rounded-lg shadow-lg uppercase mt-auto tracking-widest">
                        Get Quote Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pain Points Section */}
        <section id="pain" className="py-24 bg-[#F9F9F7]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-5xl font-black mb-16 text-gray-900 tracking-tight">
              Why you are losing jobs to <br/>
              <span className="text-red-700">"The Other Guys"</span>
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
              {[
                { 
                  title: "Invisible on Maps", 
                  desc: "If people can't find you on Google Maps when their roof leaks, you don't exist.", 
                  img: "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&q=80"
                },
                { 
                  title: "No Trust Factor", 
                  desc: "Homeowners are scared of scams. A bad website makes you look risky, even if you are the best.", 
                  img: "https://images.unsplash.com/photo-1574757987642-5755f083910d?auto=format&fit=crop&q=80"
                },
                { 
                  title: "Hard to Contact", 
                  desc: "No \"Click-to-Call\" button? They won't copy-paste your number. They will call the next guy.", 
                  img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80"
                }
              ].map((item, idx) => (
                <div key={idx} className="group p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden text-left">
                  <div className="h-32 -mx-6 -mt-6 mb-6 overflow-hidden relative">
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 grayscale group-hover:grayscale-0" />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 flex items-center gap-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-20 relative inline-block">
              <div className="absolute -inset-1 bg-gray-200 rounded-lg blur-sm transform rotate-1"></div>
              <div className="relative bg-[#1A1A1A] text-white px-8 py-4 rounded-lg transform rotate-1 hover:rotate-0 transition-transform cursor-default shadow-2xl border border-gray-700 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-red-600">
                  <img src="https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80" className="w-full h-full object-cover" alt="Contractor" />
                </div>
                <div>
                  <p className="font-bold text-lg md:text-xl tracking-wide italic">
                    "Your truck is branded. Your website should be too."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Portfolio Section */}
        <section id="portfolio" className="py-24 bg-white border-y border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">Built for Trades</h2>
              <p className="text-gray-500 mt-4 text-lg font-medium">Real results for real contractors.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-10">
              {[
                { title: "Apex Roofing", tag: "Lead Gen Site", tagColor: "red", tagClass: "text-red-400", desc: "Focus on storm damage repairs. Fast mobile loading for emergency calls.", result: "+40% Quote Requests", resultClass: "bg-green-50 text-green-700 border-green-100", img: "https://images.unsplash.com/photo-1632759145351-1d592919f522?auto=format&fit=crop&q=80" },
                { title: "City HVAC", tag: "Local SEO", tagColor: "blue", tagClass: "text-blue-400", desc: "SEO-optimized pages for surrounding cities to capture more territory.", result: "Dominating Local Maps", resultClass: "bg-gray-50 text-gray-700 border-gray-200", img: "https://images.unsplash.com/photo-1581094794329-cd136ce4dad5?auto=format&fit=crop&q=80" },
                { title: "Elite Remodel", tag: "Showcase Site", tagColor: "yellow", tagClass: "text-yellow-400", desc: "Gallery-focused design to sell luxury renovations ($50k+ jobs).", result: "Sold 3 Kitchens in Month 1", resultClass: "bg-red-50 text-red-700 border-red-100", img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80" }
              ].map((item, idx) => (
                <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 group hover:shadow-2xl transition-all duration-300">
                  <div className="h-56 bg-gray-800 relative overflow-hidden flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-500">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                    <img src={item.img} alt={item.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                    <div className="absolute bottom-4 left-4 z-20">
                      <h3 className="text-white font-bold text-2xl tracking-tighter">{item.title}</h3>
                      <span className={`${item.tagClass} text-xs font-bold uppercase tracking-wider`}>{item.tag}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-500 text-sm mb-4 leading-relaxed">{item.desc}</p>
                    <div className={`${item.resultClass} rounded-lg p-3 flex items-center text-sm font-bold border`}>
                      <span className="bg-white p-1 rounded-md shadow-sm mr-3">📈</span> {item.result}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Package Section */}
        <section className="py-24 bg-[#1a1a1a] text-white relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80" className="w-full h-full object-cover opacity-10 blur-sm grayscale" alt="texture" />
          </div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">The "Job Booker" Package</h2>
              <p className="text-gray-400 text-lg">Everything a contractor needs. Nothing you don't.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                "Local SEO Foundation",
                "Lightning-Fast Performance",
                "Lead-Gen Architecture",
                "Trust & Reputation Integration"
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center p-5 rounded-xl bg-black/40 border border-white/10 hover:border-red-500/50 transition-all duration-300 group backdrop-blur-sm">
                  <div className="flex-shrink-0 bg-red-600 rounded-full p-1 mr-4 border border-red-500 group-hover:scale-110 transition-transform">
                    <Check size={14} className="text-white" />
                  </div>
                  <span className="text-lg font-medium text-gray-200 group-hover:text-white">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Specialties Section */}
        <section className="py-24 bg-[#F9F9F7]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-black mb-16 tracking-tight text-gray-900">We Specialize In:</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { img: "https://images.unsplash.com/photo-1632759145351-1d592919f522?auto=format&fit=crop&q=80", label: "Roofing" },
                { img: "https://images.unsplash.com/photo-1581094794329-cd136ce4dad5?auto=format&fit=crop&q=80", label: "HVAC" },
                { img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80", label: "General" },
                { img: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80", label: "Painters" },
                { img: "https://images.unsplash.com/photo-1557429287-b2e26467fc2b?auto=format&fit=crop&q=80", label: "Landscape" },
                { img: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80", label: "Electric" },
              ].map((item, idx) => (
                <div key={idx} className="relative h-40 rounded-xl overflow-hidden group cursor-pointer shadow-md hover:shadow-xl transition-all duration-300">
                  <img src={item.img} alt={item.label} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/50 group-hover:bg-red-900/60 transition-colors duration-300"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-bold text-white text-lg tracking-wide uppercase border-b-2 border-transparent group-hover:border-white transition-all">{item.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section id="contact-form" className="py-24 bg-[#0A0A0A] relative flex items-center justify-center">
          <div className="absolute inset-0 bg-[#000]">
            <img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80" className="w-full h-full object-cover opacity-20 grayscale" alt="bg" />
          </div>
          
          <div className="max-w-xl w-full mx-auto px-4 relative z-10">
            <div className="bg-[#F0F0F0] rounded-2xl shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-4 bg-yellow-400/90 -translate-y-2 rotate-1 shadow-sm z-20 flex items-center justify-center">
                <span className="text-[8px] font-bold uppercase tracking-widest text-yellow-900 opacity-50">Caution</span>
              </div>
              <div className="bg-gradient-to-br from-red-700 to-red-800 p-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wider relative z-10">
                  Start Getting More Jobs
                </h2>
                <p className="text-red-100 text-sm mt-2 font-medium relative z-10">Book your build slot for this week.</p>
              </div>
              
              <div className="p-8 md:p-10 bg-white">
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Your Name</label>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Mike Smith"
                      className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-red-600 focus:bg-white transition-all font-medium text-gray-900 placeholder-gray-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Email</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="mike@example.com"
                      className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-red-600 focus:bg-white transition-all font-medium text-gray-900 placeholder-gray-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
                      <input
                        type="tel"
                        name="mobilePhone"
                        placeholder="+1 (555) 000-0000"
                        className="w-full pl-12 px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-red-600 focus:bg-white transition-all font-medium text-gray-900 placeholder-gray-400"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Trade / Service</label>
                    <select
                      name="industry"
                      className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-red-600 focus:bg-white transition-all font-medium text-gray-900"
                      required
                    >
                      <option value="">Select your trade</option>
                      <option value="Roofing">Roofing</option>
                      <option value="HVAC">HVAC</option>
                      <option value="General Contractor">General Contractor</option>
                      <option value="Remodeling">Remodeling</option>
                      <option value="Landscaping">Landscaping</option>
                      <option value="Painting">Painting</option>
                      <option value="Electrical">Electrical</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Do you have a current website?</label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="radio" name="hasWebsite" value="Yes, I want a redesign" className="mr-2" required />
                        <span className="text-gray-700">Yes, I want a redesign</span>
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name="hasWebsite" value="No, I need a new one" className="mr-2" required />
                        <span className="text-gray-700">No, I need a new one</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">When do you need this done?</label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="radio" name="timeline" value="ASAP (Ready to start)" className="mr-2" required />
                        <span className="text-gray-700">ASAP (Ready to start)</span>
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name="timeline" value="In 1–2 weeks" className="mr-2" required />
                        <span className="text-gray-700">In 1–2 weeks</span>
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name="timeline" value="Just browsing" className="mr-2" required />
                        <span className="text-gray-700">Just browsing</span>
                      </label>
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-[#111] hover:bg-black text-white font-black text-xl py-5 rounded-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200 uppercase tracking-widest border-b-4 border-gray-800 active:border-b-0 active:translate-y-1 active:shadow-none mt-4">
                    Lock In My $497 Deal
                  </button>
                  <div className="text-center pt-2">
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider flex items-center justify-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span> No generic templates. 100% Custom built.
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="bg-black text-gray-500 py-10 border-t border-gray-900">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="flex justify-center items-center gap-2 mb-4 opacity-50">
              <svg className="h-6 w-auto" viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg">
                <g>
                  <rect x="3" y="2" width="9" height="26" fill="#ffffff"/>
                  <polygon points="12,2 12,13 25,2 30,2 18,13 30,24 25,24 12,13" fill="#dc2626"/>
                  <polygon points="12,15 12,28 25,28 30,28 18,17 30,6 25,6 12,15" fill="#dc2626"/>
                </g>
                <text x="38" y="19" fontFamily="Arial, Helvetica, sans-serif" fontSize="23" fontWeight="bold" fill="#ffffff">OVE</text>
                <text x="38" y="37" fontFamily="Arial, Helvetica, sans-serif" fontSize="17" fontWeight="bold" fill="#ffffff">MEDIA</text>
              </svg>
            </div>
            <p className="text-sm">&copy; {new Date().getFullYear()} Kove Media. Built for the trades.</p>
          </div>
        </footer>

        {/* Form Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4" onClick={() => setIsModalOpen(false)}>
            <div className="bg-white rounded-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setIsModalOpen(false)} className="float-right text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
              <h2 className="text-2xl font-bold mb-2 text-gray-900">Get Your Free Website Design Proposal</h2>
              <p className="text-gray-600 mb-6">Answer a few questions so we can prepare the right mockup for you.</p>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                  <input type="text" name="fullName" className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                  <input type="email" name="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                  <input type="tel" name="mobilePhone" className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Trade</label>
                  <select name="industry" className="w-full px-4 py-2 border border-gray-300 rounded-lg" required>
                    <option value="">Select your trade</option>
                    <option value="Roofing">Roofing</option>
                    <option value="HVAC">HVAC</option>
                    <option value="General Contractor">General Contractor</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <button type="submit" className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-3 rounded-lg">
                  Get My Proposal
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {isSuccessModalOpen && (
          <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4" onClick={() => setIsSuccessModalOpen(false)}>
            <div className="bg-white rounded-2xl p-8 max-w-lg w-full text-center" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">✅ Application received</h2>
              <p className="text-gray-600 mb-6">
                Thanks, we've got your details. Next step: book a quick 10‑minute call so we can plan your website together.
              </p>
              <a href="/thank-you.html" className="inline-block w-full bg-red-700 hover:bg-red-800 text-white font-bold py-3 rounded-lg">
                Continue to book my 10‑minute call
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
