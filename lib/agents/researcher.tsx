import { createStreamableUI, createStreamableValue } from 'ai/rsc'
import { CoreMessage, ToolCallPart, ToolResultPart, streamText } from 'ai'
import { getTools } from './tools'
import { getModel } from '../utils'
import { AnswerSection } from '@/components/answer-section'

export async function researcher(
  uiStream: ReturnType<typeof createStreamableUI>,
  streamableText: ReturnType<typeof createStreamableValue<string>>,
  messages: CoreMessage[],
  useSpecificModel?: boolean
) {
  let fullResponse = ''
  let hasError = false
  const answerSection = <AnswerSection result={streamableText.value} />
  const currentDate = new Date().toLocaleString()
  const result = await streamText({
    model: getModel(),
    maxTokens: 2500,
    system: `As Alara, your AI-driven news assistant from Scrolli, your role as a professional search expert is to provide the most relevant and accurate information based on user queries by leveraging the best available web resources. Here's how to proceed:

      Utilize Search Results: Conduct thorough searches using only the best and most trusted news outlets to ensure the credibility of the information. The approved sources are:
      1. The Washington Post
      2. The New York Times
      3. BBC News
      4. Reuters
      5. Associated Press (AP)
      6. The Guardian
      7. Bloomberg
      8. Financial Times
      9. Al Jazeera
      10. NPR

      Include Relevant Media: Incorporate images or other media relevant to the user's query to enhance the response.

      Cite Sources: Always cite the source URL explicitly when quoting or referencing information from specific URLs. Ensure that all cited URLs belong to the trusted sources listed above. Note: The retrieve tool can only be used with URLs provided by the user. URLs from search results cannot be used.

      Tailor Responses: Directly address the user's question, augmenting your response with insights gleaned from the search results from the approved list of sources.

      Please match the language of the response to the user's language.
      Current date and time: ${currentDate}`,
    messages,
    tools: getTools({
      uiStream,
      fullResponse
    })
  }).catch(err => {
    hasError = true
    fullResponse = 'Error: ' + err.message
    streamableText.update(fullResponse)
  })

  // If the result is not available, return an error response
  if (!result) {
    return { result, fullResponse, hasError, toolResponses: [] }
  }

  // Remove the spinner
  uiStream.update(null)

  // Process the response
  const toolCalls: ToolCallPart[] = []
  const toolResponses: ToolResultPart[] = []
  for await (const delta of result.fullStream) {
    switch (delta.type) {
      case 'text-delta':
        if (delta.textDelta) {
          // If the first text delta is available, add a UI section
          if (fullResponse.length === 0 && delta.textDelta.length > 0) {
            // Update the UI
            uiStream.update(answerSection)
          }

          fullResponse += delta.textDelta
          streamableText.update(fullResponse)
        }
        break
      case 'tool-call':
        toolCalls.push(delta)
        break
      case 'tool-result':
        // Append the answer section if the specific model is not used
        if (!useSpecificModel && toolResponses.length === 0 && delta.result) {
          uiStream.append(answerSection)
        }
        if (!delta.result) {
          hasError = true
        }
        toolResponses.push(delta)
        break
      case 'error':
        console.log('Error: ' + delta.error)
        hasError = true
        fullResponse += `\nError occurred while executing the tool`
        break
    }
  }
  messages.push({
    role: 'assistant',
    content: [{ type: 'text', text: fullResponse }, ...toolCalls]
  })

  if (toolResponses.length > 0) {
    // Add tool responses to the messages
    messages.push({ role: 'tool', content: toolResponses })
  }

  return { result, fullResponse, hasError, toolResponses }
}
