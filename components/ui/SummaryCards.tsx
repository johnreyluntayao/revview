import React from 'react'
import { Card } from '@/lib/client-imports';

interface SummaryCardItem {
  icon?: React.ReactNode
  title: string
  value: string | number
}

interface SummaryCardsProps {
  cards: SummaryCardItem[]
}

const SummaryCards = ({ cards }: SummaryCardsProps) => {
  return (
    <section>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-6 w-full">
        {cards.map((card, index) => (
          <Card
            key={index}
            variant="data"
            icon={card.icon}
            title={card.title}
            value={card.value}
          />
        ))}
      </div>
    </section>
  )
}

export default SummaryCards