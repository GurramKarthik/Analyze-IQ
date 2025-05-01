import React , {useRef, useState} from 'react'

// Import your images
import AutomatedEDA from '../../assets/AutomatedEDA.png';
import smartVisualisation from '../../assets/smartVisualisation.png';
import conversationData from '../../assets/conversationData.png';
import styles from "./Home.module.scss";


const HoverDiv = ({hoverState,setHoverState}) => {

     
    

    const handleMouseEnter = (image) => {
        setHoverState({
          isHovering: true,
          activeImage: image,
          position: { x: 0, y: 0 } // Will update immediately on mousemove
        });
      };
    
      const handleMouseLeave = () => {
        setHoverState({
          isHovering: false,
          activeImage: null,
          position: { x: 0, y: 0 }
        });
      };
    
      // Image mapping for each div
      const imageMap = {
        div1: AutomatedEDA,
        div2: smartVisualisation,
        div3: conversationData
      };
    

  return (
    <>
    
    <div className='h-100vh relative flex flex-col gap-10 bg-white'>
        <div className='h-[80vh] relative flex flex-col gap-0 mt-[3vmin]'>
          {/* Hoverable Div 1 */}
          <div 
            className={`${styles.hoverDiv}`}
            onMouseEnter={() => handleMouseEnter('div1')}
            onMouseLeave={handleMouseLeave}
          >
            <p>Automated EDA</p>
          </div>
          
          {/* Hoverable Div 2 */}
          <div 
            className={`${styles.hoverDiv}`}
            onMouseEnter={() => handleMouseEnter('div2')}
            onMouseLeave={handleMouseLeave}
          >
            <p>Smart Visualizations</p>
          </div>
          
          {/* Hoverable Div 3 */}
          <div 
            className={`${styles.hoverDiv}`}
            onMouseEnter={() => handleMouseEnter('div3')}
            onMouseLeave={handleMouseLeave}
          >
            <p>Conversational Analytics</p>
          </div>
        </div>
      </div>

      {/* Cursor-following popup */}
      {hoverState.isHovering && (
        <div 
          className="fixed pointer-events-none z-50 transition-transform duration-100"
          style={{
            left: `${hoverState.position.x + 20}px`,
            top: `${hoverState.position.y + 20}px`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className=" p-2 rounded-lg shadow-xl border border-gray-200">
            <img 
              src={imageMap[hoverState.activeImage]} 
              alt="Preview" 
              className="w-64 h-64 object-cover drop-shadow-lg"
            />
          </div>
        </div>
      )}
    </>
  )
}

export default HoverDiv