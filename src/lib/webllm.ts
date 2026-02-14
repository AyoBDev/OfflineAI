import { CreateMLCEngine, type MLCEngine, type InitProgressReport } from '@mlc-ai/web-llm'
import { MODEL_ID } from './constants'

let engine: MLCEngine | null = null
let loadPromise: Promise<MLCEngine> | null = null

export function getEngine(): MLCEngine | null {
  return engine
}

export function loadModel(
  onProgress?: (report: InitProgressReport) => void
): Promise<MLCEngine> {
  if (engine) return Promise.resolve(engine)
  if (loadPromise) return loadPromise

  loadPromise = (async () => {
    const newEngine = await CreateMLCEngine(MODEL_ID, {
      initProgressCallback: (report: InitProgressReport) => {
        console.log('[WebLLM]', report.text, Math.round(report.progress * 100) + '%')
        onProgress?.(report)
      },
    })
    engine = newEngine
    return newEngine
  })()

  loadPromise.catch((err) => {
    console.error('[WebLLM] Load failed:', err)
    loadPromise = null
  })

  return loadPromise
}

export function isWebGPUSupported(): boolean {
  return 'gpu' in navigator
}
