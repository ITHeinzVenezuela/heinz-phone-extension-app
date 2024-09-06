import React from 'react'

type Props = {
  justify?: boolean,
  size: "small" | "normal" | "large"
  text?: boolean,
}

const Spinner = (props: Props) => {
  
  const { size, justify = true, text = false } = props
  
  return (
    <div className={`flex items-center ${justify ? "justify-center" : ""} font-medium`}>
      <div className={`Spinner ${size}`}></div>
      {
        text && <span className="ml-5">Cargando...</span>
      }
    </div>
  )
}

export default Spinner