import React, { useState, useRef, useEffect, Suspense, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  Stars, 
  Float, 
  MeshDistortMaterial, 
  Text,
  Text3D,
  Center,
  Sparkles,
  Environment,
  Grid,
  Trail,
  Cloud,
  Line,
  PerspectiveCamera
} from '@react-three/drei';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { 
  Music, 
  Calendar, 
  User, 
  ShoppingBag, 
  Mail,
  Play, 
  Pause, 
  X,
  Mic2,
  Disc,
  ExternalLink,
  Shield,
  Plus,
  Trash2,
  LogOut,
  Heart,
  Share2,
  Activity,
  Minus,
  CreditCard,
  Zap,
  Users,
  AlertTriangle,
  Check,
  Palette,
  Globe,
  BarChart3,
  LogIn,
  LayoutDashboard,
  Database
} from 'lucide-react';
import * as THREE from 'three';

// --- CONSTANTS & DATA ---

const INITIAL_TRACKS = [
  { id: 1, title: "SHE BE", duration: "2:45", plays: "10.4M", type: "Single", year: "2023", link: "https://open.spotify.com/track/1hPrUdO775t6JkI56Cr8Us" },
  { id: 2, title: "SHE BE (Sped Up)", duration: "2:15", plays: "2.5M", type: "Single", year: "2023", link: "https://open.spotify.com/track/2w82JyPaIey14wPUg2E9Fe?si=778698893b9c4867" },
  { id: 3, title: "STEADILY", duration: "3:10", plays: "2.3M", type: "Single", year: "2025", link: "https://open.spotify.com/track/5yayaJ2gEUEoKHMJmwGdUw?si=8b7a637f05f9407e" },
  { id: 4, title: "GROW & HUSTLE", duration: "3:05", plays: "266K", type: "Single", year: "2023", link: "https://open.spotify.com/track/7tIrkhISEZSDSOLM9OmbP2?si=58942ace501b446d" },
  { id: 5, title: "What Else", duration: "3:02", plays: "232K", type: "Single", year: "2023", link: "https://open.spotify.com/track/6iCZyikX0wiDqGIADWXXIL?si=8a9c958247094dd1" },
  { id: 6, title: "Like It", duration: "2:50", plays: "209K", type: "Single", year: "2023", link: "https://open.spotify.com/track/6nRR968dHGVbHkGEGW5qjh?si=92b118aa39b540ff" },
  { id: 7, title: "Jealousy", duration: "3:15", plays: "147K", type: "Single", year: "2023", link: "https://open.spotify.com/track/6nRR968dHGVbHkGEGW5qjh?si=92b118aa39b540ff" },
  { id: 8, title: "Belong", duration: "2:55", plays: "71K", type: "Single", year: "2025", link: "https://open.spotify.com/track/5DxKXoAw39p7z8vIhgHzcA?si=2d3ce919acbf4120" },
  { id: 9, title: "SHE BE (Slowed)", duration: "3:20", plays: "33K", type: "Single", year: "2023", link: "https://open.spotify.com/track/67XBVOvOqCo1ATTZwZhgQg?si=2649d24aafcd4876" },
  { id: 10, title: "Confess", duration: "3:12", plays: "22K", type: "Single", year: "2023", link: "https://open.spotify.com/track/0lNw49uPbyACig39V9GDKZ?si=c4df56ff6adf491a" },
  { id: 11, title: "Hour Glass", duration: "2:58", plays: "20K", type: "Single", year: "2023", link: "https://open.spotify.com/track/2TRIg9sBurbFiMdjaqSxRy?si=bef2f6f7c5ec4c51" },
  { id: 12, title: "RHODA", duration: "3:30", plays: "10K", type: "Single", year: "2025", link: "https://open.spotify.com/track/3s6QoBib2YKMvRzHdPp7VA?si=883ca5caad1f422d" },
  { id: 13, title: "KALI (Radio Edit Mix)", duration: "2:45", plays: "8.4K", type: "Single", year: "2025", link: "https://open.spotify.com/track/2bW51OJbA3JDCriRKIxO4c?si=036b3e90cfa342b4" },
];

const INITIAL_TOUR_DATES = [
  { id: 1, city: "London", venue: "O2 Academy", date: "OCT 12", country: "UK" },
  { id: 2, city: "Lagos", venue: "Eko Hotel", date: "OCT 24", country: "NG" },
  { id: 3, city: "New York", venue: "Brooklyn Mirage", date: "NOV 05", country: "USA" },
  { id: 4, city: "Accra", venue: "Black Star Square", date: "DEC 18", country: "GH" },
];

const INITIAL_MERCH = [
  { id: 1, name: "CHUMA HOODIE v1", price: 65, type: "Apparel", category: "merch", img: "https://images.unsplash.com/photo-1556906781-9a412961d289?auto=format&fit=crop&w=500&q=60" },
  { id: 2, name: "VINYL: GOLD EDITION", price: 45, type: "Physical", category: "merch", img: "https://images.unsplash.com/photo-1603048588665-791ca8aea616?auto=format&fit=crop&w=500&q=60" },
  { id: 3, name: "AFRO-FUSION DRUM KIT", price: 29, type: "Sample Pack", category: "sounds", img: "https://images.unsplash.com/photo-1519874179391-3ebc752241dd?auto=format&fit=crop&w=500&q=60" },
  { id: 4, name: "LAGOS VIBES BEAT", price: 150, type: "Exclusive Rights", category: "beats", img: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=500&q=60" },
];

const INITIAL_WALL_IMAGES = [
  { id: 1, src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=60", caption: "AFRO PUNK" },
  { id: 2, src: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=500&q=60", caption: "SPIRIT" },
  { id: 3, src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=60", caption: "VISION" },
];

// --- UTILITY COMPONENTS ---

const ToastContext = React.createContext({ showToast: (msg: string, icon?: any) => {} });

const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<{id: number, msg: string, icon: any}[]>([]);

  const showToast = (msg: string, Icon = Check) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, icon: Icon }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-24 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="bg-black/80 backdrop-blur border border-[var(--theme-color)] text-white px-4 py-2 rounded shadow-[0_0_15px_rgba(var(--theme-rgb),0.3)] flex items-center gap-2"
            >
              <t.icon size={14} className="text-[var(--theme-color)]" />
              <span className="text-xs font-brand tracking-wider">{t.msg}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

const useToast = () => React.useContext(ToastContext);

const ScrambleText = ({ text, className, active }: { text: string, className?: string, active?: boolean }) => {
  const [display, setDisplay] = useState(text);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  
  useEffect(() => {
    if(active) scramble();
  }, [active]);

  const scramble = () => {
    let iterations = 0;
    const interval = setInterval(() => {
      setDisplay(text.split("").map((letter, index) => {
        if (index < iterations) return text[index];
        return chars[Math.floor(Math.random() * chars.length)];
      }).join(""));
      if (iterations >= text.length) clearInterval(interval);
      iterations += 1 / 3;
    }, 30);
  };

  return (
    <span onMouseEnter={scramble} className={className}>
      {display}
    </span>
  );
};

const TiltCard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [0, 300], [10, -10]);
  const rotateY = useTransform(x, [0, 300], [-10, 10]);

  function handleMouse(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  }

  return (
    <motion.div
      style={{ rotateX, rotateY, perspective: 1000 }}
      onMouseMove={handleMouse}
      onMouseLeave={() => { x.set(150); y.set(150); }}
      className="relative transform-style-3d"
    >
      {children}
    </motion.div>
  );
};

const LiveTicker = ({ isAdmin }: { isAdmin: boolean }) => {
  const [msg, setMsg] = useState("");
  
  useEffect(() => {
    const salesMsgs = [
        "Someone from Lagos just bought a HOODIE",
        "New ticket sold: LONDON O2",
        "User129 just streamed SHE BE",
        "New listener from TOKYO",
        "Someone from Accra just joined the TRIBE",
        "User88 just bought VINYL: GOLD EDITION"
    ];
    const adminMsgs = [
        "Merch stock running low: GOLD VINYL",
        "Server load at 45%",
        "New support ticket #404 opened"
    ];

    const availableMsgs = isAdmin ? [...salesMsgs, ...adminMsgs] : salesMsgs;

    const interval = setInterval(() => {
      setMsg(availableMsgs[Math.floor(Math.random() * availableMsgs.length)]);
    }, 5000);
    setMsg(availableMsgs[0]);
    return () => clearInterval(interval);
  }, [isAdmin]);

  return (
    <div className="fixed bottom-6 left-6 z-40 pointer-events-none hidden md:block">
      <AnimatePresence mode="wait">
        <motion.div 
          key={msg}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-black/60 backdrop-blur border-l-2 border-[var(--theme-color)] pl-3 py-1"
        >
          <p className="text-[10px] font-mono text-[var(--theme-color)] tracking-wider uppercase flex items-center gap-2">
            <Activity size={10} className="animate-pulse" /> LIVE: {msg}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const Waveform = ({ isPlaying }) => {
  return (
    <div className="flex gap-[2px] items-end h-4">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-[var(--theme-color)]"
          animate={{ height: isPlaying ? [4, 16, 8, 14, 4] : 4 }}
          transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
        />
      ))}
    </div>
  );
};

