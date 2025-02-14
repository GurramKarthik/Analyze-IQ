import React from 'react'
import HeroSection from './HeroSection'
import Overview from './Overview'
import { InteractiveHoverButton } from '../magicui/interactive-hover-button'
import ThemeProvider from '../theme-provider'
import { ModeToggle } from './Dark'
import Card from './Card'
import Beam from './Beam'
import Example from './Example'
import Footer from './Footer'




const what = [
  "Upload CSV & explore trends instantly",
  "Ask questions, get AI-driven insights",
  "Generate interactive graphs"
]

const feature = [
    "No coding needed",
    "Visualize data effortlessly",
    "Ensures data privacy & speed"
]


const why = [
  "No data science expertise required",
  "Faster decision-making",
  "Ideal for analysts & professionals"
]

const Home = () => {
  return (
    <div className='w-full'>
        <HeroSection/>
        <div className="flex h-[500px] w-full flex-col gap-4 lg:h-[250px] lg:flex-row justify-between p-3 mt-10 " id='cardview'  >
            <Card title={"What Can CSV-Analyser Do?"} details={what} />
            <Card title={"Key Features"} details={feature}/>
            <Card title={"Why Choose CSV-Analyser?"} details={why}/>
        </div>
        <Beam/>
        <Example/>
        <hr className='mr-4 mt-2' />
        <Footer/>
    </div>
  )
}

export default Home