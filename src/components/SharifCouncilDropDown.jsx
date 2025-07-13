import React, { useState } from "react";

// کارت اعضا (شیشه‌ای و گرادیان)
const cardStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  margin: '1.5rem 0.75rem',
  minWidth: '210px',
  maxWidth: '300px',
  background: 'rgba(255,255,255,0.52)',
  borderRadius: '19px',
  border: '1.7px solid #c5d3e6',
  boxShadow: '0 6px 36px 0 rgba(61,87,158,0.10), 0 1.5px 6px #5274c91c',
  backdropFilter: "blur(14px)",
  overflow: "hidden",
  transition: "transform .18s, box-shadow .25s",
  position: 'relative'
};

const cardHeader = {
  width: '100%',
  padding: '18px 0 10px 0',
  background: 'linear-gradient(90deg,#4b76d2 2%,#7ea9fa 98%)',
  color: '#fff',
  letterSpacing: "-0.5px",
  fontWeight: 800,
  fontSize: "1.11rem",
  fontFamily: 'inherit',
  position: "relative",
  boxShadow: "0 2px 12px #e1eafd9e"
};

const cardIcon = {
  fontSize: '1.45em',
  marginBottom: "-3px",
  marginRight: "5px",
  verticalAlign: "middle",
  filter: "drop-shadow(0 1px 0 #6789)"
};

const memberStyle = isMain => ({
  margin: "0.37em 0",
  fontWeight: isMain ? 700 : 400,
  color: isMain ? "#2463bb" : "#212d41",
  fontFamily: "inherit",
  fontSize: "1.05rem",
  borderRadius: "8px",
  padding: isMain ? "0.3em 0.6em" : "0.27em 0.5em",
  background: isMain ? "rgba(231,243,255,0.90)" : "none",
  boxShadow: isMain ? "0 1px 7px #b1cef780" : "none",
  display: "inline-block",
  transition: "background .2s"
});

const dropdownRoot = {
  direction: 'rtl',
  fontFamily: 'IRANYekan,Vazirmatn,Shabnam,Tahoma,Arial,sans-serif',
  margin: "2.3rem 0",
  textAlign: 'center',
  background: 'unset'
};

// دکمه‌ی تاگل با انیمیشن
const dropBtn = isOpen => ({
  margin: "0 auto 23px auto",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "12px",
  background: isOpen
    ? "linear-gradient(90deg,#466ad2 45%,#3852a5 100%)"
    : "linear-gradient(90deg,#e8eefc 60%,#e5ecfa 100%)",
  color: isOpen ? "#fff" : "#4461a2",
  border: "none",
  borderRadius: "23px",
  fontSize: "1.24rem",
  fontWeight: 800,
  fontFamily: "inherit",
  padding: "12px 49px",
  cursor: "pointer",
  boxShadow: !isOpen ? "0 2px 17px 0 #cadbf7" : "0 1px 5px #92aae7c0",
  transition: "all .18s cubic-bezier(.44,.87,.46,1.34)",
  outline: 'none'
});
const dropArrow = (isOpen) => ({
  transition: "transform .32s cubic-bezier(.41,.88,.3,1.1)",
  display: "inline-block",
  transform: isOpen ? "rotate(-90deg)" : "rotate(0)"
});

const sectionTitle = {
  textAlign: 'center',
  fontFamily: 'inherit',
  fontWeight: 900,
  fontSize: "1.53rem",
  color: "#30426c",
  margin: "12px 0 24px 0",
  letterSpacing: "-1px"
};

// هاور کارت
const cardHoverStyle = {
  transform: "translateY(-6px) scale(1.035)",
  boxShadow: "0 16px 48px 0 rgba(84,120,201,0.19), 0 3px 12px 0 #9db7e228"
};

export default function SharifCouncilDropDown({ title, items = [], defaultOpen = false }) {
  const [open, setOpen] = useState(!!defaultOpen);
  const [hovered, setHovered] = useState(null);

  return (
    <div style={dropdownRoot}>
      <button
        style={dropBtn(open)}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-controls={"drop-sec-" + title}
      >
        <span style={dropArrow(open)}>
          <svg width="22" height="13" viewBox="0 0 22 13">
            <path d="M2 2.5L11 11L20 2.5" fill="none" stroke="currentColor" strokeWidth="2.23" strokeLinejoin="round"/>
          </svg>
        </span>
        {title}
      </button>
      {open && (
        <div
          id={"drop-sec-" + title}
          style={{
            marginTop: "1.2rem",
            display: "flex",
            flexWrap: "wrap",
            gap: "36px",
            justifyContent: 'center',
            alignItems: 'flex-start'
          }}
        >
          {items.map((group, idx) =>
            <div
              style={{
                ...cardStyle,
                ...(hovered === idx ? cardHoverStyle : {})
              }}
              key={idx}
              onMouseEnter={() => setHovered(idx)}
              onMouseLeave={() => setHovered(null)}
            >
              <div style={cardHeader}>
                {group.type === "unit" ? <span style={cardIcon}>🏢</span> : <span style={cardIcon}>👥</span>}
                {group.name}
              </div>
              <ul style={{
                listStyle: "none", padding: "13px 2px 14px 2px", margin: 0, width: '100%', minHeight: 18
              }}>
                {(group.members || []).map((mem, j) =>
                  <li key={j} style={memberStyle(mem.type === "main" || mem.role === "دبیر")}>
                    {mem.type === "main" || mem.role === "دبیر" ? "⭐ " : ""}
                    {mem.name}
                    {mem.role ? ` (${mem.role})` : ""}
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
