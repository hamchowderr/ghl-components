# GHL Hooks Usage Examples

This document provides examples of how to use the `useGHLQuery` and `useGHLMutation` hooks for working with the GoHighLevel API.

## Prerequisites

Make sure your component is wrapped in a `GHLProvider`:

```tsx
import { GHLProvider } from "@/registry/new-york/auth/ghl-provider"

function App() {
  return (
    <GHLProvider apiKey="your-api-key">
      <YourComponent />
    </GHLProvider>
  )
}
```

## Basic Query Example

Fetch contacts from a location:

```tsx
import { useGHLQuery } from "@/hooks/use-ghl-query"

function ContactsList({ locationId }: { locationId: string }) {
  const { data, isLoading, error, refetch } = useGHLQuery(
    ['contacts', locationId],
    (client) => client.contacts.searchContactsAdvanced({ locationId })
  )

  if (isLoading) return <div>Loading contacts...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <button onClick={refetch}>Refresh</button>
      <ul>
        {data?.contacts?.map((contact) => (
          <li key={contact.id}>{contact.name}</li>
        ))}
      </ul>
    </div>
  )
}
```

## Query with Auto-Refetch

Automatically refresh data every 30 seconds:

```tsx
import { useGHLQuery } from "@/hooks/use-ghl-query"

function LiveDashboard({ locationId }: { locationId: string }) {
  const { data, isLoading } = useGHLQuery(
    ['conversations', locationId],
    (client) => client.conversations.getConversations({ locationId }),
    {
      refetchInterval: 30000, // 30 seconds
      onSuccess: (data) => {
        console.log('Updated conversations:', data)
      }
    }
  )

  return (
    <div>
      {isLoading ? 'Loading...' : `${data?.conversations?.length || 0} active conversations`}
    </div>
  )
}
```

## Basic Mutation Example

Create a new contact:

```tsx
import { useGHLMutation } from "@/hooks/use-ghl-mutation"
import { useState } from "react"

function CreateContactForm({ locationId }: { locationId: string }) {
  const [firstName, setFirstName] = useState("")
  const [email, setEmail] = useState("")

  const { mutate, isLoading, error } = useGHLMutation(
    (client, input: { locationId: string; firstName: string; email: string }) =>
      client.contacts.createContact(input),
    {
      onSuccess: () => {
        alert('Contact created!')
        setFirstName("")
        setEmail("")
      },
      onError: (error) => {
        alert(`Failed: ${error.message}`)
      },
      invalidateQueries: [['contacts', locationId]]
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutate({ locationId, firstName, email })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        placeholder="First Name"
        disabled={isLoading}
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        disabled={isLoading}
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Contact'}
      </button>
      {error && <p>Error: {error.message}</p>}
    </form>
  )
}
```

## Combined Query and Mutation

List contacts with ability to delete:

```tsx
import { useGHLQuery } from "@/hooks/use-ghl-query"
import { useGHLMutation } from "@/hooks/use-ghl-mutation"

function ContactsManager({ locationId }: { locationId: string }) {
  const { data, isLoading, refetch } = useGHLQuery(
    ['contacts', locationId],
    (client) => client.contacts.searchContactsAdvanced({ locationId })
  )

  const { mutate: deleteContact, isLoading: isDeleting } = useGHLMutation(
    (client, contactId: string) => client.contacts.deleteContact(contactId),
    {
      onSuccess: () => {
        refetch() // Manually refetch after deletion
      },
      invalidateQueries: [['contacts', locationId]]
    }
  )

  if (isLoading) return <div>Loading...</div>

  return (
    <ul>
      {data?.contacts?.map((contact) => (
        <li key={contact.id}>
          {contact.name}
          <button
            onClick={() => deleteContact(contact.id)}
            disabled={isDeleting}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  )
}
```

## Using mutateAsync for Sequential Operations

When you need to wait for mutation completion:

```tsx
import { useGHLMutation } from "@/hooks/use-ghl-mutation"
import { useState } from "react"

function BulkContactCreator({ locationId }: { locationId: string }) {
  const [status, setStatus] = useState("")

  const { mutateAsync, isLoading } = useGHLMutation(
    (client, contact: { firstName: string; email: string }) =>
      client.contacts.createContact({ ...contact, locationId }),
    {
      invalidateQueries: [['contacts', locationId]]
    }
  )

  const createMultipleContacts = async () => {
    const contacts = [
      { firstName: "John", email: "john@example.com" },
      { firstName: "Jane", email: "jane@example.com" },
      { firstName: "Bob", email: "bob@example.com" }
    ]

    for (const contact of contacts) {
      try {
        await mutateAsync(contact)
        setStatus(`Created ${contact.firstName}`)
      } catch (error) {
        setStatus(`Failed to create ${contact.firstName}`)
        break
      }
    }

    setStatus("All contacts created!")
  }

  return (
    <div>
      <button onClick={createMultipleContacts} disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Multiple Contacts'}
      </button>
      <p>{status}</p>
    </div>
  )
}
```

