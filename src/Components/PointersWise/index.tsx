import React from 'react'


interface PointerWiseProps {
    title: string
    list: string[]
    theme: 'error' | 'default'
  }

  const PointerWise: React.FC<PointerWiseProps> = ({ title, list, theme }) => {
    let bgColor = theme === "error" ? "#FDEDED" : "#F7F7F7"
    let titleColor = theme === "error" ? "#D74544" : "#333333"
    let listColor = theme === "error" ? "#682D2B" : "#333333"

    return (
        <div style={{ backgroundColor: bgColor, padding: 16, borderRadius: 8, textAlign: 'start', marginRight: 20, marginTop: 20 }}>
            <h2 style={{ fontSize: 20, padding: 0, margin: 0, color: titleColor }}>{title}</h2>
            {list.map((item, index) => (
                <div style={{ marginTop: 8, fontSize: 18, color: listColor }} key={index}>• {item}</div>
            ))}
        </div>
    )
}

export default PointerWise
