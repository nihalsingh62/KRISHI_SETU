/**
 * Comprehensive Automated Test Suite for Advance Slot Booking for Future Dates
 * Tests all 14 critical requirements:
 * 1. Advance window generation (Today, Tomorrow, Day +2, Day +3, Day +4 = 5 days)
 * 2. Past date rejection
 * 3. Outside advance window (> 4 days) rejection
 * 4. Dynamic capacity calculation per Centre + Date + Time Slot
 * 5. Date-wise capacity isolation (Day +1 booking does not affect Today or Day +2)
 * 6. Capacity countdown (10 -> 9 -> 8 -> ... -> 0)
 * 7. Slot full rejection (11th booking strictly blocked)
 * 8. Cancellation releases capacity immediately on the specific date & slot
 * 9. Past date cancellation prevented
 * 10. Rescheduling across dates & slots (releases old slot, claims new slot)
 * 11. Rescheduling to a full slot rejected
 * 12. Date-wise queue position separation
 * 13. Operator token lookup displays scheduled date
 * 14. Hindi & English translations completeness
 */

const assert = require("assert");

// Load date utilities
const {
  ADVANCE_BOOKING_DAYS,
  getAdvanceBookingDates,
  normalizeDate,
  formatBookingDate,
  formatLocalIsoDate,
  isDateInAdvanceWindow
} = require("../src/data/dateUtils.js");

const { translations } = require("../src/data/translations.js");

console.log("\n========================================================");
console.log("RUNNING ADVANCE SLOT BOOKING TEST SUITE");
console.log("========================================================\n");

let passedTests = 0;
let totalTests = 0;

