import React from 'react'
import { useOutlet } from 'react-router-dom'

const Home: React.FC = () => {
  const childRoute = useOutlet()

  return (
    <>
      <div>Navigation</div>
      <div>Title</div>
      {childRoute}
    </>
  )
}
export default Home
