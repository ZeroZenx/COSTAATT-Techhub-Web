import Hero from '@/components/home/Hero'
import Features from '@/components/home/Features'
import VirtualTourPreview from '@/components/home/VirtualTourPreview'
import UpcomingEvents from '@/components/home/UpcomingEvents'
import StudentSpotlight from '@/components/home/StudentSpotlight'
import Stats from '@/components/home/Stats'

export default function Home() {
  return (
    <div className="w-full">
      <Hero />
      <Stats />
      <Features />
      <VirtualTourPreview />
      <UpcomingEvents />
      <StudentSpotlight />
    </div>
  )
}

