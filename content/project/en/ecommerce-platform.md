## Behind the scenes

Building the e-commerce platform meant balancing two competing needs: a
catalog that felt instant to browse, and an admin dashboard that stayed
truthful under real concurrent load — orders coming in while inventory was
being adjusted, discounts changing mid-checkout, that kind of thing.

![Admin dashboard showing order and inventory analytics](https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80)

### What I'd do differently

With more time, I'd push more of the inventory reconciliation logic into the
database layer itself (row-level locking) rather than leaning as heavily on
Redis as a source of truth — it worked, but it added a class of
cache-invalidation bugs that a stricter consistency model would have avoided
outright.

### Stack notes

- **Frontend**: React, with a fairly aggressive code-splitting setup per
  route to keep the initial bundle small.
- **Backend**: Node.js services behind an API gateway, each one narrowly
  scoped (catalog, orders, payments) rather than one monolith.
- **Data**: MongoDB for the catalog (schema flexibility mattered more than
  strict relations there), Redis for hot-path caching.