const Preloader = ({ onComplete }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 20);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (count === 100) {
      setTimeout(onComplete, 500);
    }
  }, [count, onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 z-[999] bg-black flex flex-col items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <h1 className="text-6xl font-brand font-bold text-transparent bg-clip-text bg-gradient-to-b from-[var(--theme-color)] to-black tracking-tighter mb-4">
        CHUMA
      </h1>
      <div className="w-64 h-1 bg-gray-900 rounded-full overflow-hidden relative">
        <motion.div 
          className="h-full bg-[var(--theme-color)]"
          style={{ width: `${count}%` }}
        />
      </div>
      <p className="mt-2 text-[var(--theme-color)] font-mono text-xs">{count}% LOADED</p>
    </motion.div>
  );
};

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX - 16}px, ${e.clientY - 16}px)`;
      }
    };
    const mouseDown = () => setClicked(true);
    const mouseUp = () => setClicked(false);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousedown', mouseDown);
    window.addEventListener('mouseup', mouseUp);
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', mouseDown);
      window.removeEventListener('mouseup', mouseUp);
    };
  }, []);

  return (
    <div 
      ref={cursorRef}
      className={`fixed top-0 left-0 w-8 h-8 border border-[var(--theme-color)] rounded-full pointer-events-none z-[1000] mix-blend-difference transition-all duration-100 hidden md:block ${clicked ? 'scale-75 bg-[var(--theme-color)]' : 'scale-100'}`}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-1 h-1 bg-[var(--theme-color)] rounded-full" />
      </div>
    </div>
  );
};

// --- 3D COMPONENTS ---

const ReactiveFloor = ({ vibe, matrixMode, themeColor }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      meshRef.current.position.y = -2 + Math.sin(time * 2) * 0.05;
      meshRef.current.rotation.x = -Math.PI / 2 + Math.sin(time * 0.5) * 0.01;
    }
  });

  return (
    <group rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
       <Grid 
         args={[20, 20]} 
         cellColor={matrixMode ? "#00ff00" : (vibe === 'fire' ? "#ff0000" : "#ffffff")} 
         sectionColor={matrixMode ? "#00ff00" : (vibe === 'fire' ? "#ff4500" : themeColor)} 
         fadeDistance={15} 
         sectionThickness={1}
         cellThickness={0.5}
       />
       <mesh ref={meshRef} position={[0, 0, -0.1]}>
          <planeGeometry args={[20, 20, 32, 32]} />
          <meshStandardMaterial 
            color="#000" 
            wireframe={matrixMode}
            transparent
            opacity={0.8}
          />
       </mesh>
    </group>
  );
};

const NavHologram = ({ hoveredNav, matrixMode, themeColor }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.02;
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime()) * 0.2;
    }
  });

  if (!hoveredNav) return null;

  return (
    <Float speed={5} rotationIntensity={1} floatIntensity={1}>
      <group position={[0, 1, 4]}>
        <mesh ref={meshRef}>
          {hoveredNav === 'music' && <torusGeometry args={[0.3, 0.1, 16, 32]} />}
          {hoveredNav === 'events' && <icosahedronGeometry args={[0.4, 0]} />}
          {hoveredNav === 'merch' && <boxGeometry args={[0.5, 0.5, 0.5]} />}
          {hoveredNav === 'favorites' && <octahedronGeometry args={[0.4, 0]} />}
          <meshStandardMaterial 
             color={matrixMode ? "#00ff00" : themeColor} 
             wireframe 
             emissive={matrixMode ? "#00ff00" : themeColor}
             emissiveIntensity={0.5}
          />
        </mesh>
        <pointLight color={themeColor} intensity={2} distance={2} />
      </group>
    </Float>
  );
};

const AbstractAvatar = ({ activeSection, arMode, vibe, partyMode, matrixMode, themeColor }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
        meshRef.current.rotation.x = Math.sin(time * 0.5) * 0.5;
        meshRef.current.rotation.y = Math.cos(time * 0.3) * 0.5;
        // Pulse effect
        const beatMultiplier = vibe === 'fire' || partyMode ? 8 : 2;
        const intensity = vibe === 'fire' ? 0.1 : 0.05;
        const s = 1 + Math.sin(time * beatMultiplier) * intensity;
        const finalScale = arMode ? s * 0.5 : s;
        meshRef.current.scale.set(finalScale, finalScale, finalScale);
    }
    if (groupRef.current) {
        groupRef.current.rotation.y = time * 0.1;
    }
  });

  const color = useMemo(() => {
    if (matrixMode) return "#00ff00";
    if (partyMode) return new THREE.Color().setHSL(Math.random(), 1, 0.5);
    if (activeSection === 'admin') return "#ff0000";
    if (vibe === 'fire') return "#FF4500";
    return themeColor;
  }, [activeSection, vibe, partyMode, matrixMode, themeColor]);

  return (
    <group ref={groupRef} position={[0, 1.2, 0]}>
      <Float speed={vibe === 'fire' ? 6 : 3} rotationIntensity={0.5} floatIntensity={1}>
        <mesh ref={meshRef}>
          <octahedronGeometry args={[1, 0]} />
          <MeshDistortMaterial 
            color={color}
            envMapIntensity={2} 
            clearcoat={1} 
            clearcoatRoughness={0.1} 
            metalness={0.9} 
            roughness={0.1}
            distort={vibe === 'fire' || partyMode ? 0.6 : 0.3} 
            speed={vibe === 'fire' || partyMode ? 4 : 2}
            wireframe={matrixMode}
            emissive={matrixMode ? "#00ff00" : "#000"}
          />
        </mesh>
      </Float>
      {/* Orbiting Rings */}
      <mesh rotation={[1, 1, 0]}>
          <torusGeometry args={[1.8, 0.02, 16, 64]} />
          <meshStandardMaterial color={color} transparent opacity={0.3} emissive={color} emissiveIntensity={0.2} />
      </mesh>
      <mesh rotation={[-1, 0.5, 0]}>
          <torusGeometry args={[2.2, 0.02, 16, 64]} />
          <meshStandardMaterial color={color} transparent opacity={0.2} emissive={color} emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
};

const TourGlobe = ({ matrixMode, themeColor }) => {
  const globeRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group position={[2, 0, -2]}>
      <mesh ref={globeRef}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial 
          color="#111" 
          wireframe 
          emissive={matrixMode ? "#00ff00" : themeColor}
          emissiveIntensity={0.2}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.4, 32, 32]} />
        <meshBasicMaterial color="#000" />
      </mesh>
    </group>
  );
};

const BackgroundScene = ({ arMode, vibe, partyMode, matrixMode, weather, themeColor }) => {
  const lightColor = matrixMode ? "#00ff00" : (partyMode ? "#00ff00" : (vibe === 'fire' ? "#ff0000" : themeColor));

  if (arMode) {
    return (
      <>
        <ambientLight intensity={1.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color={lightColor} />
      </>
    );
  }

  return (
    <>
      {!matrixMode && <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={vibe === 'fire' || partyMode ? 3 : 1} />}
      
      {weather === 'dust' && (
         <Cloud opacity={0.5} speed={0.4} width={10} depth={1.5} segments={20} color={themeColor} position={[0, 5, -5]} />
      )}
      
      {weather === 'rain' && (
        <Sparkles count={1000} scale={[10, 10, 10]} size={2} speed={2} opacity={0.8} color={matrixMode ? "#00ff00" : "#666"} />
      )}

      {weather === 'clear' && (
         <Sparkles count={vibe === 'fire' ? 500 : 200} scale={10} size={vibe === 'fire' ? 5 : 2} speed={0.4} opacity={0.5} color={matrixMode ? "#00ff00" : (partyMode ? "hotpink" : (vibe === 'fire' ? "#ff4500" : themeColor))} />
      )}

      <ambientLight intensity={matrixMode ? 0.2 : 0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} color={lightColor} />
      <pointLight position={[-10, -10, -10]} intensity={1} color={matrixMode ? "#003300" : (partyMode ? "cyan" : (vibe === 'fire' ? "#ff4500" : "#8B5CF6"))} />
    </>
  );
};

const CameraController = ({ section, idleMode }) => {
  const { camera } = useThree();
  const vec = new THREE.Vector3();
  const timeRef = useRef(0);

  useFrame((state, delta) => {
    timeRef.current += delta;

    if (idleMode) {
      // Cinematic Orbit
      const x = Math.sin(timeRef.current * 0.2) * 8;
      const z = Math.cos(timeRef.current * 0.2) * 8;
      state.camera.position.lerp(vec.set(x, 2, z), 0.02);
      state.camera.lookAt(0, 0, 0);
      return;
    }

    let targetPos = [0, 0, 6];
    let targetLook = [0, 0, 0];

    switch (section) {
      case 'hero': targetPos = [0, 0, 7]; break;
      case 'music': targetPos = [2, 0, 6]; targetLook = [-1, 0, 0]; break;
      case 'events': targetPos = [0, 0, 7]; break;
      case 'about': targetPos = [3, 0, 5]; break;
      case 'merch': targetPos = [0, 2, 8]; break;
      case 'favorites': targetPos = [2, 1, 6]; targetLook = [-1, 0, 0]; break;
      case 'admin': targetPos = [0, 0, 10]; targetLook = [0, 1, 0]; break;
      default: targetPos = [0, 0, 6];
    }

    state.camera.position.lerp(vec.set(...targetPos as [number, number, number]), 0.05);
    state.camera.lookAt(...targetLook as [number, number, number]);
  });

  return null;
};

// --- NEW & ENHANCED 3D ELEMENTS ---

const FloatingDrones = ({ themeColor }) => {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if(group.current) {
      group.current.rotation.y = -t * 0.2;
    }
  });

  return (
    <group ref={group} position={[0, 0, 0]}>
      {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((angle, i) => (
        <group key={i} rotation={[0, angle, 0]}>
          <group position={[3.5, 0.5 + Math.sin(i) * 0.5, 0]}>
            <Float speed={5} rotationIntensity={2}>
              <mesh>
                <octahedronGeometry args={[0.2, 0]} />
                <meshStandardMaterial color={themeColor} wireframe emissive={themeColor} emissiveIntensity={0.5} />
              </mesh>
            </Float>
            <pointLight distance={3} intensity={1} color={themeColor} />
          </group>
        </group>
      ))}
    </group>
  );
};

const LaserSystem = ({ themeColor }) => {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if(group.current) {
      group.current.rotation.z = Math.sin(t * 0.5) * 0.1;
      group.current.rotation.y = t * 0.1;
    }
  });

  return (
    <group ref={group} position={[0, -2, -3]}>
      {[-2, 0, 2].map((x, i) => (
        <mesh key={i} position={[x * 2, 0, 0]} rotation={[0, 0, (i-1) * 0.3]}>
          <cylinderGeometry args={[0.02, 0.1, 20, 8]} />
          <meshBasicMaterial color={themeColor} transparent opacity={0.15} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
};

const BassPulse = ({ themeColor }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
        ref.current.children.forEach((mesh: any, i) => {
            const t = state.clock.getElapsedTime();
            const scale = (t + i * 1.5) % 4;
            mesh.scale.set(scale, scale, 1);
            mesh.material.opacity = Math.max(0, 0.8 - (scale / 4));
        })
    }
  })
  return (
      <group ref={ref} rotation={[-Math.PI/2, 0, 0]} position={[0, -2.1, 0]}>
          {[0,1,2].map(i => (
              <mesh key={i}>
                  <ringGeometry args={[1, 1.1, 64]} />
                  <meshBasicMaterial color={themeColor} transparent opacity={0.5} side={THREE.DoubleSide} />
              </mesh>
          ))}
      </group>
  )
}

const DigitalRain = ({ themeColor }) => {
  const count = 40;
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  // Initialize random starting positions
  const particles = useMemo(() => {
    return new Array(count).fill(0).map(() => ({
      x: (Math.random() - 0.5) * 15,
      y: Math.random() * 20,
      z: -5 + (Math.random() - 0.5) * 5,
      speed: 0.05 + Math.random() * 0.1
    }));
  }, []);

  useFrame(() => {
    if (!mesh.current) return;
    particles.forEach((p, i) => {
      p.y -= p.speed;
      if (p.y < -5) p.y = 10;
      dummy.position.set(p.x, p.y, p.z);
      dummy.scale.set(1, 2 + Math.random(), 1);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <boxGeometry args={[0.02, 0.5, 0.02]} />
      <meshBasicMaterial color={themeColor} transparent opacity={0.4} />
    </instancedMesh>
  );
};

const PrismaticShards = () => {
  return (
    <group>
        <Float speed={1.5} rotationIntensity={1} floatIntensity={1}>
          <mesh position={[-6, 2, -8]} rotation={[0.5, 1, 0]}>
              <coneGeometry args={[0.5, 5, 3]} />
              <meshStandardMaterial color="#111" metalness={1} roughness={0.1} envMapIntensity={2} />
          </mesh>
        </Float>
        <Float speed={1} rotationIntensity={1.5} floatIntensity={1}>
          <mesh position={[6, -1, -8]} rotation={[-0.5, -1, 0]}>
              <coneGeometry args={[0.5, 6, 3]} />
              <meshStandardMaterial color="#111" metalness={1} roughness={0.1} envMapIntensity={2} />
          </mesh>
        </Float>
    </group>
  )
}

const Hero3DText = ({ vibe, matrixMode, themeColor }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.getElapsedTime();
      // Gentle floating
      groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.15;
      groupRef.current.rotation.x = Math.cos(t * 0.3) * 0.05;
    }
  });

  return (
    <group position={[0, -0.5, 0]}>
      <Center>
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
          <group ref={groupRef}>
             <Text3D
                font="https://threejs.org/examples/fonts/helvetiker_bold.typeface.json"
                size={0.8}
                height={0.1}
                curveSegments={12}
                bevelEnabled
                bevelThickness={0.02}
                bevelSize={0.02}
                bevelOffset={0}
                bevelSegments={5}
             >
                CHUMA
                <meshStandardMaterial 
                   color={matrixMode ? "#00ff00" : themeColor}
                   emissive={matrixMode ? "#00ff00" : themeColor}
                   emissiveIntensity={0.4}
                   metalness={0.9}
                   roughness={0.1}
                   envMapIntensity={1}
                />
             </Text3D>
          </group>
        </Float>
      </Center>
    </group>
  );
};

const AfroOrbitals = ({ vibe, matrixMode, themeColor }) => {
  const group = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if(group.current) {
      group.current.rotation.y = state.clock.getElapsedTime() * 0.1;
      group.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1;
    }
  });

  return (
    <group ref={group}>
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[3.5, 0.01, 16, 100]} />
        <meshStandardMaterial 
          color={matrixMode ? "#00ff00" : themeColor} 
          emissive={matrixMode ? "#00ff00" : themeColor}
          emissiveIntensity={0.5}
          transparent 
          opacity={0.4} 
        />
      </mesh>
       <mesh rotation={[-Math.PI / 3, 0, 0]}>
        <torusGeometry args={[4.5, 0.01, 16, 100]} />
        <meshStandardMaterial 
          color={matrixMode ? "#00ff00" : themeColor} 
          emissive={matrixMode ? "#00ff00" : themeColor}
          emissiveIntensity={0.2}
          transparent 
          opacity={0.2} 
        />
      </mesh>
      <Sparkles count={50} scale={8} size={4} speed={0.4} opacity={0.5} color={themeColor} />
    </group>
  );
}

const VinylRecord = ({ isPlaying, vibe, matrixMode, themeColor }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (isPlaying && ref.current) {
      ref.current.rotation.z -= delta * 2;
    }
  });

  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      <group ref={ref}>
        <mesh receiveShadow castShadow>
          <cylinderGeometry args={[2, 2, 0.05, 64]} />
          <meshStandardMaterial color="#111" roughness={0.2} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.03, 0]} rotation={[-Math.PI/2, 0, 0]}>
          <circleGeometry args={[0.8, 32]} />
          <meshBasicMaterial color={themeColor} />
        </mesh>
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI/2, 0, 0]}>
          <ringGeometry args={[0.9, 1.9, 64]} />
          <meshStandardMaterial color="#222" roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
};

const MouseSpotlight = ({ themeColor }) => {
  const ref = useRef<THREE.PointLight>(null);
  const { viewport } = useThree();
  useFrame(({ pointer }) => {
    if (ref.current) {
      const x = (pointer.x * viewport.width) / 2;
      const y = (pointer.y * viewport.height) / 2;
      ref.current.position.set(x, y, 2);
    }
  });
  return <pointLight ref={ref} distance={10} decay={2} intensity={2} color={themeColor} />;
};

const RippleEffect = () => {
  return null;
};

const MouseTrail = ({ themeColor }) => {
  const ref = useRef<any>(null);
  const { viewport } = useThree();
  
  useFrame(({ pointer }) => {
    if (ref.current) {
      const x = (pointer.x * viewport.width) / 2;
      const y = (pointer.y * viewport.height) / 2;
      ref.current.position.set(x, y, 0);
    }
  });

  return (
    <Trail
      width={1.5}
      length={6}
      color={new THREE.Color(themeColor)}
      attenuation={(t) => t * t}
    >
      <mesh ref={ref} visible={false}>
        <sphereGeometry args={[0.1]} />
        <meshBasicMaterial color={themeColor} />
      </mesh>
    </Trail>
  );
};

const SalesChart3D = ({ themeColor }) => {
  const data = useMemo(() => [40, 65, 30, 85, 50, 95, 70], []);
  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if(groupRef.current) {
      // Gentle floating animation for entire chart
      groupRef.current.position.y = 1 + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={[-3, 1, 0]} rotation={[0, 0.3, 0]}>
       {data.map((val, i) => (
         <group key={i} position={[i * 1.2, 0, 0]}>
           {/* Bar */}
           <mesh position={[0, (val / 30) / 2, 0]}>
              <boxGeometry args={[0.8, val / 30, 0.8]} />
              <meshStandardMaterial 
                color={themeColor} 
                transparent 
                opacity={0.7} 
                emissive={themeColor}
                emissiveIntensity={0.4}
                wireframe
              />
           </mesh>
           {/* Inner solid core for better visibility */}
           <mesh position={[0, (val / 30) / 2, 0]}>
              <boxGeometry args={[0.6, val / 30, 0.6]} />
              <meshBasicMaterial color={themeColor} transparent opacity={0.1} />
           </mesh>
           {/* Label */}
           <Text
             position={[0, -0.8, 0]}
             fontSize={0.4}
             color="white"
             font="https://fonts.gstatic.com/s/oswald/v49/TK3iWkUHHAIjg75cFRf3bXL8LICs1_FvsUZiZQ.ttf"
           >
             {days[i]}
           </Text>
           {/* Value Tooltip-ish */}
           <Text
             position={[0, (val / 30) + 0.5, 0]}
             fontSize={0.3}
             color={themeColor}
           >
             {val}k
           </Text>
         </group>
       ))}
       <Text position={[3.5, 4, 0]} fontSize={0.8} color="white" anchorX="center">
          WEEKLY VOLUME
       </Text>
    </group>
  );
};

const PulseRing: React.FC<{ position: any, themeColor: string, delay: number }> = ({ position, themeColor, delay }) => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if(ref.current) {
       const t = (state.clock.getElapsedTime() + delay) % 2;
       ref.current.scale.set(t, t, t);
       ref.current.lookAt(0,0,0); // Make ring face center roughly
       (ref.current.material as THREE.MeshBasicMaterial).opacity = 1 - (t/2);
    }
  });
  return (
    <mesh ref={ref} position={position}>
      <ringGeometry args={[0.1, 0.12, 16]} />
      <meshBasicMaterial color={themeColor} transparent side={THREE.DoubleSide} />
    </mesh>
  )
}

const LiveActivityGlobe = ({ themeColor }) => {
  const globeRef = useRef<THREE.Group>(null);
  // Generate random user points on sphere
  const users = useMemo(() => {
    return new Array(40).fill(0).map(() => {
       const phi = Math.acos(-1 + (2 * Math.random()));
       const theta = Math.sqrt(Math.PI * 40) * phi;
       return {
         pos: new THREE.Vector3().setFromSphericalCoords(2, phi, theta),
         scale: 0.5 + Math.random() * 0.5
       }
    });
  }, []);

  useFrame((state) => {
    if(globeRef.current) {
      globeRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group position={[3, 1, 0]} rotation={[0, -0.5, 0]}>
       <group ref={globeRef}>
          {/* Wireframe Globe */}
          <mesh>
            <sphereGeometry args={[2, 24, 24]} />
            <meshBasicMaterial color="#333" wireframe transparent opacity={0.3} />
          </mesh>
          {/* Solid inner core to block stars behind */}
          <mesh>
             <sphereGeometry args={[1.95, 32, 32]} />
             <meshBasicMaterial color="#000" />
          </mesh>
          
          {/* User Dots */}
          {users.map((u, i) => (
            <mesh key={i} position={u.pos}>
              <sphereGeometry args={[0.05 * u.scale, 8, 8]} />
              <meshBasicMaterial color={themeColor} />
            </mesh>
          ))}

          {/* Pulse Rings on a few users */}
          {users.slice(0, 5).map((u, i) => (
             <PulseRing key={`pulse-${i}`} position={u.pos} themeColor={themeColor} delay={i} />
          ))}
       </group>
       <Text position={[0, 2.8, 0]} fontSize={0.6} color="white" anchorX="center">
          LIVE USERS
       </Text>
    </group>
  );
};


// --- UI COMPONENTS ---

interface DashboardCardProps {
    title: string;
    children: React.ReactNode;
    className?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, children, className = "" }) => (
  <div className={`bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-4 flex flex-col ${className}`}>
    <h3 className="text-xs font-bold text-[var(--theme-color)] mb-3 uppercase tracking-widest">{title}</h3>
    <div className="flex-1 w-full h-full min-h-[100px] relative">
      {children}
    </div>
  </div>
);

const LineChart = ({ data, color }) => {
  // data: number[]
  const max = Math.max(...data);
  const min = Math.min(...data);
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((val - min) / (max - min)) * 80 - 10; // padding
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
      <defs>
        <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
           <stop offset="0%" stopColor={color} stopOpacity="0.2" />
           <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
       <polygon points={`0,100 ${points} 100,100`} fill={`url(#grad-${color})`} />
      {data.map((val, i) => {
         const x = (i / (data.length - 1)) * 100;
         const y = 100 - ((val - min) / (max - min)) * 80 - 10;
         return <circle key={i} cx={x} cy={y} r="1.5" fill="white" />
      })}
    </svg>
  );
}

