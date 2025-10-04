# 🎨 Drag-and-Drop Reordering - Visual Guide

## UI Screenshots (Text Representation)

### Before: Normal Mode
```
┌────────────────────────────────────────────────────────────────┐
│  Teacher Dashboard           [🔽 Reorder Items] [🗑️ Clear All] │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📚 Grade 1                                          [✏️] [🗑️]  │
│     3 units                                                     │
│                                                                 │
│  📚 Grade 2                                          [✏️] [🗑️]  │
│     2 units                                                     │
│                                                                 │
│  📚 Grade 3                                          [✏️] [🗑️]  │
│     4 units                                                     │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

### After: Reorder Mode Active
```
┌────────────────────────────────────────────────────────────────┐
│  Teacher Dashboard      [💾 Save Order] [❌ Cancel] [🗑️ Clear] │
│                                            (disabled)           │
├────────────────────────────────────────────────────────────────┤
│  ℹ️ Toast: "Drag and drop items to reorder. Click Save..."    │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ⋮⋮  📚 Grade 1                                     [✏️] [🗑️]  │
│      3 units                                                    │
│                                                                 │
│  ⋮⋮  📚 Grade 2  ← (Dragging - 50% opacity)        [✏️] [🗑️]  │
│      2 units                                                    │
│  ┄┄┄┄┄┄┄┄┄┄┄┄┄┄  (Drop target indicator)                       │
│                                                                 │
│  ⋮⋮  📚 Grade 3                                     [✏️] [🗑️]  │
│      4 units                                                    │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

