import Navbar from "@/sections/Navbar"
import Hero from "@/sections/Hero"
import { usePageMeta, PAGE_META } from "@/hooks/usePageMeta"
import InfoStrip from "@/sections/InfoStrip"
import BiryaniHouse from "@/sections/BiryaniHouse"
import CartBar from "@/sections/CartBar"
import Story from "@/sections/Story"
import MenuTeaser from "@/sections/MenuTeaser"
import Offers from "@/sections/Offers"
import Gallery from "@/sections/Gallery"
import Locations from "@/sections/Locations"
import Reservation from "@/sections/Reservation"
import Footer from "@/sections/Footer"

export default function Home() {
  usePageMeta("/", PAGE_META.home)
  return (
    <>
      <Navbar />
      <Hero />
      <InfoStrip />
      <MenuTeaser />
      <BiryaniHouse />
      <Story />
      <Offers />
      <Gallery />
      <Locations />
      <Reservation />
      <Footer />
      <CartBar />
    </>
  )
}
