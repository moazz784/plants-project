import React from 'react'
import image201 from "./assets/flowersss.png"
import Footer from './Footer';
export default function 
() {
  return (
    <div>
        <section className='w-full min-h-screen bg-[url(/background.jpg)] relative bg-cover bg-center overflow-hidden '>
        <h1 className='text-9xl text-amber-300 hover:text-green-500'>moazzz</h1>
       <img
  src={image201}
  alt="image"
  className="absolute 
    -bottom-6
    left-0 translate-x-0 
    md:left-1/2 md:-translate-x-1/2"

/>
        </section>
       
    </div>
  )
}
