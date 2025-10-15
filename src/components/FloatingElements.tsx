import { motion } from "framer-motion";

const FloatingElements = () => {
  const elements = [
    { text: "¡Hola!", delay: 0, x: "10%", y: "20%" },
    { text: "Bonjour!", delay: 0.5, x: "85%", y: "15%" },
    { text: "こんにちは!", delay: 1, x: "15%", y: "70%" },
    { text: "Ciao!", delay: 1.5, x: "80%", y: "75%" },
    { text: "你好!", delay: 2, x: "50%", y: "10%" },
  ];

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {elements.map((element, index) => (
        <motion.div
          key={index}
          className="absolute text-2xl font-bold opacity-20"
          style={{ left: element.x, top: element.y }}
          animate={{
            y: [0, -20, 0],
            rotate: [-5, 5, -5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: element.delay,
            ease: "easeInOut",
          }}
        >
          {element.text}
        </motion.div>
      ))}
      
      {/* Stars */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute text-yellow-300"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            scale: [1, 1.5, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        >
          ⭐
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingElements;
