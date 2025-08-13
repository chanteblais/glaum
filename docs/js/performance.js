// Performance monitoring for Glåüm homepage
(function() {
  'use strict';
  
  // Performance metrics
  const metrics = {
    pageLoadStart: performance.now(),
    imagesLoaded: 0,
    totalImages: 0,
    loadTimes: {}
  };
  
  // Track when DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    metrics.domReady = performance.now();
    console.log('DOM ready in:', Math.round(metrics.domReady - metrics.pageLoadStart), 'ms');
  });
  
  // Track when page is fully loaded
  window.addEventListener('load', function() {
    metrics.pageLoadComplete = performance.now();
    console.log('Page fully loaded in:', Math.round(metrics.pageLoadComplete - metrics.pageLoadStart), 'ms');
    
    // Log performance summary
    logPerformanceSummary();
  });
  
  // Track image loading performance
  function trackImageLoad(imageSrc, startTime) {
    const img = new Image();
    img.onload = function() {
      const loadTime = performance.now() - startTime;
      metrics.loadTimes[imageSrc] = loadTime;
      metrics.imagesLoaded++;
      
      console.log(`Image loaded: ${imageSrc} in ${Math.round(loadTime)}ms`);
      
      if (metrics.imagesLoaded === metrics.totalImages) {
        console.log('All images loaded!');
      }
    };
    img.onerror = function() {
      console.warn(`Failed to load image: ${imageSrc}`);
      metrics.imagesLoaded++;
    };
    img.src = imageSrc;
  }
  
  // Log performance summary
  function logPerformanceSummary() {
    const totalLoadTime = metrics.pageLoadComplete - metrics.pageLoadStart;
    const avgImageLoadTime = Object.values(metrics.loadTimes).reduce((a, b) => a + b, 0) / Object.keys(metrics.loadTimes).length || 0;
    
    console.log('=== Performance Summary ===');
    console.log('Total page load time:', Math.round(totalLoadTime), 'ms');
    console.log('Images loaded:', metrics.imagesLoaded, '/', metrics.totalImages);
    console.log('Average image load time:', Math.round(avgImageLoadTime), 'ms');
    console.log('Image load times:', metrics.loadTimes);
    
    // Send to analytics if available
    if (typeof gtag !== 'undefined') {
      gtag('event', 'performance', {
        'page_load_time': Math.round(totalLoadTime),
        'images_loaded': metrics.imagesLoaded,
        'avg_image_load_time': Math.round(avgImageLoadTime)
      });
    }
  }
  
  // Expose tracking function globally
  window.trackImageLoad = trackImageLoad;
  window.performanceMetrics = metrics;
  
})();
