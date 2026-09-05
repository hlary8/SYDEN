# Mobile Admin Access Testing Checklist
## Development Server: http://localhost:5173

### ✅ Testing Instructions for Admin User

#### Test Environment:
- **Server Running**: YES ✓ (localhost:5173)
- **Mobile View**: Use browser DevTools (F12 → Toggle Device Toolbar → iPhone SE or similar)
- **Login**: Use admin credentials

---

## 📱 DELEON Division Testing

### Mobile View (Phone Size):
1. Go to: `http://localhost:5173/deleon`
2. Open DevTools (F12) → Toggle Device Toolbar
3. Select **iPhone SE** (375px width) or **iPhone 12** (390px)
4. Verify:
   - [ ] Logo "DELEON" visible on left
   - [ ] Desktop menu hidden (only shows on md: breakpoint)
   - **NEW - Admin Buttons Visible on Mobile:**
     - [ ] Small "ADMIN" button (gold/yellow)
     - [ ] Small "LAND" button (bordered)
   - [ ] Both buttons clickable

5. Test Admin Access:
   - Click "ADMIN" → Should go to `/deleon/admin`
   - Click "LAND" → Should go to `/deleon/admin/upload`

---

## 🐄 Syden Division Testing

### Mobile View (Phone Size):
1. Go to: `http://localhost:5173/syden`
2. Open DevTools (F12) → Toggle Device Toolbar
3. Select **iPhone SE** or **iPhone 12**
4. Verify:
   - [ ] Logo "Syden" visible on left
   - [ ] Desktop menu hidden
   - **Admin Buttons (Already Implemented):**
     - [ ] Small "ADMIN" button (coral/orange #E2725B)
     - [ ] Small "FARM" button (bordered)
   - [ ] Both buttons clickable

5. Test Admin Access:
   - Click "ADMIN" → Should go to `/syden/admin`
   - Click "FARM" → Should go to `/syden/admin/farm-activities`

---

## 🥕 DeeFresh Division Testing

### Mobile View (Phone Size):
1. Go to: `http://localhost:5173/deefresh`
2. Open DevTools (F12) → Toggle Device Toolbar
3. Select **iPhone SE** or **iPhone 12**
4. Verify:
   - [ ] Logo "DeeFresh" visible on left
   - [ ] Desktop menu hidden
   - **NEW - Admin Buttons Now Visible on Mobile:**
     - [ ] Small "ADMIN" button (gold #FFD700)
     - [ ] Small "PRODUCE" button (bordered)
   - [ ] Both buttons clickable

5. Test Admin Access:
   - Click "ADMIN" → Should go to `/deefresh/admin`
   - Click "PRODUCE" → Should go to `/deefresh/admin/produce-upload`

---

## 🌐 Responsive Design Tests

### Test on Different Screen Sizes:
1. **Mobile (375px - 425px)**: Admin buttons visible
2. **Tablet (768px)**: Admin buttons hidden, desktop menu shown
3. **Desktop (1024px+)**: Full desktop navigation visible

### Test Breakpoints in DevTools:
- [ ] iPhone SE (375px)
- [ ] iPhone 12 (390px)
- [ ] iPhone 12 Pro Max (428px)
- [ ] iPad (768px) - should hide mobile admin buttons
- [ ] Desktop (1024px+) - full desktop menu shown

---

## 🔐 Admin Authentication Tests

### Before Testing Admin Access:
You need to be logged in as an admin user.

**Login Route**: `http://localhost:5173/auth/login`

Steps:
1. Use admin email & password
2. You should see admin buttons appear in mobile nav
3. Click admin buttons to access protected routes

### Admin Routes to Test:
#### DELEON:
- `/deleon/admin` - Main admin dashboard
- `/deleon/admin/upload` - Upload land listings

#### Syden:
- `/syden/admin` - Main livestock admin dashboard
- `/syden/admin/farm-activities` - Manage farm activities
- `/syden/admin/livestock-upload` - Add livestock
- `/syden/admin/inquiries` - View inquiries

#### DeeFresh:
- `/deefresh/admin` - Main admin dashboard
- `/deefresh/admin/produce-upload` - Add produce
- `/deefresh/admin/farmers` - Farmers management
- `/deefresh/admin/seeds` - Seeds management

---

## 🎨 Visual Verification Checklist

### Mobile Navbar Layout (all three brands):
```
┌─────────────────────────────────┐
│ BRAND  [Admin] [Category]      │ ← Mobile view only
│ (md:hidden flex items-center)   │
└─────────────────────────────────┘

On tablets/desktop:
┌──────────────────────────────────────────┐
│ BRAND  Home  Lands  About  Admin  Contact│ ← Desktop only
│        (hidden sm:flex md:flex)          │
└──────────────────────────────────────────┘
```

### Button Styling:
- **DELEON Admin**: Gold background (#F4C430 or yellow-300)
- **DELEON Land**: Gold border with text
- **Syden Admin**: Coral/orange (#E2725B)
- **Syden Farm**: Coral border with text
- **DeeFresh Admin**: Gold (#FFD700)
- **DeeFresh Produce**: Gold border with text

---

## ✅ Quick Test Sequence

1. **Start Dev Server**: `npm run dev` ✓
2. **Open http://localhost:5173**
3. **Open DevTools** (F12)
4. **Toggle Device Toolbar** (Ctrl+Shift+M)
5. **Select iPhone SE**
6. **Visit each division**:
   - [ ] `/deleon` - Check for Admin + Land buttons
   - [ ] `/syden` - Check for Admin + Farm buttons
   - [ ] `/deefresh` - Check for Admin + Produce buttons
7. **Login if needed** to test protected routes
8. **Click each button** to verify navigation works
9. **Resize to tablet** (768px) - buttons should disappear
10. **Resize back to mobile** - buttons should reappear

---

## 🐛 Troubleshooting

### Admin buttons not showing?
- Check: Are you logged in as an admin user?
- Check: Browser DevTools showing mobile view (375-428px)?
- Check: Not on tablet/desktop viewport (768px+)?
- Verify: User role in AuthContext is 'admin'

### Links not working?
- Check: Is the route path correct in the Link component?
- Check: No typos in route definitions
- Verify: Backend API is running on port 4000 (if needed)

### Styling looks wrong?
- Hard refresh: Ctrl+Shift+R (clear cache)
- Check: Tailwind CSS is building correctly
- Verify: Color classes match brand theme

---

## 📊 Expected Results

| Division | Mobile Admin | Mobile Category | Desktop Menu |
|----------|-------------|-----------------|--------------|
| DELEON   | ✓ Shows     | ✓ Land          | ✓ Full nav   |
| Syden    | ✓ Shows     | ✓ Farm          | ✓ Full nav   |
| DeeFresh | ✓ Shows     | ✓ Produce       | ✓ Full nav   |

---

## 🎯 Success Criteria

✅ **ALL CONDITIONS MUST BE MET:**
1. Mobile buttons appear on screens < 768px
2. Mobile buttons hidden on screens ≥ 768px
3. All three divisions have consistent mobile UX
4. Admin can access protected routes via mobile buttons
5. No console errors when clicking buttons
6. Responsive layout smooth without layout shift
7. Color scheme matches each brand theme

---

**Testing Status**: Ready to verify ✓
**Date**: September 5, 2026
**Test Environment**: http://localhost:5173 (dev mode)
