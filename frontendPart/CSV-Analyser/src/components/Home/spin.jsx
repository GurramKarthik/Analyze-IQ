import { useState, useEffect } from 'react';

export default function SpinningEcosystem() {
  const [rotation, setRotation] = useState(0);
  const [hoveredBubble, setHoveredBubble] = useState(null);

  // Ecosystem data points
  const bubbleData = [
    {
      id: 1,
      title: "Automated AI Core",
      description: "Powered by LLMs, this core performs data understanding, insight generation, and decision logic for visualization.",
      color: "#6A0DAD" // Green
    },
    {
      id: 2,
      title: "Smart Insight Engine",
      description: "Extracts hidden patterns, correlations, and trends from uploaded CSV/Excel data using AI-powered analysis.",
      color: "#00BFFF" // Darker green
    },
    {
      id: 3,
      title: "Interactive Visual Dashboard",
      description: "Auto-generates dynamic charts and dashboards using Plotly based on AI-recommended insights.",
      color: "#FF6F61" // Blue
    },
    {
      id: 4,
      title: "Conversational Data Assistant",
      description: "Chat with your data—ask questions, get instant visualizations or textual insights without writing a single line of code.",
      color: "#3EB489" // Darker blue
    },
    {
      id: 5,
      title: "Automated EDA & Data Cleaning",
      description: "Handles null values, detects outliers, identifies data types, and summarizes datasets automatically on upload.",
      color: "#FFBF00" // Yellow
    }
  ];
  

  // Animation loop
 // Animation loop with slower rotation
    useEffect(() => {
        const animationFrame = requestAnimationFrame(function animate() {
        // Reduce this number from 0.2 to a smaller value like 0.05 for slower rotation
        setRotation(prev => (prev + 0.4) % 360);
        requestAnimationFrame(animate);
        });
        
        return () => cancelAnimationFrame(animationFrame);
    }, []);

  // Calculate positions for bubbles
  const calculateBubblePosition = (index, totalBubbles, radius) => {
    const angle = (index * 2 * Math.PI / totalBubbles) + (rotation * Math.PI / 180);
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return { x, y };
  };

  return (
    <div className="ecosystem-container">
      <h2 className="ecosystem-title">AI Data Processing Ecosystem</h2>
      
      <div className="orbit-system">
        {/* Orbit circles */}
        <div className="orbit orbit-inner" style={{ transform: `rotate(${rotation}deg)` }} />
        <div className="orbit orbit-middle" style={{ transform: `rotate(${rotation * 0.8}deg)` }} />
        <div className="orbit orbit-outer" style={{ transform: `rotate(${rotation * 0.6}deg)` }} />
        
        {/* Bubbles */}
        {bubbleData.map((bubble, index) => {
          const position = calculateBubblePosition(index, bubbleData.length, 180);
          
          return (
            <div 
              key={bubble.id}
              className="bubble-container"
              style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
              }}
            >
              <div 
                className="bubble"
                style={{ backgroundColor: bubble.color }}
                onMouseEnter={() => setHoveredBubble(bubble.id)}
                onMouseLeave={() => setHoveredBubble(null)}
              />
              
              {hoveredBubble === bubble.id && (
                <div className="info-popup">
                  <h3>{bubble.title}</h3>
                  <p>{bubble.description}</p>
                </div>
              )}
            </div>
          );
        })}
        
        {/* Center point */}
        <div className="center-point" />
      </div>
    </div>
  );
}