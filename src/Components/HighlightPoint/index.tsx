import React from 'react'


interface HighlightPointProps {
    title: string
  }

  const HighlightPoint: React.FC<HighlightPointProps> = ({ title }) => {
    return (
        <div style={{ padding: 8, color: "#FF622D", fontSize: 18, border: '1px solid #FF622D', borderRadius: 8, marginTop: 16, marginRight: 16 }}>
            • {title}
        </div>
    )
}

export default HighlightPoint