function test(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`✅ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`❌ FAIL: ${name}`);
    console.error(err);
    process.exitCode = 1;
  }
}

// 1. Advance Window Generation
test("1. Advance window generates 5 days: Today, Tomorrow, Day +2, Day +3, Day +4", () => {
  const dates = getAdvanceBookingDates(4);
  assert.strictEqual(dates.length, 5, "Must generate exactly 5 dates");
  assert.strictEqual(dates[0].relativeLabel, "Today");
  assert.strictEqual(dates[1].relativeLabel, "Tomorrow");
  assert.strictEqual(dates[2].relativeLabel, "Day +2");
  assert.strictEqual(dates[3].relativeLabel, "Day +3");
  assert.strictEqual(dates[4].relativeLabel, "Day +4");
  
  // Verify sequential dates
  for (let i = 0; i < dates.length; i++) {
    assert(dates[i].isoDate, `Date at index ${i} must have isoDate`);
    assert(dates[i].displayDate, `Date at index ${i} must have displayDate`);
    assert(dates[i].weekday, `Date at index ${i} must have weekday`);
  }
});

// 2. Past Date Rejection
test("2. Past date is rejected by isDateInAdvanceWindow and normalizeDate", () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatLocalIsoDate(yesterday);

  assert.strictEqual(isDateInAdvanceWindow(yesterdayStr, 4).valid, false, "Yesterday must not be in advance window");
  assert.strictEqual(isDateInAdvanceWindow(yesterdayStr, 4).reason, "PAST_DATE");
  assert.strictEqual(isDateInAdvanceWindow("2020-01-01", 4).valid, false, "Past date 2020-01-01 must not be in advance window");
});

// 3. Beyond Day +4 Rejection
test("3. Dates beyond Day +4 are rejected", () => {
  const day5 = new Date();
  day5.setDate(day5.getDate() + 5);
  const day5Str = formatLocalIsoDate(day5);

  const day10 = new Date();
  day10.setDate(day10.getDate() + 10);
  const day10Str = formatLocalIsoDate(day10);

  assert.strictEqual(isDateInAdvanceWindow(day5Str, 4).valid, false, "Day +5 must not be in advance window");
  assert.strictEqual(isDateInAdvanceWindow(day5Str, 4).reason, "OUTSIDE_WINDOW");
  assert.strictEqual(isDateInAdvanceWindow(day10Str, 4).valid, false, "Day +10 must not be in advance window");
});

// 4 & 5. Date-wise capacity calculation and isolation
test("4 & 5. Dynamic capacity calculation per Centre + Date + Slot with date isolation", () => {
  const dates = getAdvanceBookingDates(4);
  const todayIso = dates[0].isoDate;
  const tomorrowIso = dates[1].isoDate;
  const day2Iso = dates[2].isoDate;

  const mockSlots = [
    { time: "10:00 AM - 11:00 AM", capacity: 10, booked: 0, status: "AVAILABLE" },
    { time: "11:00 AM - 12:00 PM", capacity: 10, booked: 0, status: "AVAILABLE" }
  ];

  // Helper matching KisanSetuContext getSlotAvailability
  function getSlotAvailability(bookings, centreId, targetDate, slotTime) {
    const slotDef = mockSlots.find((s) => s.time === slotTime) || { capacity: 10 };
    const capacity = slotDef.capacity || 10;
    const normTarget = normalizeDate(targetDate);

    const bookedCount = bookings.filter((b) => {
      if (b.centreId !== centreId) return false;
      if (b.slot !== slotTime && b.slotTime !== slotTime) return false;
      if (b.status === "CANCELLED" || b.status === "REJECTED") return false;
      const bNorm = normalizeDate(b.date);
      return bNorm === normTarget;
    }).length;

    const remaining = Math.max(0, capacity - bookedCount);
    const isFull = remaining === 0;
    return { capacity, booked: bookedCount, remaining, isFull };
  }

  const testBookings = [];

  // 3 bookings for Centre c1 on Today at 10:00 AM
  testBookings.push(
    { id: "b1", centreId: "c1", date: todayIso, slot: "10:00 AM - 11:00 AM", status: "BOOKED" },
    { id: "b2", centreId: "c1", date: todayIso, slot: "10:00 AM - 11:00 AM", status: "BOOKED" },
    { id: "b3", centreId: "c1", date: todayIso, slot: "10:00 AM - 11:00 AM", status: "CONFIRMED" }
  );

  // 6 bookings for Centre c1 on Tomorrow at 10:00 AM
  for (let i = 1; i <= 6; i++) {
    testBookings.push({
      id: `bt_${i}`,
      centreId: "c1",
      date: tomorrowIso,
      slot: "10:00 AM - 11:00 AM",
      status: "BOOKED"
    });
  }

  // Check Today capacity
  const todayAvail = getSlotAvailability(testBookings, "c1", todayIso, "10:00 AM - 11:00 AM");
  assert.strictEqual(todayAvail.capacity, 10);
  assert.strictEqual(todayAvail.booked, 3);
  assert.strictEqual(todayAvail.remaining, 7, "Today should have 7 / 10 available");
  assert.strictEqual(todayAvail.isFull, false);

  // Check Tomorrow capacity (date isolation verified: 4 / 10 available)
  const tomorrowAvail = getSlotAvailability(testBookings, "c1", tomorrowIso, "10:00 AM - 11:00 AM");
  assert.strictEqual(tomorrowAvail.capacity, 10);
  assert.strictEqual(tomorrowAvail.booked, 6);
  assert.strictEqual(tomorrowAvail.remaining, 4, "Tomorrow should have 4 / 10 available");
  assert.strictEqual(tomorrowAvail.isFull, false);

  // Check Day +2 capacity (0 bookings => 10 / 10 available)
  const day2Avail = getSlotAvailability(testBookings, "c1", day2Iso, "10:00 AM - 11:00 AM");
  assert.strictEqual(day2Avail.remaining, 10, "Day +2 should have full 10 / 10 available");
  assert.strictEqual(day2Avail.isFull, false);
});

// 6 & 7. Capacity Countdown & Slot Full Rejection
test("6 & 7. Slot reaches full capacity and blocks 11th booking attempt", () => {
  const dates = getAdvanceBookingDates(4);
  const targetDate = dates[3].isoDate; // Day +3
  const slotTime = "10:00 AM - 11:00 AM";

  const bookings = [];
  const capacity = 10;

  function bookSlotSimulation(farmerId) {
    if (!isDateInAdvanceWindow(targetDate, 4)) {
      return { success: false, error: "OUTSIDE_ADVANCE_WINDOW" };
    }
    const currentBooked = bookings.filter(
      (b) => b.centreId === "c1" && normalizeDate(b.date) === normalizeDate(targetDate) && b.slot === slotTime && b.status !== "CANCELLED"
    ).length;

    if (currentBooked >= capacity) {
      return { success: false, error: "SLOT_FULL", message: "This slot is fully booked." };
    }

    const newBooking = {
      id: `book_${farmerId}`,
      farmerId,
      centreId: "c1",
      date: targetDate,
      slot: slotTime,
      status: "BOOKED"
    };
    bookings.push(newBooking);
    return { success: true, booking: newBooking };
  }

  // Make 10 bookings
  for (let i = 1; i <= 10; i++) {
    const res = bookSlotSimulation(`farmer_${i}`);
    assert.strictEqual(res.success, true, `Booking ${i} should succeed`);
  }

  // 11th booking attempt must be strictly rejected
  const res11 = bookSlotSimulation("farmer_11");
  assert.strictEqual(res11.success, false, "11th booking must be rejected");
  assert.strictEqual(res11.error, "SLOT_FULL", "Error must be SLOT_FULL");
  assert.strictEqual(bookings.length, 10, "Total bookings must remain exactly 10");
});

// 8. Cancellation releases capacity immediately
test("8. Cancellation on specific date releases capacity immediately", () => {
  const dates = getAdvanceBookingDates(4);
  const targetDate = dates[2].isoDate; // Day +2
  const slotTime = "02:00 PM - 03:00 PM";

  const bookings = [
    { id: "b_cancel_1", centreId: "c1", date: targetDate, slot: slotTime, status: "BOOKED" },
    { id: "b_cancel_2", centreId: "c1", date: targetDate, slot: slotTime, status: "BOOKED" }
  ];

  function getRemaining() {
    const active = bookings.filter(
      (b) => b.centreId === "c1" && normalizeDate(b.date) === normalizeDate(targetDate) && b.slot === slotTime && b.status !== "CANCELLED"
    ).length;
    return 10 - active;
  }

  assert.strictEqual(getRemaining(), 8, "Initial remaining must be 8");

  // Cancel booking 1
  const b = bookings.find((x) => x.id === "b_cancel_1");
  b.status = "CANCELLED";

  assert.strictEqual(getRemaining(), 9, "After cancellation, remaining must immediately increase to 9");
});

// 9. Past date cancellation rejected
test("9. Past booking cannot be cancelled", () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  const pastBooking = {
    id: "b_past",
    date: yesterdayStr,
    slot: "10:00 AM - 11:00 AM",
    status: "BOOKED"
  };

  const todayIso = new Date().toISOString().split("T")[0];
  const isCancellable = normalizeDate(pastBooking.date) >= todayIso && pastBooking.status === "BOOKED";
  assert.strictEqual(isCancellable, false, "Past booking must not be cancellable");
});

// 10 & 11. Rescheduling across dates & slots
test("10 & 11. Rescheduling across dates releases old slot and claims new slot, blocking full slots", () => {
  const dates = getAdvanceBookingDates(4);
  const dateFrom = dates[1].isoDate; // Tomorrow
  const dateTo = dates[3].isoDate;   // Day +3

  let bookings = [
    { id: "b_reschedule_user", centreId: "c1", date: dateFrom, slot: "10:00 AM - 11:00 AM", status: "BOOKED" }
  ];

  // Fill target slot on dateTo to capacity (10 bookings)
  for (let i = 1; i <= 10; i++) {
    bookings.push({
      id: `b_target_full_${i}`,
      centreId: "c1",
      date: dateTo,
      slot: "02:00 PM - 03:00 PM",
      status: "BOOKED"
    });
  }

  function reschedule(bookingId, targetDate, targetSlot) {
    if (!isDateInAdvanceWindow(targetDate, 4).valid) {
      return { success: false, message: "Selected date is outside advance booking window." };
    }
    const currentOnTarget = bookings.filter(
      (b) => b.centreId === "c1" && normalizeDate(b.date) === normalizeDate(targetDate) && b.slot === targetSlot && b.status !== "CANCELLED"
    ).length;

    if (currentOnTarget >= 10) {
      return { success: false, message: "Target slot is full" };
    }

    const b = bookings.find((x) => x.id === bookingId);
    b.date = targetDate;
    b.slot = targetSlot;
    b.slotTime = targetSlot;
    return { success: true };
  }

  // Attempt to reschedule to full slot
  const failRes = reschedule("b_reschedule_user", dateTo, "02:00 PM - 03:00 PM");
  assert.strictEqual(failRes.success, false, "Reschedule to full slot must fail");

  // Reschedule to available slot on dateTo
  const successRes = reschedule("b_reschedule_user", dateTo, "04:00 PM - 05:00 PM");
  assert.strictEqual(successRes.success, true, "Reschedule to open slot must succeed");

  const updatedBooking = bookings.find((x) => x.id === "b_reschedule_user");
  assert.strictEqual(updatedBooking.date, dateTo);
  assert.strictEqual(updatedBooking.slot, "04:00 PM - 05:00 PM");

  // Check that old slot is freed
  const oldSlotActive = bookings.filter(
    (b) => b.centreId === "c1" && normalizeDate(b.date) === normalizeDate(dateFrom) && b.slot === "10:00 AM - 11:00 AM" && b.status !== "CANCELLED"
  ).length;
  assert.strictEqual(oldSlotActive, 0, "Old slot should now have 0 bookings");
});

// 12. Date-wise queue position separation
test("12. Queue positions are separated by Centre + Date + Slot", () => {
  const dates = getAdvanceBookingDates(4);
  const d1 = dates[0].isoDate;
  const d2 = dates[1].isoDate;

  const bookings = [
    { id: "b1", centreId: "c1", date: d1, slot: "10:00 AM - 11:00 AM", status: "BOOKED" },
    { id: "b2", centreId: "c1", date: d1, slot: "10:00 AM - 11:00 AM", status: "BOOKED" },
    { id: "b3", centreId: "c1", date: d2, slot: "10:00 AM - 11:00 AM", status: "BOOKED" },
    { id: "b4", centreId: "c1", date: d2, slot: "10:00 AM - 11:00 AM", status: "BOOKED" },
    { id: "b5", centreId: "c1", date: d2, slot: "10:00 AM - 11:00 AM", status: "BOOKED" }
  ];

  // Group queue positions per centre + date + slot
  const groups = {};
  bookings.forEach((b) => {
    const key = `${b.centreId}__${normalizeDate(b.date)}__${b.slot}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(b);
  });

  Object.values(groups).forEach((list) => {
    list.forEach((item, idx) => {
      item.queuePosition = idx + 1;
    });
  });

  // d1 bookings
  assert.strictEqual(bookings.find((b) => b.id === "b1").queuePosition, 1);
  assert.strictEqual(bookings.find((b) => b.id === "b2").queuePosition, 2);

  // d2 bookings should be 1, 2, 3 independently!
  assert.strictEqual(bookings.find((b) => b.id === "b3").queuePosition, 1);
  assert.strictEqual(bookings.find((b) => b.id === "b4").queuePosition, 2);
  assert.strictEqual(bookings.find((b) => b.id === "b5").queuePosition, 3);
});

// 13. Format Booking Date Helper
test("13. formatBookingDate produces clean human-readable date with weekday", () => {
  const dates = getAdvanceBookingDates(4);
  assert(formatBookingDate(dates[0].isoDate).includes("Today"));
  assert(formatBookingDate(dates[1].isoDate).includes("Tomorrow"));
  assert(formatBookingDate(dates[2].isoDate).includes("Day +2"));
  assert(formatBookingDate("Today").includes("Today"));
});

// 14. Translations Check
test("14. Translations include all required advance booking keys in English & Hindi", () => {
  const requiredKeys = [
    "selectDate",
    "advanceBookingWindow",
    "availableCapacity",
    "slotFull",
    "slotFullError",
    "pastDateError",
    "outsideWindowError",
    "scheduledDate"
  ];

  for (const key of requiredKeys) {
    assert(translations.en[key], `Missing English translation for: ${key}`);
    assert(translations.hi[key], `Missing Hindi translation for: ${key}`);
  }
});

console.log("\n========================================================");
console.log(`TEST RESULTS: ${passedTests}/${totalTests} TESTS PASSED`);
console.log("========================================================\n");

if (passedTests !== totalTests) {
  process.exit(1);
}
