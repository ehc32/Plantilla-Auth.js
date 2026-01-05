# Toast Notification System - Sonner Integration

## Overview

This project now uses **Sonner** (by [Emil Kowalski](https://sonner.emilkowal.ski/)) - a modern, beautiful toast notification library that's the recommended choice for Shadcn UI applications.

## Why Sonner?

We upgraded from `react-hot-toast` to Sonner for the following reasons:

✨ **Better Design** - Premium, modern toast notifications with smooth animations  
🎨 **Consistent Styling** - Seamlessly integrates with Shadcn UI design system  
🌓 **Dark Mode Support** - Automatic theme detection and adaptation  
🎯 **Rich Features** - Support for actions, descriptions, promises, and more  
⚡ **Better Performance** - Optimized animations and rendering  

## Features

### Basic Toast Types

```typescript
import { toast } from "sonner"

// Success toast
toast.success("Profile updated successfully")

// Error toast
toast.error("Failed to update profile")

// Warning toast
toast.warning("This action cannot be undone")

// Info toast
toast.info("New features available")

// Loading toast
toast.loading("Uploading...")
```

### Rich Content Toasts

```typescript
// Toast with description
toast.success("Profile Updated", {
  description: "Your profile has been updated successfully",
})

// Toast with action button
toast("Event created", {
  action: {
    label: "View",
    onClick: () => console.log("View clicked"),
  },
})

// Toast with cancel button
toast.error("Delete failed", {
  cancel: {
    label: "Dismiss",
    onClick: () => console.log("Cancelled"),
  },
})
```

### Promise Toasts

Perfect for async operations:

```typescript
toast.promise(
  fetch("/api/update"),
  {
    loading: "Updating...",
    success: "Updated successfully!",
    error: "Update failed",
  }
)
```

### Custom Duration

```typescript
toast.success("Quick message", {
  duration: 2000, // 2 seconds
})

toast.info("Important message", {
  duration: 10000, // 10 seconds
})
```

### Advanced Options

```typescript
toast.success("Message", {
  position: "top-center", // top-left, top-center, top-right, bottom-left, bottom-center, bottom-right
  duration: 5000,
  dismissible: true, // Can be closed by user
  closeButton: true, // Show close button
})
```

## Styling

Custom toast styles are defined in `src/app/globals.css`:

- **Glass morphism effect** with backdrop blur
- **Color-coded borders** for different toast types (success, error, warning, info)
- **Semi-transparent backgrounds** for a modern look
- **Custom icons** with matching colors
- **Smooth animations** on enter/exit
- **Responsive shadows** for depth

## Migration from react-hot-toast

The migration is complete! All instances of `react-hot-toast` have been replaced with Sonner:

### Files Updated:
- ✅ `src/app/layout.tsx` - Toaster component
- ✅ `src/app/admin/account/page.tsx`
- ✅ `src/app/admin/settings/page.tsx`
- ✅ `src/app/admin/sessions/page.tsx`
- ✅ `src/app/auth/forgot-password/page.tsx`
- ✅ `src/app/auth/reset-password/page.tsx`
- ✅ `src/components/admin/user-add-dialog.tsx`
- ✅ `src/components/admin/user-ban-dialog.tsx`
- ✅ `src/components/admin/user-delete-dialog.tsx`
- ✅ `src/components/admin/user-revoke-sessions-dialog.tsx`
- ✅ `src/components/admin/user-role-dialog.tsx`
- ✅ `src/components/admin/user-unban-dialog.tsx`

### API Compatibility:
The basic API is similar:
```typescript
// Old (react-hot-toast)
toast.success("Message")
toast.error("Error")

// New (Sonner) - Same!
toast.success("Message")
toast.error("Error")
```

## Examples in Codebase

Check these files for real-world examples:

1. **Profile Updates**: `src/app/admin/account/page.tsx`
   - Success messages for profile saves
   - Error handling for failed updates
   - Session revocation notifications

2. **User Management**: `src/components/admin/user-*.tsx`
   - User creation confirmations
   - Ban/unban notifications
   - Role update messages
   - Delete confirmations

3. **Authentication**: `src/app/auth/*`
   - Password reset confirmations
   - Email sent notifications
   - Error messages

## Learn More

- [Sonner Documentation](https://sonner.emilkowal.ski/)
- [Shadcn UI Docs](https://ui.shadcn.com/docs/components/sonner)
- [GitHub Repository](https://github.com/emilkowalski/sonner)

---

**Note**: The old `react-hot-toast` package can be removed from dependencies if desired, though it's kept for backwards compatibility during the transition period.
