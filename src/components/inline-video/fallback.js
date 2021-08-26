import React, { useEffect, useState, useRef } from 'react';

function VideoCoverFallback(props) {
  const containerRef = useRef(null);
  const [innerRatio, setInnerRatio] = useState(0);
  const [outerRatio, setOuterRatio] = useState(0);

  useEffect(() => {
    updateContainerRatio();
    if (typeof props.onFallbackDidMount === 'function') {
      props.onFallbackDidMount(updateContainerRatio);
    }
    if (props.remeasureOnWindowResize) {
      initEventListeners();
    }
  });

  useEffect(() => {
    initEventListeners();

    return () => {
      removeEventListeners();
      props.onFallbackWillUnmount();
    };
  });

  const updateContainerRatio = () => {
    if (containerRef) {
      const { width, height } = containerRef.getBoundingClientRect();
      setOuterRatio(width / height);
    }
  };

  const updateVideoRatio = (width, height) => {
    setInnerRatio(width / height);
  };

  const initEventListeners = () => {
    if (typeof window != 'undefined') {
      window.addEventListener('resize', updateContainerRatio);
    }
  };

  const removeEventListeners = () => {
    if (typeof window != 'undefined') {
      window.removeEventListener('resize', updateContainerRatio);
    }
  };

  /**
   * We can get the width and height of a video after it has started loading.
   * Then we can compare the aspect ratio of the video to that of it's surrounding container.
   * That is all we need to determine if the video fills the container vertically or horizontally.
   * In the other dimension we just have to maintain the original aspect-ratio.
   */

  const style = {
    width: innerRatio > outerRatio ? 'auto' : '100%',
    height: innerRatio > outerRatio ? '100%' : 'auto',

    /* the following is for centering the video.
      There has to be some better solution?!
      any help is very much appreciated :) */
    position: 'absolute',
    top: '-9999px',
    bottom: '-9999px',
    left: '-9999px',
    right: '-9999px',
    margin: 'auto'
  };

  const outerStyle = {
    width: '100%',
    height: '100%',
    ...props.style,
    position: 'relative',
    overflow: 'hidden'
  };

  return (
    <div style={outerStyle} ref={containerRef} className={props.className}>
      <video
        onLoadedData={(event) => {
          updateVideoRatio(event.target.videoWidth, event.target.videoHeight);
        }}
        style={style}
        {...props.videoOptions}
        muted
      >
        {props.source.map((item, i) => (
          <source key={i} src={item.src} type={item.type} />
        ))}
      </video>
    </div>
  );
}

export default VideoCoverFallback;
