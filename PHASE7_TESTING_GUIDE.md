# 🧪 Phase 7 Authentication Testing Guide

## Quick Start Testing

### Test 1: Login to Admin Dashboard ✨

**Test the authentication flow:**

1. **Open your browser** and navigate to:
   ```
   http://localhost:3000/login
   ```

2. **Enter the credentials:**
   - **Email:** `admin@vocabguide.com`
   - **Password:** `ChangeMe123!`

3. **Click "Sign In"**

4. **Expected Results:**
   - ✅ Loading spinner appears ("Signing in...")
   - ✅ Redirects to `/admin` dashboard
   - ✅ See "Logged in as: admin@vocabguide.com" at top
   - ✅ See "Logout" button
   - ✅ Full teacher dashboard loads

---

### Test 2: Protected Route Access 🔒

**Test that admin routes are protected:**

1. **Logout first** (click Logout button if logged in)

2. **Try to access admin directly:**
   ```
   http://localhost:3000/admin
   ```

3. **Expected Results:**
   - ✅ Automatically redirects to `/login`
   - ✅ Cannot access admin without authentication
   - ✅ See login form

---

### Test 3: Wrong Credentials ❌

**Test error handling:**

1. **Go to login page:**
   ```
   http://localhost:3000/login
   ```

2. **Enter wrong password:**
   - Email: `admin@vocabguide.com`
   - Password: `WrongPassword123`

3. **Click "Sign In"**

4. **Expected Results:**
   - ✅ Red error message: "Invalid email or password"
   - ✅ Stays on login page
   - ✅ Form remains functional

---

### Test 4: Session Persistence 💾

**Test that sessions persist:**

1. **Login to admin dashboard** (Test 1)

2. **Refresh the page** (F5 or Ctrl+R)

3. **Expected Results:**
   - ✅ Still logged in
   - ✅ Dashboard loads immediately
   - ✅ No redirect to login

---

### Test 5: Logout Functionality 🚪

**Test logout flow:**

1. **While logged in, click "Logout" button**

2. **Expected Results:**
   - ✅ Redirects to `/login` page
   - ✅ Session destroyed
   - ✅ See login form

3. **Try to go back to admin:**
   ```
   http://localhost:3000/admin
   ```

4. **Expected Result:**
   - ✅ Redirects back to login (not authenticated)

---

### Test 6: Student Pages (Public Access) 👨‍🎓

**Test that students can access lessons without login:**

1. **Logout or open incognito window**

2. **Navigate through student interface:**
   ```
   http://localhost:3000
   ```

3. **Expected Results:**
   - ✅ Home page loads (study levels visible)
   - ✅ Can click on a study level
   - ✅ Can click on a unit
   - ✅ Can view lessons
   - ✅ Can see word cards
   - ✅ Text-to-speech works
   - ✅ **NO authentication required for students!**

---

### Test 7: API Protection 🛡️

**Test that API write operations are protected:**

1. **Logout from admin** (or use Postman/curl)

2. **Try to create a study level via API:**

   **PowerShell:**
   ```powershell
   Invoke-WebRequest -Uri http://localhost:3000/api/levels -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"name":"Unauthorized Test","slug":"unauthorized-test"}'
   ```

   **Or using curl (if installed):**
   ```bash
   curl -X POST http://localhost:3000/api/levels \
     -H "Content-Type: application/json" \
     -d '{"name":"Unauthorized Test","slug":"unauthorized-test"}'
   ```

3. **Expected Results:**
   - ✅ Returns 401 Unauthorized error
   - ✅ Level is NOT created
   - ✅ Database remains unchanged

4. **Test GET request (should work without auth):**

   **PowerShell:**
   ```powershell
   Invoke-WebRequest -Uri http://localhost:3000/api/levels
   ```

5. **Expected Results:**
   - ✅ Returns 200 OK
   - ✅ Returns list of study levels
   - ✅ Students can read data without authentication

---

## 🎯 Expected Behavior Summary

