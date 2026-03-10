import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App.jsx'

describe('Email capture forms', () => {
  let fetchMock

  beforeEach(() => {
    fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
  })

  describe('Hero form (Join the Founding Challengers)', () => {
    it('calls POST /api/subscribe with email and shows success when API returns 200', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ok: true }),
      })

      render(<App />)
      const input = screen.getByPlaceholderText('your@email.com')
      const button = screen.getByRole('button', { name: /join the founding challengers/i })

      await userEvent.type(input, 'test@example.com')
      await userEvent.click(button)

      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/subscribe',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'test@example.com' }),
        })
      )

      await waitFor(() => {
        expect(screen.getByText(/you're in\./i)).toBeInTheDocument()
      })
    })

    it('shows error message when API returns non-ok', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Email already subscribed.' }),
      })

      render(<App />)
      const input = screen.getByPlaceholderText('your@email.com')
      const button = screen.getByRole('button', { name: /join the founding challengers/i })

      await userEvent.type(input, 'test@example.com')
      await userEvent.click(button)

      await waitFor(() => {
        expect(screen.getByText(/email already subscribed\./i)).toBeInTheDocument()
      })
    })

    it('does not submit when email is invalid (no @)', async () => {
      render(<App />)
      const input = screen.getByPlaceholderText('your@email.com')
      const button = screen.getByRole('button', { name: /join the founding challengers/i })

      await userEvent.type(input, 'notanemail')
      await userEvent.click(button)

      expect(fetchMock).not.toHaveBeenCalled()
    })
  })

  describe('Gate form (audit → unlock results)', () => {
    const advanceThroughAudit = async (user) => {
      // Start audit
      await user.click(screen.getByText(/take the audit/i))

      // Answer all 7 pillars (2 questions each): click first option for each, then Next / See My Results
      for (let pillar = 0; pillar < 7; pillar++) {
        const ones = screen.getAllByText('1', { exact: true })
        await user.click(ones[0])
        await user.click(ones[1])
        const nextButton = pillar === 6
          ? screen.getByRole('button', { name: /see my results/i })
          : screen.getByRole('button', { name: /next/i })
        await user.click(nextButton)
      }
    }

    it('calls POST /api/subscribe and unlocks results when API returns 200', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({ ok: true }),
      })

      const user = userEvent.setup()
      render(<App />)
      await advanceThroughAudit(user)

      await waitFor(() => {
        expect(screen.getByText(/audit complete\./i)).toBeInTheDocument()
      })

      const inputs = screen.getAllByPlaceholderText('your@email.com')
      const gateInput = inputs[inputs.length - 1]
      const gateButton = screen.getByRole('button', { name: /join waitlist/i })

      await user.type(gateInput, 'gate@example.com')
      await user.click(gateButton)

      expect(fetchMock).toHaveBeenCalledWith(
        '/api/subscribe',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ email: 'gate@example.com' }),
        })
      )

      await waitFor(() => {
        expect(screen.getByText(/your life score/i)).toBeInTheDocument()
      })
    })

    it('shows error on gate when API fails and does not unlock results', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Server error.' }),
      })

      const user = userEvent.setup()
      render(<App />)
      await advanceThroughAudit(user)

      await waitFor(() => {
        expect(screen.getByText(/audit complete\./i)).toBeInTheDocument()
      })

      const inputs = screen.getAllByPlaceholderText('your@email.com')
      const gateInput = inputs[inputs.length - 1]
      const gateButton = screen.getByRole('button', { name: /join waitlist/i })
      await user.type(gateInput, 'gate@example.com')
      await user.click(gateButton)

      await waitFor(() => {
        expect(screen.getByText(/server error\./i)).toBeInTheDocument()
      })
      expect(screen.queryByText(/your life score/i)).not.toBeInTheDocument()
    })
  })
})
