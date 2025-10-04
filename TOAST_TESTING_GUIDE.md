# Toast Notification Testing Guide

## Quick Start - How to Test Toast Notifications

### 1. Access the Application
Open your browser and navigate to: **http://localhost:3000/admin**

Password: `admin123`

---

## Testing Success Toasts (Green ✅)

### Test 1: Create a Study Level
1. Scroll to "Add New Study Level" section
2. Enter a name (e.g., "Grade 1")
3. Click the **+** button
4. **Expected Result:**
   - Green toast appears in top-right corner
   - Title: "Level Created"
   - Message: "Grade 1" has been created successfully
   - Auto-dismisses after 5 seconds
   - Can manually dismiss with X button

### Test 2: Create a Unit
1. Expand the level you just created
2. Find "Add New Unit" input
3. Enter a unit name (e.g., "Unit 1: Colors")
4. Click the **+** button
5. **Expected Result:**
   - Green success toast with unit name

### Test 3: Create a Lesson
1. Expand the unit you created
2. Find "Add New Lesson" input
3. Enter lesson name (e.g., "Basic Colors")
4. Click the **+** button
5. **Expected Result:**
   - Green success toast with lesson name

### Test 4: Add a Single Word
1. Click "Add Word" button on a lesson
2. Fill in all fields:
   - English: "red"
   - Arabic: "أحمر"
   - Part of Speech: "adjective"
3. Click "Add Word"
4. **Expected Result:**
   - Green toast: "Word Added" - "red" has been added successfully

### Test 5: Bulk Word Import
1. Click "Add Bulk Words" on a lesson
2. Paste this JSON:
```json
{
  "Colors": [
    {"en": "blue", "ar": "أزرق", "part": "adjective"},
    {"en": "green", "ar": "أخضر", "part": "adjective"}
  ]
}
```
3. Click "Add Words"
4. **Expected Result:**
   - Green toast: "Words Added" - Successfully added 2 words

### Test 6: Edit Section Name
1. Click "Manage Sections" on a lesson
2. Click edit icon (pencil) on a section
3. Change name and press Enter
4. **Expected Result:**
   - Green toast: "Section Renamed" - Shows word count updated

---

## Testing Error Toasts (Red ❌)

### Test 7: Empty Field Validation - Level
1. Go to "Add New Study Level"
2. Leave the input **empty**
3. Click the **+** button
4. **Expected Result:**
   - Red toast appears
   - Title: "Validation Error"
   - Message: "Please enter a level name"

### Test 8: Empty Field Validation - Word
1. Click "Add Word" on a lesson
2. Leave English field empty
3. Try to add the word
4. **Expected Result:**
   - Red toast: "Validation Error" - Please fill in all fields (English, Arabic, and Part of Speech)

### Test 9: Invalid JSON Format
1. Click "Add Bulk Words"
2. Enter invalid JSON:
```
{Colors: [bad json]}
```
3. Click "Add Words"
4. **Expected Result:**
   - Red toast: "Invalid JSON Format" - Please check your JSON syntax and try again

### Test 10: Delete Last Section
1. Create a lesson with only ONE section
2. Click "Manage Sections"
3. Try to delete the only section
4. **Expected Result:**
   - Red toast: "Cannot Delete" - You must have at least one section
   - Section is NOT deleted

---

## Testing Toast Behavior

### Test 11: Auto-Dismiss Timer
1. Trigger any success toast
2. Don't touch it
3. Wait 5 seconds
4. **Expected Result:**
   - Toast automatically disappears after exactly 5 seconds

### Test 12: Manual Dismiss
1. Trigger any toast
2. Immediately click the **X** button
3. **Expected Result:**
   - Toast disappears immediately

### Test 13: Multiple Toasts Stacking
1. Quickly create 3 levels in a row (spam the + button)
2. **Expected Result:**
   - Three green toasts stack vertically
   - Each auto-dismisses independently
   - No overlap, clean spacing

### Test 14: Toast Animation
1. Trigger a toast and watch carefully
2. **Expected Result:**
   - Slides in from the right with smooth animation
   - Takes ~0.3 seconds to fully appear

---

## Testing Dark Mode

### Test 15: Dark Mode Toast Appearance
1. Enable dark mode (if available in system/browser)
2. Trigger various toasts
3. **Expected Result:**
   - Success toast: Dark green background, light text
   - Error toast: Dark red background, light text
   - All text remains readable
   - Icons visible and clear

---

## Testing on Different Screen Sizes

### Test 16: Mobile View (< 640px)
1. Resize browser to mobile width
2. Trigger a toast with long message
3. **Expected Result:**
   - Toast adjusts width appropriately
   - Text wraps if needed
   - Still positioned at top-right (or top-center on very small screens)
   - Doesn't extend beyond viewport

### Test 17: Tablet View (768px)
1. Resize to tablet width
2. Trigger multiple toasts
3. **Expected Result:**
   - Toasts remain visible and readable
   - Proper spacing maintained

---

## Edge Cases to Test

### Test 18: Very Long Error Message
1. Create a level with a very long name (100+ characters)
2. Try to create another with same name (if duplicate checking exists)
3. **Expected Result:**
   - Toast wraps text properly
   - Doesn't break layout
   - Still dismissable

### Test 19: Network Error Simulation
1. Open DevTools → Network tab
2. Set "Throttling" to "Offline"
3. Try to create a level
4. **Expected Result:**
   - Red toast appears
   - Title: "Failed to Create Level"
   - Message includes network error info

### Test 20: Rapid Spam Test
1. Click "Add Level" button 10 times rapidly
2. **Expected Result:**
   - Toasts appear in order
   - No crashes or overlaps
   - All eventually dismiss

---

## Success Criteria

✅ **All tests pass if:**
- Success toasts are green with checkmark icon
- Error toasts are red with exclamation icon  
- All messages are clear and descriptive
- Auto-dismiss works consistently at 5 seconds
- Manual dismiss works immediately
- Multiple toasts stack without overlap
- Animations are smooth
- Dark mode variants are readable
- Responsive on all screen sizes
- No console errors appear

---

## Troubleshooting

**Toast doesn't appear:**
- Check browser console for errors
- Verify dev server is running
- Refresh the page

**Toast appears but no message:**
- Check if error object has proper structure
- Verify toast state is updating

**Animation is choppy:**
- Check system performance
- Try different browser
- Check for conflicting CSS

**Toast blocks UI elements:**
- Report positioning issue
- May need to adjust z-index or position

---

## Reporting Issues

If you find any issues during testing, document them in **TESTING.md** under Section 6: Bugs Found

Include:
- Test number and description
- Expected behavior
- Actual behavior  
- Screenshot (if visual issue)
- Browser/device information
- Steps to reproduce

---

*Happy Testing! 🧪*
