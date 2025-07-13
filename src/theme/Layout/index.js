import React from 'react';
import Layout from '@theme-original/Layout';

export default function LayoutWrapper(props) {
  return (
    <Layout {...props}>
      {/* BG overlays start */}
      <div
        className="opacity-10"
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,                // زیر همه
          pointerEvents: 'none',    // کلیک‌پذیر نشه
        }}
        aria-hidden="true"
      />
      <div
        className="home-bg-logo"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
          pointerEvents: 'none',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: 'url(/img/maini_colors.png)', // یا کلاس‌دهی CSS
          backgroundSize: 'contain',
          opacity: .1,
        }}
        aria-hidden="true"
      />
      {/* BG overlays end */}

      {/* کل محتوا میاد روی پس‌زمینه */}
      <div style={{position: 'relative', zIndex: 1}}> 
        {props.children}
      </div>
    </Layout>
  );
}
