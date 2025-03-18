import React, { lazy, memo, Suspense, useState } from 'react'
const Graph = lazy(() => import('./Graph'));

const GraphContainer = memo(({ id, data }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    return (
      <div
        key={id}
        className="flex flex-col gap-3 justify-center items-center grow bg-[#444] p-[1.3vmin] shadow-2xl rounded-md"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Suspense> 
                <Graph data = {data} />
        </Suspense>
        {/* {isHovered && (
          <input
            type="text"
            className="text-black p-[0.3rem]"
            placeholder="Ask something..."
          />
        )} */}
      </div>
    );
  });
  

export default GraphContainer