### After: Order Changed & Saved
```
┌────────────────────────────────────────────────────────────────┐
│  Teacher Dashboard           [🔽 Reorder Items] [🗑️ Clear All] │
├────────────────────────────────────────────────────────────────┤
│  ✅ Toast: "Order Saved: All items reordered successfully"     │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📚 Grade 1                                          [✏️] [🗑️]  │
│     3 units                                                     │
│                                                                 │
│  📚 Grade 3                                          [✏️] [🗑️]  │  ← Moved up
│     4 units                                                     │
│                                                                 │
│  📚 Grade 2                                          [✏️] [🗑️]  │  ← Moved down
│     2 units                                                     │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

---

## Button States

### Reorder Items Button (Normal Mode)
```
╔════════════════════╗
║  🔽 Reorder Items  ║  ← Blue background (#2563eb)
╚════════════════════╝     Hover: Darker blue (#1d4ed8)
```

### Save Order Button (Reorder Mode)
```
╔══════════════════╗
║  💾 Save Order   ║  ← Green background (#16a34a)
╚══════════════════╝     Hover: Darker green (#15803d)
```

### Cancel Button (Reorder Mode)
```
╔═══════════╗
║  ❌ Cancel ║  ← Gray background (#4b5563)
╚═══════════╝     Hover: Darker gray (#374151)
```

### Clear All Data Button (Disabled in Reorder Mode)
```
╔═══════════════════╗
║  🗑️ Clear All Data ║  ← Disabled: Gray (#9ca3af)
╚═══════════════════╝     Cannot click during reorder
```

---

## Drag Handle Icon

### In Normal Mode (Hidden)
```
  📚 Grade 1
     3 units
```

### In Reorder Mode (Visible)
```
⋮⋮  📚 Grade 1  ← Drag handle on left
    3 units       (grip vertical icon)
```

### While Hovering Drag Handle
```
╔═╗
║⋮⋮║ ← Cursor: grab (open hand)
╚═╝    Background: light gray
```

### While Dragging
```
╔═╗
║⋮⋮║ ← Cursor: grabbing (closed hand)
╚═╝    Item: 50% opacity
       Floating above other items
```

---

## Toast Notifications

### Entering Reorder Mode
```
┌────────────────────────────────────────────────────┐
│  ℹ️  Reorder Mode                              [✕] │
│                                                     │
│  Drag and drop items to reorder them.              │
│  Click Save when done.                             │
└────────────────────────────────────────────────────┘
```

### Saving Order
```
┌────────────────────────────────────────────────────┐
│  ✅  Order Saved                                [✕] │
│                                                     │
│  All items have been reordered successfully        │
└────────────────────────────────────────────────────┘
```

### Cancelling Reorder
```
┌────────────────────────────────────────────────────┐
│  ℹ️  Reorder Cancelled                          [✕] │
│                                                     │
│  Changes were not saved                            │
└────────────────────────────────────────────────────┘
```

---

## Interaction States

### 1. Normal Viewing
- No drag handles visible
- "Reorder Items" button visible
- All CRUD buttons (edit, delete) enabled
- Items are static, not draggable

### 2. Entering Reorder Mode
- Click "Reorder Items" button
- Drag handles (⋮⋮) fade in on left
- "Save Order" and "Cancel" buttons appear
- "Reorder Items" button disappears
- "Clear All Data" button disabled
- Blue toast notification appears
- Items shift right to make room for handles

### 3. During Drag
- Cursor changes to "grabbing" (closed hand)
- Dragged item opacity: 50%
- Dragged item follows cursor
- Other items shift to show drop target
- Smooth animations for all movements

### 4. After Drop
- Item snaps into new position
- Opacity returns to 100%
- Cursor returns to "grab" (open hand)
- Other items adjust to new order
- Changes are temporary (not saved yet)

### 5. Saving Changes
- Click "Save Order" button
- Loading state (brief)
- API calls update database
- Green success toast appears
- Exit reorder mode automatically
- Drag handles fade out
- "Reorder Items" button returns

### 6. Cancelling Changes
- Click "Cancel" button
- Items return to original order (animated)
- Info toast appears
- Exit reorder mode
- Drag handles fade out
- No API calls made

---

## CSS Classes & Styling

### Drag Handle
```css
.drag-handle {
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
  cursor: grab;
  padding: 8px;
  border-radius: 4px;
  color: #9ca3af; /* gray-400 */
}

.drag-handle:hover {
  background-color: #f3f4f6; /* gray-100 */
}

.drag-handle:active {
  cursor: grabbing;
}
```

### Dragging Item
```css
.item-dragging {
  opacity: 0.5;
  transition: opacity 200ms ease;
}
```

### Sortable Item
```css
.sortable-item {
  position: relative;
  transition: transform 200ms ease;
}

.sortable-item.reorder-mode {
  padding-left: 40px; /* Space for drag handle */
}
```

---

## Keyboard Accessibility

### Keyboard Navigation (Built into @dnd-kit)

1. **Tab** - Focus on drag handle
2. **Space** or **Enter** - Pick up item
3. **Arrow Up** - Move item up
4. **Arrow Down** - Move item down
5. **Space** or **Enter** - Drop item
6. **Escape** - Cancel drag

---

## Animation Details

### Smooth Transitions:
```css
/* Item movement */
transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1);

/* Opacity change */
transition: opacity 200ms ease-in-out;

/* Button hover */
transition: background-color 150ms ease;

/* Drag handle appearance */
transition: opacity 300ms ease-in-out;
```

---

## Color Palette

### Buttons:
- **Reorder (Blue):** #2563eb → #1d4ed8 (hover)
- **Save (Green):** #16a34a → #15803d (hover)
- **Cancel (Gray):** #4b5563 → #374151 (hover)
- **Delete (Red):** #dc2626 → #b91c1c (hover)

### Drag Handle:
- **Icon:** #9ca3af (gray-400)
- **Hover Background:** #f3f4f6 (gray-100)
- **Active Background:** #e5e7eb (gray-200)

### Toast Notifications:
- **Info:** Blue theme
- **Success:** Green theme
- **Error:** Red theme

---

## Responsive Behavior

### Desktop (≥1024px):
```
┌─────────────────────────────────────────────────────┐
│  Teacher Dashboard      [Buttons aligned right]     │
│                                                      │
│  ⋮⋮  Large cards with full details                  │
└─────────────────────────────────────────────────────┘
```

### Tablet (768px - 1023px):
```
┌───────────────────────────────────────┐
│  Teacher Dashboard                    │
│  [Buttons stacked or wrapped]         │
│                                        │
│  ⋮⋮  Medium cards                     │
└───────────────────────────────────────┘
```

### Mobile (<768px):
```
┌─────────────────────────────┐
│  Teacher Dashboard          │
│  [Buttons full width]       │
│                              │
│  ⋮⋮  Compact cards          │
│     (reduced padding)        │
└─────────────────────────────┘
```

---

## Dark Mode Support

### Light Mode:
- Background: White (#ffffff)
- Text: Dark gray (#111827)
- Borders: Light gray (#e5e7eb)
- Drag handle: Gray (#9ca3af)

### Dark Mode:
- Background: Dark gray (#1f2937)
- Text: White (#f9fafb)
- Borders: Dark border (#374151)
- Drag handle: Light gray (#6b7280)

---

## User Flow Diagram

```
                  ┌─────────────────┐
                  │  View Dashboard │
                  └────────┬────────┘
                           │
                           ▼
                  ┌────────────────────┐
                  │ Click "Reorder     │
                  │ Items" button  🔽  │
                  └────────┬───────────┘
                           │
                           ▼
          ┌────────────────┴────────────────┐
          │  Reorder Mode Active            │
          │  - Drag handles visible ⋮⋮      │
          │  - Save/Cancel buttons shown    │
          └────────┬────────────────────────┘
                   │
         ┌─────────┴─────────┐
         │                   │
         ▼                   ▼
    ┌────────┐         ┌──────────┐
    │  Drag  │         │  Cancel  │
    │  Items │         └────┬─────┘
    └───┬────┘              │
        │                   │
        ▼                   ▼
    ┌────────────┐    ┌──────────────┐
    │ Save Order │    │ Discard      │
    └─────┬──────┘    │ Changes      │
          │           └──────┬───────┘
          │                  │
          └─────────┬────────┘
                    │
                    ▼
           ┌─────────────────┐
           │ Exit Reorder    │
           │ Mode            │
           │ (Back to normal)│
           └─────────────────┘
```

---

**This visual guide shows exactly how the drag-and-drop reordering feature looks and behaves!** 🎨✨
