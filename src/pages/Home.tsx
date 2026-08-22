import Navbar from "@/sections/Navbar"
import Hero from "@/sections/Hero"
import Story from "@/sections/Story"
import MenuTeaser from "@/sections/MenuTeaser"
import Gallery from "@/sections/Gallery"
import Locations from "@/sections/Locations"
import Reservation from "@/sections/Reservation"
import Footer from "@/sections/Footer"

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Story />
      <MenuTeaser />
      <Gallery />
      <Locations />
      <Reservation />
      <Footer />
    </>
  )
}
