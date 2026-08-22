import { useState } from "react"
import { Play, X } from "lucide-react"
import Navbar from "@/sections/Navbar"
import Footer from "@/sections/Footer"
import { menu, categories, type MenuItem } from "@/lib/menuData"

export default function MenuPage() {
  const [activeVideo, setActiveVideo] = useState<MenuItem | null>(null)

  return (
    <>
      <Navbar />

      <main className="bg-cream min-h-screen pt-36 pb-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="font-body text-[0.65rem] tracking-mega uppercase text-gold mb-4">
              The Full Menu
            </p>
            <h1 className="font-display text-4xl md:text-5xl">
              Every dish, every craving
            </h1>
          </div>

          {categories.map((category) => (
            <div key={category} className="mb-16">
              <h2 className="font-display italic text-2xl text-brown mb-8 text-center">
                {category}
              </h2>

              <div className="flex flex-col gap-6">
                {menu
                  .filter((item) => item.category === category)
                  .map((item) => (
                    <div key={item.name} className="flex items-baseline">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-display text-xl">
                            {item.name}
                          </h3>
                          {item.video && (
                            <button
                              onClick={() => setActiveVideo(item)}
                              aria-label={`Watch ${item.name} video`}
                              className="text-gold hover:text-brown transition-colors"
                            >
                              <Play size={16} fill="currentColor" />
                            </button>
                          )}
                        </div>
                        <p className="font-body text-foreground/60 text-sm mt-1">
                          {item.desc}
                        </p>
                      </div>
                      <span className="menu-dots" />
                      <span className="font-display text-lg text-gold shrink-0">
                        {item.price}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      {activeVideo && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-6"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveVideo(null)}
              aria-label="Close video"
              className="absolute -top-10 right-0 text-cream hover:text-gold"
            >
              <X size={24} />
            </button>
            <video
              src={activeVideo.video}
              controls
              autoPlay
              className="w-full rounded"
            />
            <p className="font-display italic text-cream text-center mt-4">
              {activeVideo.name}
            </p>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}
