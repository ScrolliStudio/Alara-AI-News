import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

const exampleMessages = [
  {
  heading: "Türkiye'nin enerji politikası?",
  message: "Türkiye'nin enerji politikası?"
  },
  {
  heading: "Türkiye'de teknoloji girişimleri?",
  message: "Türkiye'de teknoloji girişimleri?"
  },
  {
  heading: "Yapay zeka etik kuralları?",
  message: "Yapay zeka etik kuralları?"
  },
  {
  heading: "Küresel su krizi?",
  message: "Küresel su krizi?"
  },
  {
  heading: "Uzay madenciliği geleceği?",
  message: "Uzay madenciliği geleceği?"
  }
  ]

export function EmptyScreen({
  submitMessage,
  className
}: {
  submitMessage: (message: string) => void
  className?: string
}) {
  return (
    <div className={`mx-auto w-full transition-all ${className}`}>
      <div className="bg-background p-2">
        <div className="mt-4 flex flex-col items-start space-y-2 mb-4">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 text-base"
              name={message.message}
              onClick={async () => {
                submitMessage(message.message)
              }}
            >
              <ArrowRight size={16} className="mr-2 text-muted-foreground" />
              {message.heading}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
