import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Modal } from './Modal'

describe('Modal', () => {
  afterEach(() => {
    cleanup()
    document.body.style.overflow = ''
    document.documentElement.style.overflow = ''
  })

  it('locks background scrolling while open and restores it when closed', () => {
    document.body.style.overflow = 'scroll'
    document.documentElement.style.overflow = 'auto'

    const { unmount } = render(
      <Modal title="Word details" onClose={vi.fn()}>
        <p>Definition</p>
      </Modal>,
    )

    expect(document.body.style.overflow).toBe('hidden')
    expect(document.documentElement.style.overflow).toBe('hidden')

    unmount()

    expect(document.body.style.overflow).toBe('scroll')
    expect(document.documentElement.style.overflow).toBe('auto')
  })
})
