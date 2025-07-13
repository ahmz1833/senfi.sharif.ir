import React, { useState } from 'react';

export function PeriodAccordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div style={{
      margin: "30px 0",
      background: "#fafcff",
      borderRadius: "18px",
      boxShadow: "0 2px 15px 0 #dceafc46",
      overflow: "hidden",
      direction: 'rtl'
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          fontSize: 19,
          fontWeight: 800,
          color: open ? "#354d8a" : "#818ba5",
          background: open 
            ? "linear-gradient(90deg,#e5ecfa 0%,#cfe4ff 100%)" 
            : "#f4f9ff",
          border: "none",
          padding: "20px 24px",
          width: "100%",
          textAlign: "right",
          cursor: "pointer",
          outline: "none",
          borderBottom: open ? "1.5px solid #d1e1fa" : "none",
          transition: "background .14s"
        }}
        aria-expanded={open}
      >
        <span style={{marginLeft:12, display:"inline-block", transition:"transform .3s", transform: open ? "rotate(0deg)":"rotate(-90deg)"}}>▼</span>
        {title}
      </button>
      {open && (
        <div style={{padding: "0 14px 18px 14px" }}>
          {children}
        </div>
      )}
    </div>
  );
}
