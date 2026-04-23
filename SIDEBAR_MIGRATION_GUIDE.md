# Sidebar Migration Guide

## Overview
This guide explains how to migrate from multiple sidebar files to a single universal sidebar system.

## Files to be Replaced

### Old Sidebar Files (to be removed):
- `src/layouts/Partials/CEOSideBar.vue`
- `src/layouts/Partials/HrSideBar.vue`
- `src/layouts/Partials/HodSideBar.vue`
- `src/layouts/Partials/AccoutantSideBar.vue`
- `src/layouts/Partials/TendersSideBar.vue`
- `src/layouts/Partials/AppSidebar.vue`
- `src/layouts/Partials/AppSidebar1.vue`
- `src/layouts/Partials/AppSidebar2.vue`
- `src/layouts/Partials/AppSidebar3.vue`
- `src/layouts/Partials/AppSidebar4.vue`
- `src/layouts/Partials/AppSidebar5.vue`
- `src/layouts/Partials/MobileSidebar*.vue` (all variants)

### Old Layout Files (to be removed):
- `src/layouts/Auth.vue`
- `src/layouts/Auth1.vue`
- `src/layouts/Auth2.vue`
- `src/layouts/Auth3.vue`
- `src/layouts/Auth4.vue`
- `src/layouts/Auth5.vue`
- `src/layouts/CEOLayout.vue` (will be updated)

### New Universal Files:
- `src/components/UniversalSidebar.vue` - Single sidebar for all roles
- `src/components/UniversalLayout.vue` - Single layout for all roles

## Migration Steps

### 1. Update Route Configuration
Replace all layout imports in `src/route.js`:

```javascript
// OLD imports (remove these)
import AuthLayout from '@layouts/Auth.vue';
import AuthLayout1 from '@layouts/Auth1.vue';
import AuthLayout2 from '@layouts/Auth2.vue';
import AuthLayout3 from '@layouts/Auth3.vue';
import AuthLayout4 from '@layouts/Auth4.vue';
import AuthLayout5 from '@layouts/Auth5.vue';
import CEOLayout from '@layouts/CEOLayout.vue';

// NEW imports (add these)
import UniversalLayout from '@/components/UniversalLayout.vue';
```

### 2. Update Route Definitions
Replace all layout references in routes:

```javascript
// OLD route definitions
{
    path: '/',
    name: 'Auth',
    component: AuthLayout,
    meta: { allowedRoles: [1] },
    children: [...]
},
{
    path: '/ceo',
    component: CEOLayout,
    meta: { requiresAuth: true, allowedRoles: [7] },
    children: [...]
}

// NEW route definitions
{
    path: '/',
    component: UniversalLayout,
    meta: { requiresAuth: true, allowedRoles: [1] },
    children: [...]
},
{
    path: '/ceo',
    component: UniversalLayout,
    meta: { requiresAuth: true, allowedRoles: [7] },
    children: [...]
}
```

### 3. Role-based Menu Configuration
The `UniversalSidebar.vue` contains menu configurations for all roles:

- **Role 1**: Administrator
- **Role 2**: Head of Department (HOD)
- **Role 3**: User/Employee
- **Role 4**: Tender Management
- **Role 5**: Accounting
- **Role 6**: Human Resources (HR)
- **Role 7**: CEO/Executive

### 4. Features of Universal Sidebar

#### Dynamic Role Detection
- Automatically detects user role from localStorage
- Displays appropriate menu based on role_id

#### Unified Design
- Consistent styling across all roles
- Modern gradient effects and animations
- Responsive design for mobile devices

#### Enhanced Features
- Dropdown menus for nested items
- Badge support for notifications
- Profile section with logout
- Theme toggle support
- Search functionality in header

#### Menu Structure
Each role has:
- Dashboard section
- Role-specific features
- Reports section (where applicable)
- Profile management
- Proper separators and grouping

## Benefits

### 1. Code Reduction
- **Before**: 20+ sidebar/layout files
- **After**: 2 universal files
- **Reduction**: ~90% fewer files

### 2. Maintenance
- Single point of updates for sidebar functionality
- Consistent behavior across all roles
- Easier to add new features

### 3. Performance
- Reduced bundle size
- Faster loading times
- Better caching

### 4. User Experience
- Consistent interface across all roles
- Modern design with animations
- Better mobile responsiveness

## Customization

### Adding New Menu Items
Edit the `roleConfigs` object in `UniversalSidebar.vue`:

```javascript
const roleConfigs = {
  7: { // CEO role
    menuItems: [
      // ... existing items
      {
        name: 'NewFeature',
        label: 'New Feature',
        description: 'Description',
        path: '/ceo/new-feature',
        icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6'
      }
    ]
  }
}
```

### Adding New Roles
Add new role configuration:

```javascript
const roleConfigs = {
  // ... existing roles
  8: { // New role
    title: 'New Role',
    subtitle: 'Role Description',
    profilePath: '/new-role/profile',
    menuItems: [
      // Menu items for this role
    ]
  }
}
```

### Styling Customization
Modify the styles in the `<style scoped>` section of `UniversalSidebar.vue` and `UniversalLayout.vue`.

## Migration Checklist

- [ ] Update route imports in `src/route.js`
- [ ] Replace all layout component references
- [ ] Test navigation for all user roles
- [ ] Verify mobile responsiveness
- [ ] Check dropdown functionality
- [ ] Test logout functionality
- [ ] Verify badge notifications work
- [ ] Remove old sidebar files
- [ ] Remove old layout files
- [ ] Update any component imports that reference old sidebars

## Rollback Plan

If issues arise during migration:

1. Keep backup of original files
2. Revert `src/route.js` to original imports
3. Restore original layout files
4. Test functionality before re-attempting migration

## Support

For issues during migration:
1. Check browser console for errors
2. Verify localStorage contains correct role_id
3. Ensure all route paths are correct
4. Test with different user roles

## Notes

- The universal sidebar automatically reads user role from localStorage
- Menu items are filtered based on user permissions
- All existing functionality should work without changes
- The new system is backward compatible with existing routes
