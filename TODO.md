# TODO

- [ ] Redesign `frontend/src/pages/Checkout.jsx` into a professional, polished checkout UI (premium layout, validation, loading states, better UX).
- [x] Fix Razorpay frontend integration by replacing the hardcoded key with `import.meta.env.VITE_RAZORPAY_KEY_ID`.

- [x] Populate `localStorage.user` after login so Navbar can show user name.

- [ ] Add `frontend/.env.example` documenting required env variables (incl. `VITE_RAZORPAY_KEY_ID`).

- [ ] Verify payment flow endpoints remain unchanged (`/api/orders/checkout`, `/api/payment/create-order`, `/api/payment/verify`).
- [ ] Run frontend to visually confirm checkout page looks great.

