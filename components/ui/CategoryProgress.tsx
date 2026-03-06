import { Progress } from '@/lib/client-imports'

interface CategoryItem {
  title: string
  value: number
  testCount: number
}

interface CategoryProgressProps {
  categories: CategoryItem[]
}

const CategoryProgress = ({ categories }: CategoryProgressProps) => {
  return (
    <section>
      <div className="w-full flex flex-col gap-2 md:gap-3 lg:gap-4 p-2 md:p-4 lg:p-6 rounded-xl border-border border">
        <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-foreground mb-2 md:mb-4 lg:mb-6">
          Category Progress
        </h1>

        {categories.map((cat) => (
          <div key={cat.title} className="w-full">
            <Progress
              variant="percent"
              percentage={cat.value}
              label={cat.title}
              subLabel={`${cat.testCount} test completed`}
            />
          </div>
        ))}
      </div>
    </section>
  )
}

export default CategoryProgress