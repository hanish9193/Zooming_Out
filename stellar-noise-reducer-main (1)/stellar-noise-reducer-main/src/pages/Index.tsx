
import { useEffect, useState } from 'react';
import Spline from '@splinetool/react-spline';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const handleShrinkNoise = () => {
    console.log('Shrink the Noise clicked!');
    toast({
      title: "Noise Reduction Started",
      description: "Your stellar noise reduction process has begun...",
      className: "bg-black/80 border-white/20 text-white backdrop-blur-lg",
    });
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Subtle star field overlay */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-twinkle"></div>
        <div className="absolute top-1/3 right-1/3 w-0.5 h-0.5 bg-white rounded-full animate-twinkle" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/4 left-1/2 w-0.5 h-0.5 bg-white rounded-full animate-twinkle" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-white rounded-full animate-twinkle" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-1/3 left-1/3 w-0.5 h-0.5 bg-white rounded-full animate-twinkle" style={{animationDelay: '1.5s'}}></div>
      </div>

      {/* Spline 3D Model */}
      <div className="absolute inset-0 w-full h-full">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div 
              className="rounded-lg p-6 animate-fade-in"
              style={{
                background: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <div className="text-white text-lg">
                Loading stellar experience...
              </div>
            </div>
          </div>
        )}
        <Spline
          scene="https://prod.spline.design/UVUsRRczdwxsI0KI/scene.splinecode"
          onLoad={() => setIsLoading(false)}
          style={{
            width: '100%',
            height: '100%',
            opacity: isLoading ? 0 : 1,
            transition: 'opacity 1.5s ease-in-out'
          }}
        />
      </div>

      {/* Main Heading - Repositioned to top center */}
      <div className="absolute top-8 left-0 right-0 z-10 px-6 animate-fade-in">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-xl sm:text-2xl md:text-3xl text-white leading-tight tracking-wide whitespace-nowrap">
            Sometimes, All It Takes Is a Look at the Stars...
          </h1>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="absolute bottom-0 left-0 right-0 z-10 pb-16 px-6 animate-fade-in" style={{animationDelay: '0.5s'}}>
        <div className="max-w-md mx-auto text-center">
          <button
            onClick={handleShrinkNoise}
            className="relative px-8 py-4 rounded-lg text-lg text-white transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.98] group"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.4)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            <span className="relative z-10">Shrink the Noise</span>
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>

      {/* Ambient glow effect */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
    </div>
  );
};

export default Index;
