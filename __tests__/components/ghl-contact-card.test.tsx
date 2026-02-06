import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

// Mock the hook
vi.mock("@/hooks/use-ghl-contact", () => ({
  useGHLContact: vi.fn(() => ({
    contact: null,
    isLoading: false,
    error: null,
  })),
}))

// Mock the UI components with simple implementations
vi.mock("@/components/ui/avatar", () => ({
  Avatar: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="avatar" className={className}>{children}</div>
  ),
  AvatarFallback: ({ children }: { children: React.ReactNode }) => (
    <span data-testid="avatar-fallback">{children}</span>
  ),
  AvatarImage: () => null,
}))

vi.mock("@/components/ui/badge", () => ({
  Badge: ({ children, variant }: { children: React.ReactNode; variant?: string }) => (
    <span data-testid="badge" data-variant={variant}>{children}</span>
  ),
}))

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) => (
    <button {...props}>{children}</button>
  ),
}))

vi.mock("@/components/ui/card", () => ({
  Card: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="card" className={className}>{children}</div>
  ),
  CardContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-content">{children}</div>
  ),
  CardDescription: ({ children }: { children: React.ReactNode }) => (
    <p data-testid="card-description">{children}</p>
  ),
  CardHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-header">{children}</div>
  ),
  CardTitle: ({ children }: { children: React.ReactNode }) => (
    <h3 data-testid="card-title">{children}</h3>
  ),
}))

vi.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-content">{children}</div>
  ),
  DropdownMenuItem: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button data-testid="dropdown-item" onClick={onClick}>{children}</button>
  ),
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-trigger">{children}</div>
  ),
}))

vi.mock("@/components/ui/skeleton", () => ({
  Skeleton: ({ className }: { className?: string }) => (
    <div data-testid="skeleton" className={className} />
  ),
}))

vi.mock("@/components/ui/alert", () => ({
  Alert: ({ children, variant }: { children: React.ReactNode; variant?: string }) => (
    <div data-testid="alert" data-variant={variant}>{children}</div>
  ),
  AlertDescription: ({ children }: { children: React.ReactNode }) => (
    <p data-testid="alert-description">{children}</p>
  ),
  AlertTitle: ({ children }: { children: React.ReactNode }) => (
    <h4 data-testid="alert-title">{children}</h4>
  ),
}))

// Import the component after mocks
import { GHLContactCard } from "@/registry/new-york/contacts/ghl-contact-card"
import { useGHLContact } from "@/hooks/use-ghl-contact"

const mockUseGHLContact = vi.mocked(useGHLContact)

describe("GHLContactCard", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("when contact is provided directly", () => {
    it("renders contact name", () => {
      const contact = {
        id: "123",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
      }

      render(<GHLContactCard contact={contact} />)

      expect(screen.getByTestId("card-title")).toHaveTextContent("John Doe")
    })

    it("renders email link", () => {
      const contact = {
        id: "123",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
      }

      render(<GHLContactCard contact={contact} />)

      const emailLink = screen.getByRole("link", { name: /john@example\.com/i })
      expect(emailLink).toHaveAttribute("href", "mailto:john@example.com")
    })

    it("renders phone link when provided", () => {
      const contact = {
        id: "123",
        firstName: "John",
        lastName: "Doe",
        phone: "+1234567890",
      }

      render(<GHLContactCard contact={contact} />)

      const phoneLink = screen.getByRole("link", { name: /\+1234567890/i })
      expect(phoneLink).toHaveAttribute("href", "tel:+1234567890")
    })

    it("renders tags when showTags is true", () => {
      const contact = {
        id: "123",
        firstName: "John",
        lastName: "Doe",
        tags: ["VIP", "Customer"],
      }

      render(<GHLContactCard contact={contact} showTags={true} />)

      const badges = screen.getAllByTestId("badge")
      expect(badges).toHaveLength(2)
      expect(badges[0]).toHaveTextContent("VIP")
      expect(badges[1]).toHaveTextContent("Customer")
    })

    it("does not render tags when showTags is false", () => {
      const contact = {
        id: "123",
        firstName: "John",
        lastName: "Doe",
        tags: ["VIP"],
      }

      render(<GHLContactCard contact={contact} showTags={false} />)

      expect(screen.queryByTestId("badge")).not.toBeInTheDocument()
    })

    it("displays initials in avatar", () => {
      const contact = {
        id: "123",
        firstName: "John",
        lastName: "Doe",
      }

      render(<GHLContactCard contact={contact} />)

      expect(screen.getByTestId("avatar-fallback")).toHaveTextContent("JD")
    })

    it("handles contact with only first name", () => {
      const contact = {
        id: "123",
        firstName: "John",
      }

      render(<GHLContactCard contact={contact} />)

      expect(screen.getByTestId("card-title")).toHaveTextContent("John")
      expect(screen.getByTestId("avatar-fallback")).toHaveTextContent("J")
    })
  })

  describe("when loading", () => {
    it("shows skeleton loading state", () => {
      mockUseGHLContact.mockReturnValue({
        contact: null,
        isLoading: true,
        error: null,
        refetch: vi.fn(),
      })

      render(<GHLContactCard contactId="123" />)

      expect(screen.getAllByTestId("skeleton").length).toBeGreaterThan(0)
    })
  })

  describe("when error occurs", () => {
    it("shows error alert", () => {
      mockUseGHLContact.mockReturnValue({
        contact: null,
        isLoading: false,
        error: new Error("Failed to fetch"),
        refetch: vi.fn(),
      })

      render(<GHLContactCard contactId="123" />)

      expect(screen.getByTestId("alert")).toHaveAttribute(
        "data-variant",
        "destructive"
      )
      expect(screen.getByTestId("alert-description")).toHaveTextContent(
        "Failed to fetch"
      )
    })
  })

  describe("when no contact found", () => {
    it("shows not found alert", () => {
      mockUseGHLContact.mockReturnValue({
        contact: null,
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      })

      render(<GHLContactCard contactId="123" />)

      expect(screen.getByTestId("alert-title")).toHaveTextContent(
        "No contact found"
      )
    })
  })

  describe("action handlers", () => {
    it("calls onEdit when edit is clicked", async () => {
      const onEdit = vi.fn()
      const contact = {
        id: "123",
        firstName: "John",
        lastName: "Doe",
      }

      render(<GHLContactCard contact={contact} onEdit={onEdit} />)

      const editButton = screen.getByText("Edit")
      await userEvent.click(editButton)

      expect(onEdit).toHaveBeenCalledWith("123")
    })

    it("calls onDelete when delete is clicked", async () => {
      const onDelete = vi.fn()
      const contact = {
        id: "123",
        firstName: "John",
        lastName: "Doe",
      }

      render(<GHLContactCard contact={contact} onDelete={onDelete} />)

      const deleteButton = screen.getByText("Delete")
      await userEvent.click(deleteButton)

      expect(onDelete).toHaveBeenCalledWith("123")
    })
  })
})
