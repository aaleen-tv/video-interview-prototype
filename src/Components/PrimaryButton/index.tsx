import React from 'react'

interface PrimaryButtonProps {
  title: string
  style?: React.CSSProperties
  handleClick: () => void
}
const PrimaryButton: React.FC<PrimaryButtonProps> = ({ title, style, handleClick }) => {
  return (
    <div onClick={handleClick} style={{ fontSize: 18, padding: 16, backgroundColor: '#FF622D', fontWeight: 'bold', borderRadius: 12, color:"#FFFFFF", cursor:'pointer', ...style }}>
      {title}
    </div>
  )
}

export default PrimaryButton