## Conditional Query

Only run query when certain conditions are met:

```tsx
import { useGHLQuery } from "@/hooks/use-ghl-query"

function ContactDetails({ contactId }: { contactId: string | null }) {
  const { data, isLoading } = useGHLQuery(
    ['contact', contactId || 'none'],
    (client) => client.contacts.getContact(contactId!),
    {
      enabled: !!contactId, // Only fetch if contactId exists
      onSuccess: (data) => {
        console.log('Contact loaded:', data)
      }
    }
  )

  if (!contactId) return <div>Select a contact</div>
  if (isLoading) return <div>Loading contact...</div>

  return <div>{data?.contact?.name}</div>
}
```

## Error Handling

Comprehensive error handling pattern:

```tsx
import { useGHLMutation } from "@/hooks/use-ghl-mutation"
import { useState } from "react"

function UpdateContactForm({ contactId }: { contactId: string }) {
  const [errorMessage, setErrorMessage] = useState("")

  const { mutate, isLoading, error, reset } = useGHLMutation(
    (client, updates: { firstName?: string; email?: string }) =>
      client.contacts.updateContact(contactId, updates),
    {
      onSuccess: () => {
        setErrorMessage("")
        alert('Updated successfully!')
      },
      onError: (error) => {
        // Custom error handling
        if (error.message.includes('duplicate')) {
          setErrorMessage('Email already exists')
        } else if (error.message.includes('invalid')) {
          setErrorMessage('Invalid email format')
        } else {
          setErrorMessage('An error occurred')
        }
      }
    }
  )

  return (
    <div>
      <button onClick={() => mutate({ firstName: "Updated Name" })}>
        Update Contact
      </button>
      {errorMessage && (
        <div>
          <p>Error: {errorMessage}</p>
          <button onClick={reset}>Dismiss</button>
        </div>
      )}
    </div>
  )
}
```

## Advanced: Optimistic Updates

Update UI immediately before server confirms:

```tsx
import { useGHLQuery } from "@/hooks/use-ghl-query"
import { useGHLMutation } from "@/hooks/use-ghl-mutation"
import { useState } from "react"

function TodoList({ locationId }: { locationId: string }) {
  const [optimisticData, setOptimisticData] = useState<any>(null)

  const { data, refetch } = useGHLQuery(
    ['tasks', locationId],
    (client) => client.tasks.getTasks(locationId)
  )

  const { mutate: completeTask } = useGHLMutation(
    (client, taskId: string) => client.tasks.updateTask(taskId, { completed: true }),
    {
      onSuccess: () => {
        setOptimisticData(null)
        refetch()
      },
      onError: () => {
        setOptimisticData(null)
        alert('Failed to complete task')
      }
    }
  )

  const handleComplete = (taskId: string) => {
    // Optimistically update UI
    const updated = data?.tasks?.map(task =>
      task.id === taskId ? { ...task, completed: true } : task
    )
    setOptimisticData(updated)

    // Send request to server
    completeTask(taskId)
  }

  const displayData = optimisticData || data?.tasks

  return (
    <ul>
      {displayData?.map((task) => (
        <li key={task.id}>
          {task.title} - {task.completed ? 'Done' : 'Pending'}
          {!task.completed && (
            <button onClick={() => handleComplete(task.id)}>
              Complete
            </button>
          )}
        </li>
      ))}
    </ul>
  )
}
```

## Best Practices

1. **Query Keys**: Use descriptive, hierarchical query keys
   ```tsx
   // Good
   ['contacts', locationId, 'recent']
   ['conversations', locationId, conversationId]

   // Avoid
   ['data']
   ['contacts']
   ```

2. **Error Handling**: Always handle errors gracefully
   ```tsx
   const { data, error } = useGHLQuery(...)
   if (error) {
     return <ErrorComponent message={error.message} />
   }
   ```

3. **Loading States**: Show loading indicators
   ```tsx
   {isLoading ? <Spinner /> : <DataDisplay data={data} />}
   ```

4. **Query Invalidation**: Invalidate queries after mutations
   ```tsx
   useGHLMutation(mutationFn, {
     invalidateQueries: [['contacts', locationId]]
   })
   ```

5. **Refetch Intervals**: Use sparingly to avoid excessive API calls
   ```tsx
   // Only for real-time critical data
   useGHLQuery(key, fetcher, { refetchInterval: 5000 })
   ```
