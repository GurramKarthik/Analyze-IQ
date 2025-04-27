import React , {useRef, useState} from 'react'

// Import your images
import image1 from '../../assets/forwebsite.svg';
import image2 from '../../assets/image2.svg';
import image3 from '../../assets/csv.svg';
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
        div1: image1,
        div2: image2,
        div3: image3
      };
    

  return (
    <>
    
    <div className='h-100vh relative flex flex-col gap-10'>
        <div className='h-[80vh] relative flex flex-col gap-0 mt-[3vmin]'>
          {/* Hoverable Div 1 */}
          <div 
            className={`${styles.hoverDiv}`}
            onMouseEnter={() => handleMouseEnter('div1')}
            onMouseLeave={handleMouseLeave}
          >
            <p>Feature 1</p>
          </div>
          
          {/* Hoverable Div 2 */}
          <div 
            className={`${styles.hoverDiv}`}
            onMouseEnter={() => handleMouseEnter('div2')}
            onMouseLeave={handleMouseLeave}
          >
            <p>Feature 2</p>
          </div>
          
          {/* Hoverable Div 3 */}
          <div 
            className={`${styles.hoverDiv}`}
            onMouseEnter={() => handleMouseEnter('div3')}
            onMouseLeave={handleMouseLeave}
          >
            <p>Feature 3</p>
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
          <div className="bg-white p-2 rounded-lg shadow-xl border border-gray-200">
            <img 
              src={imageMap[hoverState.activeImage]} 
              alt="Preview" 
              className="w-64 h-64 object-cover"
            />
          </div>
        </div>
      )}
    </>
  )
}

export default HoverDiv