import React, { useState, useEffect } from 'react';

const motivationalSlides = [
  {
    image: 'https://images.pexels.com/photos/317356/pexels-photo-317356.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    quote: "Success is not final, failure is not fatal: it is the courage to continue that counts."
  },
  {
    image: 'https://images.pexels.com/photos/235922/pexels-photo-235922.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    quote: "The only limit to our realization of tomorrow will be our doubts of today."
  },
  {
    image: 'https://images.pexels.com/photos/1516440/pexels-photo-1516440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    quote: "Discipline is the bridge between goals and accomplishment."
  }
];

export const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % motivationalSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 75% Image/Quote Side */}
      <div className="hidden lg:flex lg:w-3/4 relative overflow-hidden bg-black">
        {motivationalSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide.image}
              alt="Motivational"
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-16">
              <div className="max-w-3xl">
                <p className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight tracking-tight drop-shadow-lg">
                  "{slide.quote}"
                </p>
                <div className="flex gap-3">
                  {motivationalSlides.map((_, dotIndex) => (
                    <div
                      key={dotIndex}
                      className={`h-2 rounded-full transition-all duration-500 ease-in-out ${
                        dotIndex === currentSlide ? 'w-10 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]' : 'w-2 bg-white/50 hover:bg-white/80 cursor-pointer'
                      }`}
                      onClick={() => setCurrentSlide(dotIndex)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 25% Form Side */}
      <div className="w-full lg:w-1/4 flex flex-col justify-center items-center p-8 sm:p-12 bg-white/90 backdrop-blur-xl shadow-[-20px_0_40px_-15px_rgba(0,0,0,0.1)] z-10 border-l border-white/20">
        <div className="w-full max-w-sm">
          {children}
        </div>
      </div>
    </div>
  );
};
