import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

const exampleMessages = [
  {
    heading: "Türkiye'nin ekonomik durumu nasıl?",
    message: "Türkiye'nin ekonomik durumu nasıl?"
  },
  {
    heading: 'Kanal İstanbul projesinin detayları nelerdir?',
    message: 'Kanal İstanbul projesinin detayları nelerdir?'
  },
  {
    heading: 'Yerli otomobil TOGG hakkında neler biliyoruz?',
    message: 'Yerli otomobil TOGG hakkında neler biliyoruz?'
  },
  {
    heading: 'İstanbul\'da konut fiyatları neden artıyor?',
    message: 'İstanbul\'da konut fiyatları neden artıyor?'
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
