'use client'

import { Navbar } from "./components/Common/Navbar"
import Sidebar from "./components/Common/Sidebar"
import { TabNavigation } from "./components/Common/TabNavigation"
import { Categories } from "./components/Home/Categories"
import HeroSection from "./components/Home/HeroSection"
import { PopularMenuSection } from "./components/Home/PopularMenuSection"

const page = () => {
  return (
    <div>
      <Navbar/>
      <Sidebar/>
      <HeroSection/>
      <Categories/>
      <PopularMenuSection/>
      {/* <Footer/> */}
      <TabNavigation/>
    </div>
  )
}

export default page