const DonutChart = ({ data }) => {
  // data: { label, value, color }[]
  const total = data.reduce((a, b) => a + b.value, 0);
  let cumulative = 0;
  
  return (
    <div className="flex items-center gap-4 h-full">
      <div className="relative w-24 h-24 flex-shrink-0">
        <svg viewBox="0 0 36 36" className="w-full h-full rotate-[-90deg]">
           {data.map((item, i) => {
             const dashArray = `${(item.value / total) * 100} 100`;
             const offset = -cumulative;
             cumulative += (item.value / total) * 100;
             return (
               <circle
                 key={i}
                 cx="18" cy="18" r="15.9"
                 fill="none"
                 stroke={item.color}
                 strokeWidth="3"
                 strokeDasharray={dashArray}
                 strokeDashoffset={offset}
                 className="transition-all duration-1000 ease-out"
               />
             )
           })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
           <span className="text-[8px] text-gray-400">TOTAL</span>
           <span className="text-xs font-bold text-white">100%</span>
        </div>
      </div>
      <div className="flex-1 space-y-1">
        {data.map((item, i) => (
          <div key={i} className="flex items-center justify-between text-[10px]">
             <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
               <span className="text-gray-300">{item.label}</span>
             </div>
             <span className="font-mono">{Math.round((item.value/total)*100)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const BarChart = ({ data, color }) => {
   const max = Math.max(...data.map(d => d.value));
   return (
     <div className="flex flex-col justify-between h-full gap-2">
       {data.map((d, i) => (
         <div key={i} className="flex items-center gap-2 text-[10px]">
           <span className="w-8 text-gray-400 truncate text-right">{d.label}</span>
           <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${(d.value / max) * 100}%` }}
               className="h-full rounded-full"
               style={{ backgroundColor: color }}
             />
           </div>
           <span className="w-8 font-mono">{d.value}</span>
         </div>
       ))}
     </div>
   )
}

const VideoModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <button 
        onClick={onClose} 
        className="absolute top-6 right-6 text-white/50 hover:text-[var(--theme-color)] transition-colors"
      >
        <X size={32} />
      </button>
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden border border-[var(--theme-color)]/30 shadow-[0_0_50px_rgba(var(--theme-rgb),0.15)]"
      >
        <iframe 
          className="w-full h-full"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1" 
          title="CHUMA Music Video" 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
        ></iframe>
      </motion.div>
    </div>
  );
};

const AuthModal = ({ isOpen, onClose, onLogin }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock Authentication delay
    setTimeout(() => {
        const isAdmin = email.includes('admin') || email === 'chuma@official.com';
        const userData = {
            name: mode === 'register' ? name : (isAdmin ? 'Chuma (Admin)' : 'Fan'),
            role: isAdmin ? 'admin' : 'user',
            email
        };
        onLogin(userData);
        showToast(isAdmin ? "WELCOME BACK, BOSS" : `WELCOME TO THE TRIBE, ${userData.name.toUpperCase()}`);
    }, 800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
        >
            {/* Backdrop click to close */}
            <div className="absolute inset-0" onClick={onClose} />
            
            <button onClick={onClose} className="absolute top-6 right-6 text-white/50 hover:text-[var(--theme-color)] transition-colors z-50 pointer-events-auto">
                <X size={32} />
            </button>
            
            <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="w-full max-w-md bg-black/80 border border-[var(--theme-color)]/30 p-8 rounded-2xl relative overflow-hidden shadow-[0_0_40px_rgba(var(--theme-rgb),0.2)] z-10 pointer-events-auto"
                onClick={e => e.stopPropagation()}
            >
                {/* Decorative Neon Line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--theme-color)] to-transparent" />
                
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-brand font-bold text-white tracking-wider mb-2">
                        {mode === 'login' ? 'WELCOME BACK' : 'JOIN THE TRIBE'}
                    </h2>
                    <p className="text-xs text-gray-400 tracking-widest uppercase">
                        {mode === 'login' ? 'ACCESS YOUR DASHBOARD' : 'UNLOCK EXCLUSIVE CONTENT'}
                    </p>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    {mode === 'register' && (
                        <div className="relative group">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[var(--theme-color)]" size={16} />
                            <input 
                                placeholder="NAME" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full bg-black/50 border border-white/10 rounded p-3 pl-10 text-sm focus:border-[var(--theme-color)] outline-none text-white transition-colors placeholder:text-gray-600 font-mono" 
                            />
                        </div>
                    )}
                    <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[var(--theme-color)]" size={16} />
                        <input 
                            placeholder="EMAIL ADDRESS" 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-black/50 border border-white/10 rounded p-3 pl-10 text-sm focus:border-[var(--theme-color)] outline-none text-white transition-colors placeholder:text-gray-600 font-mono" 
                        />
                    </div>
                    <div className="relative group">
                        <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[var(--theme-color)]" size={16} />
                        <input 
                            placeholder="PASSWORD" 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-black/50 border border-white/10 rounded p-3 pl-10 text-sm focus:border-[var(--theme-color)] outline-none text-white transition-colors placeholder:text-gray-600 font-mono" 
                        />
                    </div>
                    
                    <button type="submit" className="w-full py-3 bg-[var(--theme-color)] text-black font-bold font-brand tracking-widest hover:bg-white transition-colors mt-6 clip-path-slant" style={{ clipPath: 'polygon(5% 0, 100% 0, 95% 100%, 0% 100%)' }}>
                        {mode === 'login' ? 'ENTER' : 'REGISTER'}
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-white/5 pt-4">
                    <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-xs text-gray-400 hover:text-[var(--theme-color)] tracking-widest transition-colors">
                        {mode === 'login' ? "NEW HERE? CREATE ACCOUNT" : "ALREADY HAVE AN ACCOUNT? LOGIN"}
                    </button>
                </div>
                
                {/* Helpful hint for demo purposes */}
                <div className="absolute bottom-1 left-0 w-full text-center opacity-20 hover:opacity-100 transition-opacity">
                    <span className="text-[8px] text-gray-500 cursor-help" title="Use an email with 'admin' to test the dashboard">Test Hint: use 'admin' in email for dashboard</span>
                </div>
            </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const CartSidebar = ({ isOpen, onClose, cart, updateQuantity, removeFromCart, clearCart, onCheckoutSuccess }) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);
  const { showToast } = useToast();
  
  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setCheckedOut(true);
      onCheckoutSuccess(); // Trigger confetti
      clearCart();
      showToast("ORDER SUCCESSFUL");
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-black/90 border-l border-white/10 z-[70] flex flex-col shadow-2xl shadow-[var(--theme-color)]/20"
          >
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-xl font-brand tracking-widest text-[var(--theme-color)]">YOUR STASH</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 && !checkedOut ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                   <ShoppingBag size={48} className="mb-4 opacity-20" />
                   <p>YOUR CART IS EMPTY</p>
                </div>
              ) : checkedOut ? (
                <div className="flex flex-col items-center justify-center h-full text-[var(--theme-color)]">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-[var(--theme-color)] rounded-full flex items-center justify-center text-black mb-6"
                  >
                    <Check size={40} />
                  </motion.div>
                  <h3 className="text-2xl font-brand mb-2">ORDER CONFIRMED</h3>
                  <p className="text-gray-400 text-center text-sm max-w-xs">
                    Thank you for supporting CHUMA. Check your email for download links and tracking info.
                  </p>
                </div>
              ) : (
                cart.map((item) => (
                  <motion.div 
                    layout
                    key={item.id} 
                    className="flex gap-4 bg-white/5 p-3 rounded-lg border border-white/5"
                  >
                    <img src={item.img} className="w-20 h-20 object-cover rounded bg-gray-800" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-sm leading-tight mb-1">{item.name}</h4>
                        <p className="text-xs text-gray-400">{item.type}</p>
                      </div>
                      <div className="flex justify-between items-end">
                        <span className="text-[var(--theme-color)] font-mono">${item.price}</span>
                        <div className="flex items-center gap-3 bg-black/50 rounded-full px-2 py-1 border border-white/10">
                           <button onClick={() => updateQuantity(item.id, -1)} className="hover:text-[var(--theme-color)]"><Minus size={12}/></button>
                           <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                           <button onClick={() => updateQuantity(item.id, 1)} className="hover:text-[var(--theme-color)]"><Plus size={12}/></button>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-gray-600 hover:text-red-500 self-start">
                      <X size={16} />
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {!checkedOut && cart.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-black/50">
                <div className="flex justify-between items-center mb-6">
                   <span className="text-gray-400 text-sm tracking-widest">TOTAL</span>
                   <span className="text-2xl font-brand text-[var(--theme-color)]">${total}</span>
                </div>
                <button 
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full py-4 bg-[var(--theme-color)] hover:bg-white text-black font-bold font-brand tracking-widest flex items-center justify-center gap-2 transition-all"
                >
                  {isCheckingOut ? (
                    <span className="animate-pulse">PROCESSING...</span>
                  ) : (
                    <>
                      <CreditCard size={18} /> CHECKOUT
                    </>
                  )}
                </button>
                <p className="text-[10px] text-center text-gray-600 mt-3 flex items-center justify-center gap-2">
                  SECURED BY FLUTTERWAVE & STRIPE <Shield size={10} />
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const MinimalCatalogue = ({ tracks }) => {
  return (
    <div className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col gap-4 pointer-events-auto">
      <h4 className="text-[10px] font-brand tracking-widest text-white/30 -rotate-90 absolute -right-12 top-1/2 w-32 text-center">
        RECENT DROPS
      </h4>
      {tracks.slice(0, 3).map((track, i) => (
        <div key={i} className="group relative flex items-center justify-end">
          <div className="absolute right-14 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0 text-right">
            <p className="text-sm font-bold text-[var(--theme-color)] whitespace-nowrap">{track.title}</p>
            <p className="text-[10px] text-gray-400">{track.type}</p>
          </div>
          
          <div className="w-12 h-12 bg-white/5 backdrop-blur-sm border border-white/10 rounded hover:bg-[var(--theme-color)] hover:border-[var(--theme-color)] transition-all duration-300 cursor-pointer flex items-center justify-center group-hover:scale-110">
            <span className="text-[10px] font-mono text-white/50 group-hover:text-black">
              {i === 0 ? <Music size={16} /> : i === 1 ? <Disc size={16} /> : <Mic2 size={16} />}
            </span>
          </div>
        </div>
      ))}
      <div className="w-[1px] h-24 bg-gradient-to-b from-transparent via-white/10 to-transparent self-center mt-4"></div>
    </div>
  );
};

const WallOfFame = ({ images, isAdmin, onAdd, onRemove }) => {
  return (
    <div className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 flex-col gap-4 pointer-events-auto z-20">
      <h4 className="text-[10px] font-brand tracking-widest text-white/30 -rotate-90 absolute -left-10 top-1/2 w-32 text-center">
        WALL OF FAME
      </h4>
      
      <div className="flex flex-col -space-y-12 hover:space-y-2 transition-all duration-500 pb-4">
        {images.map((img, i) => (
          <motion.div
            key={img.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 }}
            whileHover={{ scale: 1.2, zIndex: 50, rotate: i % 2 === 0 ? 2 : -2 }}
            className="relative group w-20 h-28 bg-gray-900 border border-white/10 rounded-lg overflow-hidden shadow-2xl transform transition-all origin-left"
          >
            <img 
              src={img.src} 
              className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500 grayscale group-hover:grayscale-0" 
              alt={img.caption}
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
               <span className="text-[8px] font-brand text-[var(--theme-color)] tracking-widest truncate">{img.caption}</span>
            </div>

            {isAdmin && (
              <button 
                onClick={(e) => { e.stopPropagation(); onRemove(img.id); }}
                className="absolute top-1 right-1 bg-red-600/90 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
              >
                <Trash2 size={8} />
              </button>
            )}
          </motion.div>
        ))}
      </div>

      {isAdmin && (
        <button 
          onClick={onAdd}
          className="w-8 h-8 rounded-full bg-[var(--theme-color)]/20 text-[var(--theme-color)] border border-[var(--theme-color)] flex items-center justify-center hover:bg-[var(--theme-color)] hover:text-black transition-all self-center"
          title="Add Image to Wall"
        >
          <Plus size={16} />
        </button>
      )}
    </div>
  )
}

const Navigation = ({ active, setActive, user, onHover }) => {
  const navItems = [
    { id: 'hero', icon: User, label: 'HOME' },
    { id: 'music', icon: Music, label: 'MUSIC' },
    { id: 'events', icon: Calendar, label: 'TOUR' },
    { id: 'merch', icon: ShoppingBag, label: 'STORE' },
    { id: 'favorites', icon: Heart, label: 'FAVS' },
    { id: 'contact', icon: Mail, label: 'CONTACT' },
  ];

  if (user?.role === 'admin') {
    navItems.push({ id: 'admin', icon: Shield, label: 'ADMIN' });
  }

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-[98%] max-w-lg">
      <div className="flex items-center justify-evenly px-2 py-3 md:px-6 md:py-4 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-full shadow-2xl shadow-purple-900/20">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            onMouseEnter={() => onHover(item.id)}
            onMouseLeave={() => onHover(null)}
            className={`relative flex flex-col items-center justify-center transition-all duration-300 p-1 ${
              active === item.id ? 'text-[var(--theme-color)] scale-110' : 'text-gray-400 hover:text-white'
            }`}
          >
            <item.icon className="w-5 h-5 md:w-5 md:h-5 mb-1" strokeWidth={active === item.id ? 2.5 : 2} fill={active === item.id && item.id === 'favorites' ? 'var(--theme-color)' : 'none'} />
            <span className="text-[8px] md:text-[8px] font-brand tracking-widest opacity-80 hidden sm:block">
              <ScrambleText text={item.label} className="" active={active === item.id} />
            </span>
            {active === item.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute -bottom-2 w-1 h-1 bg-[var(--theme-color)] rounded-full"
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

const HeroContent = ({ onExplore, tracks, wallImages, isAdmin, onWallImageAdd, onWallImageRemove }) => {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <>
      <VideoModal isOpen={showVideo} onClose={() => setShowVideo(false)} />
      <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-end pb-[15vh] z-10">
        <div className="text-center">
          <div className="pointer-events-auto flex flex-col items-center gap-4 mt-12">
            <div className="flex gap-4">
              <button 
                onClick={onExplore}
                className="px-8 py-3 bg-[var(--theme-color)] text-black font-bold font-brand tracking-widest hover:bg-white transition-colors clip-path-slant"
                style={{ clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0% 100%)' }}
              >
                STREAM NOW
              </button>
              <button 
                onClick={() => setShowVideo(true)}
                className="px-8 py-3 border border-[var(--theme-color)] text-[var(--theme-color)] font-bold font-brand tracking-widest hover:bg-[var(--theme-color)]/10 transition-colors clip-path-slant"
                style={{ clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0% 100%)' }}
              >
                WATCH VIDEO
              </button>
            </div>
            <div className="mt-8">
                <h2 className="text-xs md:text-sm font-light tracking-[0.8em] text-[var(--theme-color)] animate-pulse">
                    THE SOUND OF THE FUTURE
                </h2>
            </div>
          </div>
        </div>
      </div>
      <MinimalCatalogue tracks={tracks} />
      <WallOfFame 
        images={wallImages} 
        isAdmin={isAdmin} 
        onAdd={onWallImageAdd} 
        onRemove={onWallImageRemove} 
      />
    </>
  );
};

const MusicSection = ({ tracks, toggleFavorite, favorites, isPlayingId, setIsPlayingId }) => {
  const { showToast } = useToast();

  const handleShare = (title) => {
    navigator.clipboard.writeText(`Listen to ${title} by CHUMA!`);
    showToast("LINK COPIED TO CLIPBOARD");
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-end px-4 md:px-20 z-10 pt-20 md:pt-0">
      <div className="w-full max-w-md bg-black/30 backdrop-blur-md p-6 rounded-2xl border border-white/5 pointer-events-auto max-h-[70vh] overflow-y-auto">
        <h3 className="text-3xl font-brand text-[var(--theme-color)] mb-6">LATEST RELEASES</h3>
        <div className="space-y-4">
          {tracks.map((track, idx) => (
            <div key={idx} className="group flex items-center justify-between p-3 hover:bg-white/5 rounded-lg transition-colors cursor-pointer border-b border-white/5" onClick={() => window.open(track.link, '_blank')}>
              <div className="flex items-center gap-4">
                <span className="text-gray-500 font-mono text-sm">{idx + 1}</span>
                <div>
                  <h4 className="font-bold group-hover:text-[var(--theme-color)] transition-colors">{track.title}</h4>
                  <p className="text-xs text-gray-400">{track.plays} PLAYS • {track.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={(e) => { e.stopPropagation(); handleShare(track.title); }}
                  className="text-gray-500 hover:text-white transition-colors"
                  title="Share"
                >
                  <Share2 size={14} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleFavorite('tracks', track.id); }}
                  className={`text-gray-400 hover:text-[var(--theme-color)] transition-colors ${favorites?.includes(track.id) ? 'text-[var(--theme-color)]' : ''}`}
                >
                  <Heart size={16} fill={favorites?.includes(track.id) ? "var(--theme-color)" : "none"} />
                </button>
                <span className="text-xs text-gray-500">{track.duration}</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsPlayingId(isPlayingId === track.id ? null : track.id); }}
                  className="w-8 h-8 rounded-full bg-[var(--theme-color)] text-black flex items-center justify-center hover:scale-110 transition-transform relative"
                >
                  {isPlayingId === track.id ? <Pause size={14} fill="black" /> : <Play size={14} fill="black" />}
                </button>
                {isPlayingId === track.id && <Waveform isPlaying={true} />}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-between items-center pt-4 border-t border-white/10">
          <span className="text-xs text-gray-400 tracking-widest">AVAILABLE ON ALL PLATFORMS</span>
          <div className="flex gap-2 text-[var(--theme-color)]">
            <ExternalLink size={16} />
          </div>
        </div>
      </div>
    </div>
  );
};

const EventsSection = ({ tourDates }) => {
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-start px-4 md:px-20 z-10 pt-20 md:pt-0">
      <div className="w-full max-w-md bg-black/30 backdrop-blur-md p-6 rounded-2xl border border-white/5 pointer-events-auto">
        <h3 className="text-3xl font-brand text-[var(--theme-color)] mb-6">WORLD TOUR</h3>
        <div className="space-y-6">
          {tourDates.map((tour, idx) => (
            <div key={idx} className="relative flex items-center gap-6 p-4 border border-white/10 rounded-lg hover:border-[var(--theme-color)]/50 transition-colors group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--theme-color)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="text-center min-w-[60px]">
                <span className="block text-2xl font-bold text-[var(--theme-color)] font-brand">{tour.date.split(' ')[1]}</span>
                <span className="block text-xs font-bold text-gray-400">{tour.date.split(' ')[0]}</span>
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-bold font-brand leading-none mb-1">{tour.city}</h4>
                <p className="text-sm text-gray-400">{tour.venue}, {tour.country}</p>
              </div>
              <button className="px-4 py-2 bg-white/10 hover:bg-[var(--theme-color)] hover:text-black transition-colors rounded text-xs font-bold tracking-wider">
                TICKETS
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MerchSection = ({ merch, addToCart, toggleFavorite, favorites }) => {
  const [filter, setFilter] = useState('all');

  const categories = [
    { id: 'all', label: 'ALL' },
    { id: 'merch', label: 'MERCH' },
    { id: 'beats', label: 'BEATS' },
    { id: 'sounds', label: 'PACKS' },
  ];

  const filteredMerch = filter === 'all' 
    ? merch 
    : merch.filter(item => item.category === filter);

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10 pt-20">
      <div className="w-full max-w-5xl px-4 pointer-events-auto flex flex-col h-[80vh]">
        
        <div className="flex justify-center gap-8 mb-8 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`text-sm font-bold tracking-widest transition-colors relative pb-2 whitespace-nowrap ${
                filter === cat.id ? 'text-[var(--theme-color)]' : 'text-gray-500 hover:text-white'
              }`}
            >
              {cat.label}
              {filter === cat.id && (
                <motion.div 
                  layoutId="catUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--theme-color)]" 
                />
              )}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 overflow-y-auto pb-24 pr-2 custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {filteredMerch.map(item => (
              <TiltCard key={item.id}>
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1 }}
                  className="bg-black/50 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden group hover:border-[var(--theme-color)]/50 transition-all"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-2 right-2">
                       <button 
                          onClick={() => toggleFavorite('merch', item.id)}
                          className={`p-2 rounded-full backdrop-blur-sm ${favorites?.includes(item.id) ? 'bg-[var(--theme-color)] text-black' : 'bg-black/30 text-white hover:bg-white hover:text-black'}`}
                        >
                         <Heart size={14} fill={favorites?.includes(item.id) ? "black" : "none"} />
                       </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                       <h3 className="font-bold text-lg leading-tight font-brand">{item.name}</h3>
                       <span className="text-[var(--theme-color)] font-mono font-bold">${item.price}</span>
                    </div>
                    <p className="text-xs text-gray-400 mb-4">{item.type}</p>
                    <button 
                      onClick={() => addToCart(item)}
                      className="w-full py-2 bg-white/5 hover:bg-[var(--theme-color)] hover:text-black text-white border border-white/10 transition-all rounded font-bold tracking-wider flex items-center justify-center gap-2 text-xs"
                    >
                      <ShoppingBag size={14} /> ADD TO CART
                    </button>
                  </div>
                </motion.div>
              </TiltCard>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const FavoritesSection = ({ tracks, merch, favorites, addToCart }) => {
  const favTracks = tracks.filter(t => favorites.tracks.includes(t.id));
  const favMerch = merch.filter(m => favorites.merch.includes(m.id));

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10 pt-20">
      <div className="w-full max-w-4xl px-4 pointer-events-auto h-[70vh] overflow-y-auto bg-black/40 backdrop-blur-md rounded-2xl border border-white/5 p-8">
        <h2 className="text-3xl font-brand text-[var(--theme-color)] mb-8 flex items-center gap-3">
          <Heart fill="var(--theme-color)" /> YOUR FAVORITES
        </h2>
        
        {favTracks.length > 0 && (
          <div className="mb-10">
            <h3 className="text-xl text-white mb-4 font-brand tracking-widest border-b border-white/10 pb-2">TRACKS</h3>
            <div className="grid gap-2">
              {favTracks.map(t => (
                <div key={t.id} className="flex justify-between items-center p-3 bg-white/5 rounded border border-white/5">
                  <span className="font-bold">{t.title}</span>
                  <ExternalLink size={16} className="text-[var(--theme-color)]" />
                </div>
              ))}
            </div>
          </div>
        )}

        {favMerch.length > 0 && (
          <div>
            <h3 className="text-xl text-white mb-4 font-brand tracking-widest border-b border-white/10 pb-2">MERCH</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {favMerch.map(m => (
                <div key={m.id} className="bg-white/5 rounded p-3 border border-white/5">
                   <img src={m.img} className="w-full h-32 object-cover rounded mb-2" />
                   <h4 className="font-bold text-sm mb-1">{m.name}</h4>
                   <div className="flex justify-between items-center">
                     <span className="text-[var(--theme-color)] text-xs">${m.price}</span>
                     <button onClick={() => addToCart(m)} className="text-[10px] bg-white/10 hover:bg-[var(--theme-color)] hover:text-black px-2 py-1 rounded">
                       ADD
                     </button>
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {favTracks.length === 0 && favMerch.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 text-gray-500">
            <Heart size={48} className="mb-4 opacity-20" />
            <p>NO FAVORITES YET</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ContactSection = () => {
  const { showToast } = useToast();
  const handleSubmit = (e) => {
    e.preventDefault();
    showToast("MESSAGE SENT SUCCESSFULLY");
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10 pt-20">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 px-4 pointer-events-auto">
        <div className="bg-black/40 backdrop-blur-md p-8 rounded-2xl border border-white/10">
          <h3 className="text-2xl font-brand text-[var(--theme-color)] mb-6">GET IN TOUCH</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1">NAME</label>
              <input required type="text" className="w-full bg-black/50 border border-white/10 rounded p-3 text-sm focus:border-[var(--theme-color)] outline-none text-white" />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">EMAIL</label>
              <input required type="email" className="w-full bg-black/50 border border-white/10 rounded p-3 text-sm focus:border-[var(--theme-color)] outline-none text-white" />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">SUBJECT</label>
              <select className="w-full bg-black/50 border border-white/10 rounded p-3 text-sm focus:border-[var(--theme-color)] outline-none text-white">
                <option>BOOKING</option>
                <option>PRESS / INTERVIEW</option>
                <option>COLLABORATION</option>
                <option>FAN LOVE</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">MESSAGE</label>
              <textarea required rows={4} className="w-full bg-black/50 border border-white/10 rounded p-3 text-sm focus:border-[var(--theme-color)] outline-none text-white"></textarea>
            </div>
            <button type="submit" className="w-full py-3 bg-[var(--theme-color)] text-black font-bold font-brand tracking-widest hover:bg-white transition-colors">
              SEND MESSAGE
            </button>
          </form>
        </div>
        
        <div className="space-y-4 text-center md:text-left">
           <div className="bg-black/40 backdrop-blur-md p-8 rounded-2xl border border-white/10 h-full flex flex-col justify-center">
              <h3 className="text-xl font-brand text-white mb-6">MANAGEMENT</h3>
              <div className="space-y-4 text-gray-400 text-sm">
                <p><strong className="text-white block mb-1">BOOKINGS</strong> bookings@chuma-official.com</p>
                <p><strong className="text-white block mb-1">PRESS</strong> press@chuma-official.com</p>
                <p><strong className="text-white block mb-1">LABEL</strong> Universal Music Africa</p>
              </div>
              
              <div className="mt-8 flex gap-4 justify-center md:justify-start">
                {['INSTAGRAM', 'TWITTER', 'SPOTIFY', 'YOUTUBE'].map(social => (
                   <button key={social} className="text-[10px] border border-white/20 px-3 py-1 rounded-full hover:bg-[var(--theme-color)] hover:text-black hover:border-[var(--theme-color)] transition-all">
                     {social}
                   </button>
                ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const AdminSection = ({ user, onLogout, tracks, onAddTrack, onRemoveTrack, merch, onAddMerch, onRemoveMerch }) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'content'>('analytics');
  const { showToast } = useToast();

  // Data for charts
  const streamData = [12, 45, 32, 60, 55, 85, 70];
  const revData = [
    { label: 'MERCH', value: 45, color: '#D4AF37' },
    { label: 'TICKETS', value: 30, color: '#FFFFFF' },
    { label: 'MUSIC', value: 25, color: '#333333' },
  ];
  const platformData = [
    { label: 'SPOTIFY', value: 55, color: '#1DB954' },
    { label: 'APPLE', value: 30, color: '#FC3C44' },
    { label: 'YOUTUBE', value: 15, color: '#FF0000' },
  ];
  const cityData = [
    { label: 'LAGOS', value: 85 },
    { label: 'LONDON', value: 65 },
    { label: 'NYC', value: 45 },
    { label: 'ACCRA', value: 30 },
  ];
  const growthData = [10, 15, 12, 20, 25, 35, 40];

  // Form State
  const [trackForm, setTrackForm] = useState({ title: "", duration: "", type: "Single" });
  const [merchForm, setMerchForm] = useState({ name: "", price: "", type: "Apparel", category: "merch", img: "https://images.unsplash.com/photo-1556906781-9a412961d289?auto=format&fit=crop&w=500&q=60" });

  const handleTrackSubmit = (e) => {
      e.preventDefault();
      onAddTrack(trackForm);
      setTrackForm({ title: "", duration: "", type: "Single" });
      showToast("TRACK ADDED");
  };

  const handleMerchSubmit = (e) => {
      e.preventDefault();
      onAddMerch(merchForm);
      setMerchForm({ ...merchForm, name: "", price: "", img: "https://images.unsplash.com/photo-1556906781-9a412961d289?auto=format&fit=crop&w=500&q=60" });
      showToast("PRODUCT ADDED");
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col z-10 pt-24 pb-20 px-4 md:px-8 overflow-y-auto md:overflow-hidden">
      <div className="w-full flex justify-between items-start pointer-events-auto mb-4">
         <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-6 flex flex-col md:flex-row gap-6 shadow-2xl w-full md:w-auto">
            <div>
              <h2 className="text-3xl font-brand text-[var(--theme-color)]">COMMAND CENTER</h2>
              <p className="text-xs text-gray-500">WELCOME BACK, {user?.name}</p>
            </div>
            <div className="h-px w-full md:h-12 md:w-[1px] bg-white/10" />
            
            <div className="flex gap-4">
                <button 
                    onClick={() => setActiveTab('analytics')}
                    className={`px-4 py-2 rounded flex items-center gap-2 text-sm font-bold tracking-wider transition-colors ${activeTab === 'analytics' ? 'bg-[var(--theme-color)] text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                >
                    <LayoutDashboard size={16} /> ANALYTICS
                </button>
                 <button 
                    onClick={() => setActiveTab('content')}
                    className={`px-4 py-2 rounded flex items-center gap-2 text-sm font-bold tracking-wider transition-colors ${activeTab === 'content' ? 'bg-[var(--theme-color)] text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                >
                    <Database size={16} /> CMS
                </button>
            </div>
         </div>

         <button onClick={onLogout} className="bg-red-900/20 text-red-500 border border-red-900/50 px-4 py-2 rounded hover:bg-red-900 hover:text-white transition-colors flex items-center gap-2">
            <LogOut size={16} /> LOGOUT
         </button>
      </div>

      {/* ANALYTICS TAB */}
      {activeTab === 'analytics' && (
          <>
            <div className="flex-1 relative hidden md:block">
                {/* Left Panel */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-64 space-y-4 pointer-events-auto">
                    <DashboardCard title="STREAM VELOCITY">
                    <LineChart data={streamData} color="var(--theme-color)" />
                    <p className="text-[10px] text-right mt-1 text-gray-400">+24% vs last week</p>
                    </DashboardCard>
                    <DashboardCard title="REVENUE SOURCE">
                    <DonutChart data={revData} />
                    </DashboardCard>
                </div>

                {/* Right Panel */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 space-y-4 pointer-events-auto">
                    <DashboardCard title="PLATFORM SHARE">
                    <DonutChart data={platformData} />
                    </DashboardCard>
                    <DashboardCard title="LISTENER GROWTH">
                    <LineChart data={growthData} color="#ffffff" />
                    <p className="text-[10px] text-right mt-1 text-gray-400">+1.2k new users</p>
                    </DashboardCard>
                </div>
            </div>

            <div className="h-auto md:h-40 w-full grid grid-cols-1 md:grid-cols-3 gap-4 pointer-events-auto mt-4 md:mt-0">
                <DashboardCard title="TOP TERRITORIES">
                    <BarChart data={cityData} color="var(--theme-color)" />
                </DashboardCard>
                
                <DashboardCard title="SYSTEM LOAD">
                    <div className="flex items-end justify-between h-full gap-1 pb-2">
                    {[40, 70, 30, 85, 50, 60, 45, 90, 55, 30].map((h, i) => (
                        <div key={i} className="w-full bg-gray-800 rounded-t relative overflow-hidden h-full">
                            <motion.div 
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                transition={{ delay: i*0.05 }}
                                className="absolute bottom-0 w-full bg-[var(--theme-color)] opacity-50"
                            />
                        </div>
                    ))}
                    </div>
                    <p className="text-[10px] text-center text-gray-400">SERVER HEARTBEAT</p>
                </DashboardCard>

                <DashboardCard title="RETENTION COHORTS">
                    <svg viewBox="0 0 100 50" className="w-full h-full">
                    <path d="M0,50 Q25,40 50,45 T100,20 L100,50 L0,50" fill="white" fillOpacity="0.1" />
                    <path d="M0,50 Q25,30 50,35 T100,10 L100,50 L0,50" fill="var(--theme-color)" fillOpacity="0.2" />
                    </svg>
                    <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                    <span>WEEK 1</span>
                    <span>WEEK 4</span>
                    </div>
                </DashboardCard>
            </div>
          </>
      )}

      {/* CONTENT MANAGEMENT TAB */}
      {activeTab === 'content' && (
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 pointer-events-auto overflow-y-auto p-1">
             {/* Music Manager */}
             <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-6 flex flex-col h-full">
                 <h3 className="text-xl font-brand text-white mb-4 flex items-center gap-2">
                     <Music size={20} className="text-[var(--theme-color)]" /> MUSIC MANAGER
                 </h3>
                 
                 {/* Add Track Form */}
                 <form onSubmit={handleTrackSubmit} className="bg-white/5 p-4 rounded-lg mb-6 border border-white/5">
                     <h4 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-widest">ADD NEW RELEASE</h4>
                     <div className="grid grid-cols-2 gap-3 mb-3">
                         <input 
                            required
                            placeholder="Title" 
                            value={trackForm.title} 
                            onChange={e => setTrackForm({...trackForm, title: e.target.value})}
                            className="bg-black/50 border border-white/10 rounded p-2 text-sm text-white outline-none focus:border-[var(--theme-color)]"
                         />
                         <input 
                            required
                            placeholder="Duration (e.g. 3:45)" 
                            value={trackForm.duration} 
                            onChange={e => setTrackForm({...trackForm, duration: e.target.value})}
                            className="bg-black/50 border border-white/10 rounded p-2 text-sm text-white outline-none focus:border-[var(--theme-color)]"
                         />
                         <select 
                            value={trackForm.type}
                            onChange={e => setTrackForm({...trackForm, type: e.target.value})}
                            className="bg-black/50 border border-white/10 rounded p-2 text-sm text-white outline-none focus:border-[var(--theme-color)] col-span-2"
                         >
                             <option value="Single">Single</option>
                             <option value="EP">EP</option>
                             <option value="Album">Album</option>
                         </select>
                     </div>
                     <button type="submit" className="w-full py-2 bg-[var(--theme-color)] text-black font-bold text-xs rounded hover:bg-white transition-colors">
                         ADD TRACK
                     </button>
                 </form>

                 {/* Track List */}
                 <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                     {tracks.map((track) => (
                         <div key={track.id} className="flex items-center justify-between p-3 bg-white/5 rounded border border-white/5 hover:border-white/20">
                             <div>
                                 <p className="font-bold text-sm text-white">{track.title}</p>
                                 <p className="text-xs text-gray-500">{track.type} • {track.duration}</p>
                             </div>
                             <button 
                                onClick={() => onRemoveTrack(track.id)}
                                className="p-2 text-red-500 hover:bg-red-500/20 rounded-full transition-colors"
                             >
                                 <Trash2 size={14} />
                             </button>
                         </div>
                     ))}
                 </div>
             </div>

             {/* Store Manager */}
             <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-6 flex flex-col h-full">
                 <h3 className="text-xl font-brand text-white mb-4 flex items-center gap-2">
                     <ShoppingBag size={20} className="text-[var(--theme-color)]" /> STORE MANAGER
                 </h3>
                 
                 {/* Add Merch Form */}
                 <form onSubmit={handleMerchSubmit} className="bg-white/5 p-4 rounded-lg mb-6 border border-white/5">
                     <h4 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-widest">ADD NEW PRODUCT</h4>
                     <div className="grid grid-cols-2 gap-3 mb-3">
                         <input 
                            required
                            placeholder="Item Name" 
                            value={merchForm.name} 
                            onChange={e => setMerchForm({...merchForm, name: e.target.value})}
                            className="bg-black/50 border border-white/10 rounded p-2 text-sm text-white outline-none focus:border-[var(--theme-color)] col-span-2"
                         />
                         <input 
                            required
                            type="number"
                            placeholder="Price ($)" 
                            value={merchForm.price} 
                            onChange={e => setMerchForm({...merchForm, price: e.target.value})}
                            className="bg-black/50 border border-white/10 rounded p-2 text-sm text-white outline-none focus:border-[var(--theme-color)]"
                         />
                         <select 
                            value={merchForm.category}
                            onChange={e => setMerchForm({...merchForm, category: e.target.value})}
                            className="bg-black/50 border border-white/10 rounded p-2 text-sm text-white outline-none focus:border-[var(--theme-color)]"
                         >
                             <option value="merch">Merch</option>
                             <option value="beats">Beats</option>
                             <option value="sounds">Sound Packs</option>
                         </select>
                         <input 
                             placeholder="Image URL (optional)" 
                             value={merchForm.img} 
                             onChange={e => setMerchForm({...merchForm, img: e.target.value})}
                             className="bg-black/50 border border-white/10 rounded p-2 text-sm text-white outline-none focus:border-[var(--theme-color)] col-span-2"
                         />
                     </div>
                     <button type="submit" className="w-full py-2 bg-[var(--theme-color)] text-black font-bold text-xs rounded hover:bg-white transition-colors">
                         ADD PRODUCT
                     </button>
                 </form>

                 {/* Merch List */}
                 <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                     {merch.map((item) => (
                         <div key={item.id} className="flex items-center justify-between p-3 bg-white/5 rounded border border-white/5 hover:border-white/20">
                             <div className="flex items-center gap-3">
                                 <img src={item.img} className="w-10 h-10 rounded bg-gray-800 object-cover" />
                                 <div>
                                    <p className="font-bold text-sm text-white">{item.name}</p>
                                    <p className="text-xs text-gray-500 capitalize">{item.category} • ${item.price}</p>
                                 </div>
                             </div>
                             <button 
                                onClick={() => onRemoveMerch(item.id)}
                                className="p-2 text-red-500 hover:bg-red-500/20 rounded-full transition-colors"
                             >
                                 <Trash2 size={14} />
                             </button>
                         </div>
                     ))}
                 </div>
             </div>
          </div>
      )}
    </div>
  )
}

// --- MAIN APP COMPONENT ---

function App() {
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('hero');
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState({ tracks: [], merch: [] });
  const [user, setUser] = useState(null); // { name: 'Admin', role: 'admin' }
  const [wallImages, setWallImages] = useState(INITIAL_WALL_IMAGES);
  const [isPlayingId, setIsPlayingId] = useState(null);
  const [hoveredNav, setHoveredNav] = useState(null);

  // Content State (Lifted for Admin CMS)
  const [tracks, setTracks] = useState(INITIAL_TRACKS);
  const [merch, setMerch] = useState(INITIAL_MERCH);

  // Modes
  const [theme, setTheme] = useState('gold'); // gold | red
  const [arMode, setArMode] = useState(false);
  const [matrixMode, setMatrixMode] = useState(false);
  const [vibe, setVibe] = useState('chill'); // chill | fire
  const [weather, setWeather] = useState('clear'); // clear | rain | dust

  // Theme config
  const themeColors = {
      gold: { hex: '#D4AF37', rgb: '212, 175, 55' },
      red: { hex: '#FF3333', rgb: '255, 51, 51' } // Neon Red
  };
  const currentTheme = themeColors[theme];

  const toggleTheme = () => {
      setTheme(prev => prev === 'gold' ? 'red' : 'gold');
      // Optionally sync vibe if desired, but user asked for manual toggle
      if (theme === 'gold') setVibe('fire'); // Switch to more intense vibe with red
      else setVibe('chill');
  };

  // Admin Login Mock (Keep as dev backdoor)
  useEffect(() => {
    const handleKey = (e) => {
      if (e.ctrlKey && e.key === 'm') {
        setUser(prev => prev ? null : { name: 'Chuma', role: 'admin' });
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleLogin = (userData) => {
      setUser(userData);
      setAuthOpen(false);
  };

  const addToCart = (item) => {
    setCart(prev => {
      const exist = prev.find(i => i.id === item.id);
      if (exist) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));
  
  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
       if (item.id === id) {
         const newQ = item.quantity + delta;
         return newQ > 0 ? { ...item, quantity: newQ } : item;
       }
       return item;
    }));
  };

  const toggleFavorite = (type, id) => {
    setFavorites(prev => {
      const list = prev[type];
      if (list.includes(id)) return { ...prev, [type]: list.filter(i => i !== id) };
      return { ...prev, [type]: [...list, id] };
    });
  };

  // CMS Handlers
  const handleAddTrack = (newTrack) => {
      setTracks(prev => [...prev, { ...newTrack, id: Date.now(), plays: '0' }]);
  };
  const handleRemoveTrack = (id) => {
      setTracks(prev => prev.filter(t => t.id !== id));
  };
  const handleAddMerch = (newItem) => {
      setMerch(prev => [...prev, { ...newItem, id: Date.now(), type: newItem.type || 'Apparel' }]);
  };
  const handleRemoveMerch = (id) => {
      setMerch(prev => prev.filter(m => m.id !== id));
  };

  return (
    <ToastProvider>
      <AnimatePresence>
        {loading && <Preloader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      <div 
        className="w-full h-screen bg-black text-white overflow-hidden select-none"
        style={{ 
            "--theme-color": currentTheme.hex,
            "--theme-rgb": currentTheme.rgb
        } as React.CSSProperties}
      >
        <CustomCursor />
        <LiveTicker isAdmin={user?.role === 'admin'} />
        <CartSidebar 
          isOpen={cartOpen} 
          onClose={() => setCartOpen(false)} 
          cart={cart} 
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
          clearCart={() => setCart([])}
          onCheckoutSuccess={() => {/* Trigger confetti handled in scene */}}
        />
        <AuthModal 
            isOpen={authOpen}
            onClose={() => setAuthOpen(false)}
            onLogin={handleLogin}
        />

        {/* HEADER */}
        <header className="fixed top-0 left-0 w-full p-6 z-50 flex justify-between items-start pointer-events-none">
          <div>
            <h1 className="text-2xl font-bold font-brand tracking-tighter pointer-events-auto cursor-pointer" onClick={() => setActiveSection('hero')}>CHUMA</h1>
          </div>

          <div className="flex gap-4 pointer-events-auto items-center">
            <button 
                onClick={toggleTheme}
                className="p-2 hover:text-[var(--theme-color)] transition-colors group flex flex-col items-center"
                title="Toggle Theme"
            >
                <div className={`w-4 h-4 rounded-full border border-current flex items-center justify-center ${theme === 'red' ? 'bg-red-500' : 'bg-[#D4AF37]'}`}>
                    <div className="w-2 h-2 bg-black rounded-full" />
                </div>
            </button>

            <button 
               onClick={() => setCartOpen(true)} 
               className="relative p-2 hover:text-[var(--theme-color)] transition-colors"
            >
              <ShoppingBag size={20} />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-[var(--theme-color)] text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cart.reduce((a,b) => a + b.quantity, 0)}
                </span>
              )}
            </button>
            
            {user ? (
               <div className="flex items-center gap-4 pl-4 border-l border-white/10">
                 {user.role === 'admin' && (
                    <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-[var(--theme-color)]/10 border border-[var(--theme-color)] rounded-full">
                      <div className="w-2 h-2 bg-[var(--theme-color)] rounded-full animate-pulse" />
                      <span className="text-[10px] font-bold text-[var(--theme-color)]">ADMIN</span>
                    </div>
                 )}
                 <div className="flex items-center gap-2 group relative">
                    <span className="text-xs font-bold uppercase tracking-widest hidden md:block text-gray-300 group-hover:text-[var(--theme-color)] transition-colors">{user.name}</span>
                    <button onClick={() => { setUser(null); setActiveSection('hero'); }} className="hover:text-red-500 transition-colors ml-2" title="Logout">
                        <LogOut size={20} />
                    </button>
                 </div>
               </div>
            ) : (
               <button 
                   onClick={() => setAuthOpen(true)} 
                   className="ml-2 text-xs font-bold tracking-widest text-black bg-[var(--theme-color)] px-5 py-2 hover:bg-white transition-colors clip-path-slant flex items-center gap-2"
                   style={{ clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0% 100%)' }}
               >
                   <LogIn size={14} /> LOGIN / JOIN
               </button>
            )}
          </div>
        </header>

        {/* 3D SCENE */}
        <div className="absolute inset-0 z-0">
          <Canvas shadows dpr={[1, 2]}>
            <Suspense fallback={null}>
              <PerspectiveCamera makeDefault position={[0, 0, 6]} />
              <Environment preset="city" />
              
              <BackgroundScene arMode={arMode} vibe={vibe} partyMode={isPlayingId !== null} matrixMode={matrixMode} weather={weather} themeColor={currentTheme.hex} />
              
              <CameraController section={activeSection} idleMode={false} />

              <Center>
                {activeSection === 'hero' && (
                   <group>
                      <AbstractAvatar activeSection={activeSection} arMode={arMode} vibe={vibe} partyMode={isPlayingId !== null} matrixMode={matrixMode} themeColor={currentTheme.hex} />
                      <Hero3DText vibe={vibe} matrixMode={matrixMode} themeColor={currentTheme.hex} />
                      <AfroOrbitals vibe={vibe} matrixMode={matrixMode} themeColor={currentTheme.hex} />
                      <ReactiveFloor vibe={vibe} matrixMode={matrixMode} themeColor={currentTheme.hex} />
                      
                      {/* NEW ELEMENTS */}
                      <FloatingDrones themeColor={currentTheme.hex} />
                      <LaserSystem themeColor={currentTheme.hex} />
                      <BassPulse themeColor={currentTheme.hex} />
                      <DigitalRain themeColor={currentTheme.hex} />
                      <PrismaticShards />
                   </group>
                )}
                {activeSection === 'music' && <VinylRecord isPlaying={isPlayingId !== null} vibe={vibe} matrixMode={matrixMode} themeColor={currentTheme.hex} />}
                {activeSection === 'events' && <TourGlobe matrixMode={matrixMode} themeColor={currentTheme.hex} />}
                {activeSection === 'merch' && (
                   <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                      <mesh position={[0, 0, 0]} rotation={[0.5, 0.5, 0]}>
                         <boxGeometry args={[2, 2, 2]} />
                         <meshStandardMaterial color={currentTheme.hex} wireframe={true} />
                      </mesh>
                   </Float>
                )}
                {activeSection === 'admin' && (
                  <group>
                    <SalesChart3D themeColor={currentTheme.hex} />
                    <LiveActivityGlobe themeColor={currentTheme.hex} />
                  </group>
                )}
              </Center>
              
              <NavHologram hoveredNav={hoveredNav} matrixMode={matrixMode} themeColor={currentTheme.hex} />
              <MouseSpotlight themeColor={currentTheme.hex} />
              <RippleEffect />
              <MouseTrail themeColor={currentTheme.hex} />

            </Suspense>
          </Canvas>
        </div>

        {/* CONTENT OVERLAYS */}
        <AnimatePresence mode="wait">
          {activeSection === 'hero' && (
            <motion.div 
               key="hero" 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
               className="absolute inset-0 z-10"
            >
              <HeroContent 
                 onExplore={() => setActiveSection('music')} 
                 tracks={tracks}
                 wallImages={wallImages}
                 isAdmin={user?.role === 'admin'}
                 onWallImageAdd={() => {/* simplified for demo */}}
                 onWallImageRemove={(id) => setWallImages(prev => prev.filter(i => i.id !== id))}
              />
            </motion.div>
          )}

          {activeSection === 'music' && (
            <motion.div key="music" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="absolute inset-0 z-10">
              <MusicSection 
                 tracks={tracks} 
                 toggleFavorite={toggleFavorite} 
                 favorites={favorites.tracks}
                 isPlayingId={isPlayingId}
                 setIsPlayingId={setIsPlayingId}
              />
            </motion.div>
          )}
          
          {activeSection === 'events' && (
             <motion.div key="events" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }} className="absolute inset-0 z-10">
                <EventsSection tourDates={INITIAL_TOUR_DATES} />
             </motion.div>
          )}

          {activeSection === 'merch' && (
             <motion.div key="merch" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} className="absolute inset-0 z-10">
                <MerchSection merch={merch} addToCart={addToCart} toggleFavorite={toggleFavorite} favorites={favorites.merch} />
             </motion.div>
          )}

          {activeSection === 'favorites' && (
             <motion.div key="favorites" initial={{ opacity: 0, rotateX: -90 }} animate={{ opacity: 1, rotateX: 0 }} exit={{ opacity: 0, rotateX: 90 }} className="absolute inset-0 z-10">
               <FavoritesSection tracks={tracks} merch={merch} favorites={favorites} addToCart={addToCart} />
             </motion.div>
          )}

          {activeSection === 'contact' && (
             <motion.div key="contact" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-10">
                <ContactSection />
             </motion.div>
          )}

          {activeSection === 'admin' && (
             <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-10">
                <AdminSection 
                  user={user} 
                  onLogout={() => { setUser(null); setActiveSection('hero'); }} 
                  tracks={tracks}
                  onAddTrack={handleAddTrack}
                  onRemoveTrack={handleRemoveTrack}
                  merch={merch}
                  onAddMerch={handleAddMerch}
                  onRemoveMerch={handleRemoveMerch}
                />
             </motion.div>
          )}
        </AnimatePresence>

        {/* NAVIGATION */}
        <Navigation active={activeSection} setActive={setActiveSection} user={user} onHover={setHoveredNav} />
      
      </div>
    </ToastProvider>
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(<App />);