### What's Protected (Requires Login) 🔒
- `/admin` - Teacher dashboard
- `POST /api/levels` - Create study level
- `PUT /api/levels/:id` - Update study level
- `DELETE /api/levels/:id` - Delete study level
- `POST /api/units` - Create unit
- `PUT /api/units/:id` - Update unit
- `DELETE /api/units/:id` - Delete unit
- `POST /api/lessons` - Create lesson
- `PUT /api/lessons/:id` - Update lesson
- `DELETE /api/lessons/:id` - Delete lesson
- `POST /api/words` - Create word
- `PUT /api/words/:id` - Update word
- `DELETE /api/words/:id` - Delete word

### What's Public (No Login Required) 🌐
- `/` - Home page (study levels)
- `/[level]` - Study level page (units)
- `/[level]/[unit]` - Unit page (lessons)
- `/[level]/[unit]/[lesson]` - Lesson page (words)
- `GET /api/levels` - Read study levels
- `GET /api/units` - Read units
- `GET /api/lessons` - Read lessons
- `GET /api/words` - Read words

---

## 🐛 Common Issues & Solutions

### Issue 1: "Cannot connect to server"
**Solution:** Make sure dev server is running:
```bash
npm run dev
```

### Issue 2: "Invalid credentials" even with correct password
**Solution:** Check if admin user was created:
```bash
npx tsx prisma/seed-admin.ts
```

### Issue 3: Redirects to login but shows blank page
**Solution:** Clear browser cache and cookies:
- Chrome: Ctrl+Shift+Delete
- Firefox: Ctrl+Shift+Delete
- Edge: Ctrl+Shift+Delete

### Issue 4: "AUTH_SECRET" error
**Solution:** Check `.env` file has:
```env
AUTH_SECRET="vocabguide-super-secret-key-change-in-production-2024"
AUTH_URL="http://localhost:3000"
```

---

## ✅ Testing Checklist

Use this checklist to verify all functionality:

- [ ] ✅ Can access login page
- [ ] ✅ Can login with correct credentials
- [ ] ✅ Login shows error with wrong credentials
- [ ] ✅ Unauthenticated users redirected from /admin
- [ ] ✅ Session persists after page refresh
- [ ] ✅ Logout button works correctly
- [ ] ✅ Can logout and cannot access /admin after
- [ ] ✅ Student pages work without authentication
- [ ] ✅ Can navigate through study levels → units → lessons → words
- [ ] ✅ API write operations blocked without auth (401 error)
- [ ] ✅ API read operations work without auth (200 OK)
- [ ] ✅ Multiple browser tabs maintain session
- [ ] ✅ Dark mode works on login page
- [ ] ✅ Loading states show during login
- [ ] ✅ User email displayed on admin dashboard

---

## 📸 Screenshots to Verify

### Login Page
- Modern gradient background (blue to indigo)
- Lock icon at top
- "Teacher Login" heading
- Email and password fields with icons
- "Sign In" button
- "Forgot password? Contact administrator" text

### Admin Dashboard (Logged In)
- "Admin Dashboard" heading
- "Logged in as: admin@vocabguide.com" text
- Red "Logout" button at top right
- Full teacher dashboard interface below

### Protected Route Redirect
- Trying to access `/admin` without login redirects to `/login`
- Browser URL changes from `/admin` to `/login`

---

## 🎉 Success Criteria

**Phase 7 Core Authentication is COMPLETE when:**

1. ✅ Teachers can login with email/password
2. ✅ Admin dashboard is protected (requires authentication)
3. ✅ Sessions persist across page refreshes
4. ✅ Logout works correctly
5. ✅ Student pages remain public (no login required)
6. ✅ API write operations are protected
7. ✅ API read operations remain public
8. ✅ Passwords are hashed in database (check with Prisma Studio)
9. ✅ Error messages are user-friendly
10. ✅ Loading states provide feedback

---

## 🚀 Next Steps After Testing

Once all tests pass:

1. **Optional Enhancements:**
   - Add rate limiting for login attempts
   - Implement password reset flow
   - Create user management interface
   - Add audit logging

2. **Move to Next Phase:**
   - Continue with Phase 7 advanced features
   - OR move to Phase 3 (Arabic UI)
   - OR move to Phase 4 (Reliability)

---

*Happy Testing! 🎉*
