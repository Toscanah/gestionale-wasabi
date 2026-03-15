# Today Orders Export - AI Analysis Documentation

## Overview

This folder contains the testing page for exporting order data for AI analysis. The export function generates a comprehensive JSON dataset with all orders created on the current day.

## Running the Export

### Via Testing Page (Recommended)
1. Navigate to the testing page in your app: `/testing`
2. Click the "Export Today's Orders" button
3. The JSON file will automatically download to your browser
4. Preview and copy the JSON data directly from the page

### Via tRPC (Programmatic)
```typescript
import { trpc } from "@/lib/trpc/client";

// In a React component
const exportMutation = trpc.orders.exportToday.useMutation({
  onSuccess: (data) => {
    console.log(`Exported ${data.metadata.total_orders} orders`);
    // Process the data
  },
});

// Trigger export
exportMutation.mutate();
```

## Output Format

The export returns a JSON object (not a file) with the following structure:

### Metadata Section
Contains export statistics and context:
- Export timestamp
- Date range (today's start/end)
- Total orders count
- Breakdown by order type (TABLE, HOME, PICKUP)
- Breakdown by shift (LUNCH, DINNER, UNSPECIFIED)
- Discount statistics (manual discounts vs promotions)

### Orders Array
Each order contains:

#### Core Fields
- `id`: Order identifier
- `created_at`: Actual order creation time (ISO 8601)
- `type`: Order type (TABLE, HOME, PICKUP)
- `status`: Order status (ACTIVE, PAID, CANCELLED)
- `shift`: Working shift (LUNCH, DINNER, UNSPECIFIED)
- `discount`: Manual discount amount in euros (may indicate service issues)

#### Timing & Latency Analysis
- `when`: Expected delivery/pickup time (for HOME/PICKUP orders)
  - Can be "immediate" (subito) or a time string like "20:30"
  - Compare with `created_at` to calculate latency
  - Missing for TABLE orders (dine-in)
- `created_at`: Actual order time

**Latency Calculation:**
```
If when = "immediate": latency should be minimal
If when = "HH:MM": compare scheduled time with actual created_at
High latency may correlate with manual discounts
```

#### Order Details
Varies by order type:

**TABLE Orders:**
- `table`: Table identifier
- `res_name`: Reservation name (optional)
- `people`: Number of people

**HOME Orders:**
- Customer information (name, phone, origin, preferences)
- Delivery address (street, civic, doorbell, floor, stair)
- `planned_payment`: Expected payment method
- `prepaid`: Whether order was prepaid
- `contact_phone`: Alternative contact number

**PICKUP Orders:**
- Customer information (if linked to customer)
- `name`: Pickup name
- `planned_payment`: Expected payment method
- `prepaid`: Whether order was prepaid

#### Products Array
Each product includes:
- Basic product info (code, description, category)
- `quantity`: Total quantity ordered
- `paid_quantity`: How much has been paid for
- `frozen_price`: Price at time of order
- `variation`: Product variation/notes
- `kitchen_type`: HOT, COLD, HOT_AND_COLD, NONE, OTHER
- `status`: IN_ORDER, DELETED_COOKED, DELETED_UNCOOKED
- `options`: Selected product options (affects preparation time)

**For Capacity Analysis:**
- Complex orders (many options, HOT kitchen type) take longer to prepare
- Products with options require more kitchen attention

#### Payments Array
Payment history for the order:
- `amount`: Payment amount
- `type`: CASH, CARD, VOUCH, CREDIT, PROMOTION
- `scope`: FULL, PARTIAL, ROMAN (split payment), UNKNOWN
- `created_at`: When payment was recorded
- `payment_group_code`: Groups related payments

#### Promotions Array
Automatic discounts applied:
- `promotion_code`: Promotion identifier
- `promotion_type`: FIXED_DISCOUNT, PERCENTAGE_DISCOUNT, GIFT_CARD
- `amount`: Discount amount applied
- `applied_at`: When promotion was applied

**Note:** Promotions are automatic/pre-planned discounts. Manual `discount` field may indicate ad-hoc compensation.

#### Kitchen Capacity Metrics
- `rices`: Number of rice portions (key kitchen bottleneck)
- `salads`: Number of salad portions
- `soups`: Number of soup portions

## AI Analysis Use Cases

### 1. Order Capacity Per Hour
**Goal:** Determine maximum sustainable orders per hour

**Approach:**
```javascript
// Group orders by hour
const ordersByHour = orders.reduce((acc, order) => {
  const hour = new Date(order.created_at).getHours();
  acc[hour] = (acc[hour] || 0) + 1;
  return acc;
}, {});

// Analyze peak hours and capacity
// Consider shift patterns (LUNCH: 12-15, DINNER: 19-23)
```

**Factors to Consider:**
- Order complexity (number of products, options)
- Kitchen metrics (rices, salads, soups)
- Order type (HOME orders require delivery time)
- Product kitchen types (HOT items take longer)

### 2. Latency Analysis
**Goal:** Identify delays between expected and actual delivery times

**Approach:**
```javascript
const homePickupOrders = orders.filter(o => 
  o.type === 'HOME' || o.type === 'PICKUP'
);

homePickupOrders.forEach(order => {
  const createdTime = new Date(order.created_at);
  const expectedTime = parseWhenField(order.when); // Parse "20:30" or "immediate"
  
  if (order.when !== 'immediate') {
    const latencyMinutes = (createdTime - expectedTime) / (1000 * 60);
    // Positive latency = late, Negative = early
  }
});
```

**Latency Indicators:**
- Orders created after their scheduled `when` time
- Correlation with `discount` field (compensation for delays)
- Patterns by time of day or order volume

### 3. Discount Correlation
**Goal:** Understand relationship between service issues and discounts

**Analysis Dimensions:**
- **Manual Discounts:** `order.discount > 0`
  - May indicate customer complaints
  - May correlate with high latency
  - May correlate with peak hours (reduced service quality)

- **Promotions:** `order.promotions.length > 0`
  - Pre-planned marketing discounts
  - Should NOT correlate with service issues

**Key Questions:**
1. Do discounted orders have higher latency?
2. Are discounts more common during peak hours?
3. Do complex orders (many products/options) get more discounts?
4. Is there correlation between rice count and discounts (kitchen bottleneck)?

### 4. Kitchen Capacity Modeling
**Goal:** Predict kitchen limits based on product mix

**Approach:**
```javascript
// Calculate "kitchen load" per order
orders.forEach(order => {
  let kitchenLoad = 0;
  
  // Rice is often the bottleneck
  kitchenLoad += (order.rices || 0) * 5; // Weight factor
  kitchenLoad += (order.salads || 0) * 2;
  kitchenLoad += (order.soups || 0) * 3;
  
  // Count HOT kitchen products
  const hotProducts = order.products.filter(p => 
    p.kitchen_type === 'HOT' || p.kitchen_type === 'HOT_AND_COLD'
  ).length;
  kitchenLoad += hotProducts * 3;
  
  // Options increase complexity
  const totalOptions = order.products.reduce((sum, p) => 
    sum + p.options.length, 0
  );
  kitchenLoad += totalOptions * 1.5;
  
  order.kitchenLoad = kitchenLoad;
});

// Analyze: max sustainable kitchen load per hour
```

## Example Queries

### Find Orders with High Latency and Discounts
```javascript
const problematicOrders = orders.filter(order => {
  const hasDiscount = order.discount > 0;
  const hasLatency = order.when && order.when !== 'immediate' && 
    new Date(order.created_at) > parseTime(order.when);
  return hasDiscount && hasLatency;
});
```

### Analyze Peak Hour Capacity
```javascript
const lunchRush = orders.filter(order => {
  const hour = new Date(order.created_at).getHours();
  return hour >= 12 && hour <= 14; // 12 PM - 2 PM
});

const avgOrdersPerHour = lunchRush.length / 3; // 3 hour window
const avgRicePerHour = lunchRush.reduce((sum, o) => sum + (o.rices || 0), 0) / 3;
```

### Product Complexity Impact
```javascript
const complexOrders = orders.map(order => ({
  id: order.id,
  productCount: order.products.length,
  optionsCount: order.products.reduce((sum, p) => sum + p.options.length, 0),
  hasDiscount: order.discount > 0
}));

// Correlation analysis between complexity and discounts
```

## Field Reference

### Order Type Values
- `TABLE`: Dine-in orders
- `HOME`: Delivery orders (includes full address)
- `PICKUP`: Takeout orders

### Shift Values
- `LUNCH`: Lunch service (typically 12:00-15:00)
- `DINNER`: Dinner service (typically 19:00-23:00)
- `UNSPECIFIED`: No shift assigned

### Kitchen Type Values
- `HOT`: Requires hot kitchen (longer prep time)
- `COLD`: Cold preparation (faster)
- `HOT_AND_COLD`: Mixed preparation
- `NONE`: No kitchen needed
- `OTHER`: Other kitchen types

### Payment Scope
- `FULL`: Complete payment
- `PARTIAL`: Partial payment
- `ROMAN`: Split payment among multiple people
- `UNKNOWN`: Scope not determined

### Order Status
- `ACTIVE`: Currently active order
- `PAID`: Fully paid order
- `CANCELLED`: Cancelled order

## Notes for AI Analysis

1. **Timezone:** All timestamps are in UTC with timezone info (Timestamptz)

2. **When Field Format:**
   - `"immediate"`: ASAP order
   - `"HH:MM"`: Scheduled time (24-hour format)
   - Only present for HOME and PICKUP orders

3. **Discount vs Promotion:**
   - `discount`: Manual discount (potential service issue indicator)
   - `promotions`: Automated marketing discounts (normal business)

4. **Kitchen Bottlenecks:**
   - Rice preparation is typically the slowest
   - HOT kitchen products require more time
   - Multiple options increase preparation complexity

5. **Capacity Factors:**
   - Not just order count - consider product mix
   - Delivery orders (HOME) consume rider capacity
   - Table turnover affects capacity differently than delivery

6. **Data Quality:**
   - Some fields may be null (check before analysis)
   - Customer data only present when linked to order
   - Prepaid orders may have different timing patterns

## Support

For questions about the data structure or to request additional fields:
1. Review the Prisma schema: `prisma/schema.prisma`
2. Check the export script: `lib/db/exportTodayOrders.ts`
3. Modify the export script to include additional fields as needed
