import React from 'react'
import './Skeleton.css'

interface SkeletonProps {
  width?: string | number
  height?: string | number
  borderRadius?: string | number
  className?: string
  style?: React.CSSProperties
}

export default function Skeleton({
  width = '100%',
  height = '20px',
  borderRadius = '6px',
  className = '',
  style = {},
}: SkeletonProps) {
  const formattedWidth = typeof width === 'number' ? `${width}px` : width
  const formattedHeight = typeof height === 'number' ? `${height}px` : height
  const formattedRadius = typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius

  return (
    <div
      className={`skeleton-shimmer ${className}`}
      style={{
        width: formattedWidth,
        height: formattedHeight,
        borderRadius: formattedRadius,
        ...style,
      }}
      aria-hidden="true"
    />
  )
}
