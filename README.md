This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.




################################################################################################

# GogalEdu Franchise Partner Portal
## Complete Setup Guide (Even for Non-Coders!)

---

## 📁 WHERE TO PUT THESE FILES

Copy these files into your **existing** GogalEdu Academy project.
Your project folder already looks like this:
```
GOGALEDU-ACADEMY/
├── app/
│   ├── franchise-partner/   ← PUT FILES HERE
│   ...
```

### File Placement Map:

```
Your Project/
└── app/
    └── franchise-partner/
        │
        ├── page.js                          ← LOGIN PAGE (the sign-in screen)
        │
        └── dashboard/
            ├── layout.js                    ← SIDEBAR WRAPPER (shown on all dashboard pages)
            ├── Sidebar.js                   ← THE SIDEBAR COMPONENT
            ├── page.js                      ← OVERVIEW / HOME dashboard
            │
            ├── leads/
            │   └── page.js                  ← LEADS MANAGEMENT page
            │
            ├── students/
            │   └── page.js                  ← STUDENTS page
            │
            ├── payments/
            │   └── page.js                  ← PAYMENTS & COMMISSION page
            │
            ├── courses/
            │   └── page.js                  ← AVAILABLE COURSES page
            │
            ├── reports/
            │   └── page.js                  ← REPORTS & ANALYTICS page
            │
            ├── profile/
            │   └── page.js                  ← PROFILE page
            │
            └── support/
                └── page.js                  ← HELP & SUPPORT page
```

---

## 🔗 HOW TO ACCESS THE PORTAL

Once files are in place and your server is running, visit:

```
http://localhost:3000/franchise-partner
```

This will show the login page.

### Dummy Login Credentials (for testing):
| Field    | Value                        |
|----------|------------------------------|
| Email    | franchise@gogaledu.com       |
| Password | Gogal@2024                   |

---

## 🗺️ ALL PORTAL PAGES

| Page         | URL                                          | Purpose                        |
|--------------|----------------------------------------------|--------------------------------|
| Login        | /franchise-partner                           | Sign in page                   |
| Overview     | /franchise-partner/dashboard                 | Main dashboard with stats      |
| Leads        | /franchise-partner/dashboard/leads           | Add & manage leads             |
| Students     | /franchise-partner/dashboard/students        | View enrolled students         |
| Payments     | /franchise-partner/dashboard/payments        | Commission & fee tracking      |
| Courses      | /franchise-partner/dashboard/courses         | Available courses & seats      |
| Reports      | /franchise-partner/dashboard/reports         | Charts & analytics             |
| Profile      | /franchise-partner/dashboard/profile         | Edit personal/center info      |
| Support      | /franchise-partner/dashboard/support         | Raise tickets & get help       |

---

## 🎨 CUSTOMISING THE PORTAL

### To change the brand green color:
Every file has this at the top:
```js
const G  = "#22c55e";   // ← Change this to any color
const GD = "#16a34a";   // ← Darker version of the color
```

### To change dummy login credentials:
In `app/franchise-partner/page.js`, find:
```js
const DUMMY_USER = {
  email: "franchise@gogaledu.com",
  password: "Gogal@2024",
  ...
};
```
Change the email and password values.

### To add more sidebar menu items:
In `app/franchise-partner/dashboard/Sidebar.js`, find:
```js
const MENU_ITEMS = [
  { icon: "📊", label: "Overview", href: "/franchise-partner/dashboard" },
  // Add a new line here:
  { icon: "🏆", label: "Achievements", href: "/franchise-partner/dashboard/achievements" },
];
```

---

## 🔐 GOING LIVE (Replacing Dummy Login with Real Database)

Currently, the login checks against a hardcoded user object.
To connect to a real database:

1. Create an API route: `app/api/franchise/login/route.js`
2. In `app/franchise-partner/page.js`, replace the dummy check with:
```js
const response = await fetch("/api/franchise/login", {
  method: "POST",
  body: JSON.stringify({ email, password }),
  headers: { "Content-Type": "application/json" },
});
const data = await response.json();
if (data.success) {
  sessionStorage.setItem("franchiseUser", JSON.stringify(data.user));
  router.push("/franchise-partner/dashboard");
}
```

---

## ❓ COMMON QUESTIONS

**Q: The portal shows a blank white page?**
A: Make sure all files are in the right folders. The `layout.js` and `Sidebar.js`
   MUST be in the `dashboard/` folder, not outside it.

**Q: The login doesn't redirect?**
A: Make sure you're using exactly: `franchise@gogaledu.com` and `Gogal@2024`

**Q: I want to add a new page (e.g., Notifications)?**
A: Create a new folder: `dashboard/notifications/page.js`
   Add it to MENU_ITEMS in `Sidebar.js`. That's it!

**Q: Will the portal lose data when refreshed?**
A: Currently yes — data is in component state (temporary memory).
   For permanent data, connect to a database via API routes.

---

## 📞 Need Help?

Contact your developer and share this README along with any error messages
you see in the browser console (Press F12 → Console tab).
