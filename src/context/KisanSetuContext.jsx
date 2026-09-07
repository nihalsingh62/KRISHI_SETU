import React, { createContext, useContext, useState, useEffect } from "react";
import { INITIAL_CENTRES, INITIAL_SLOTS, INITIAL_BOOKINGS, INITIAL_NOTIFICATIONS } from "../data/mockData";
import { translations } from "../data/translations";
import {
  ADVANCE_BOOKING_DAYS,
  getAdvanceBookingDates,
  normalizeDate,
  formatBookingDate,
  isDateInAdvanceWindow
} from "../data/dateUtils";

const KisanSetuContext = createContext();

// Helper to initialize state from localStorage or fallback
const getInitialState = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.warn(`Error reading localStorage for ${key}`, error);
    return fallback;
  }
};

// Helper to re-calculate centre congestion load % & status
const recalculateCentreMetrics = (centreList, tokenList) => {
  return centreList.map((centre) => {
    const centreTokens = tokenList.filter((tok) => tok.centreId === centre.id);
    const booked = centreTokens.filter((tok) => tok.status !== "CANCELLED").length;
    const arrived = centreTokens.filter((tok) => [
      "ARRIVED",
      "WEIGHING",
      "QUALITY_CHECK",
      "APPROVED",
      "PROCUREMENT_COMPLETE",
      "PROCUREMENT_COMPLETED",
      "PAYMENT_PROCESSING",
      "PAYMENT_COMPLETED"
    ].includes(tok.status)).length;
    const processing = centreTokens.filter((tok) => ["WEIGHING", "QUALITY_CHECK", "APPROVED"].includes(tok.status)).length;
    const completed = centreTokens.filter((tok) => ["PROCUREMENT_COMPLETE", "PROCUREMENT_COMPLETED", "PAYMENT_PROCESSING", "PAYMENT_COMPLETED"].includes(tok.status)).length;
    const queueDepth = centreTokens.filter((tok) => ["WAITING", "BOOKED", "ARRIVED"].includes(tok.status)).length;

    const loadPercent = Math.min(100, Math.round((booked / centre.capacity) * 100));
    let status = "NORMAL";
    if (loadPercent >= 95) status = "CRITICAL";
    else if (loadPercent >= 80) status = "HIGH_LOAD";

    return {
      ...centre,
      booked,
      arrived,
      processing,
      completed,
      queueDepth,
      loadPercent,
      status
    };
  });
};

// Slot-wise individual queue position & automatic queue shifting
// Grouping: SAME CENTRE + SAME DATE + SAME TIME SLOT
const recalculateQueuePositions = (tokenList) => {
  const updated = tokenList.map(tok => ({ ...tok }));
  const activeQueueStatuses = ["BOOKED", "CONFIRMED", "ARRIVED", "WAITING", "CALLED", "WEIGHING", "QUALITY_CHECK", "APPROVED"];
  
  // Clear queue position for non-queue statuses (e.g. CANCELLED, REJECTED, COMPLETED)
  updated.forEach(tok => {
    if (!activeQueueStatuses.includes(tok.status)) {
      tok.queuePosition = 0;
      tok.queuePos = 0;
      tok.estimatedWait = 0;
      tok.estimatedWaitMin = 0;
    }
  });

  // Group active bookings by: SAME CENTRE + SAME DATE + SAME TIME SLOT
  const slotGroups = new Map();

  updated.forEach(tok => {
    if (activeQueueStatuses.includes(tok.status)) {
      const cId = tok.centreId || "c1";
      const date = normalizeDate(tok.date);
      const slot = tok.slot || tok.slotTime || "Default";
      const groupKey = `${cId}__${date}__${slot}`;

      if (!slotGroups.has(groupKey)) {
        slotGroups.set(groupKey, []);
      }
      slotGroups.get(groupKey).push(tok);
    }
  });

  // Assign individual sequential queue positions within each centre/date/slot
  slotGroups.forEach((groupBookings) => {
    groupBookings.sort((a, b) => {
      const timeA = a.slotBookedAt || a.createdAt || "";
      const timeB = b.slotBookedAt || b.createdAt || "";
      if (timeA && timeB && timeA !== timeB) {
        return timeA.localeCompare(timeB);
      }
      if (a.bookingId && b.bookingId && a.bookingId !== b.bookingId) {
        return a.bookingId.localeCompare(b.bookingId);
      }
      const numA = parseInt((a.token || "").replace(/\D/g, ""), 10) || 0;
      const numB = parseInt((b.token || "").replace(/\D/g, ""), 10) || 0;
      return numA - numB;
    });

    groupBookings.forEach((tok, index) => {
      const pos = index + 1;
      tok.queuePosition = pos;
      tok.queuePos = pos;
      // Estimated wait calculation: 5m for #1, then adds 6m per position
      const estWait = Math.max(5, Math.round((pos - 1) * 6 + 5));
      tok.estimatedWait = estWait;
      tok.estimatedWaitMin = estWait;
    });
  });

  return updated;
};

export const KisanSetuProvider = ({ children }) => {
  // Persistent State
  const [language, setLanguage] = useState(() => getInitialState("ks_language", "en"));
  const [lowNetworkMode, setLowNetworkMode] = useState(() => getInitialState("ks_lowNetworkMode", false));
  const [currentRole, setCurrentRole] = useState(() => getInitialState("ks_currentRole", "landing"));
  const [isAuthenticated, setIsAuthenticated] = useState(() => getInitialState("ks_isAuthenticated", false));
  const [authenticatedUser, setAuthenticatedUser] = useState(() => getInitialState("ks_authenticatedUser", null));
  const [registeredFarmers, setRegisteredFarmers] = useState(() => getInitialState("ks_registeredFarmers", [
    {
      id: "FAR-1001",
      name: "Ramesh Singh",
      mobile: "9876543210",
      aadhaar: "987654321098",
      village: "Rampur",
      district: "Patna",
      bankDetails: {
        bankName: "State Bank of India",
        accountHolder: "Ramesh Singh",
        holderName: "Ramesh Singh",
        accountNumber: "98765432104821",
        ifsc: "SBIN0001234"
      }
    } // seed demo farmer
  ]));
  
  const [centres, setCentres] = useState(() => getInitialState("ks_centres", INITIAL_CENTRES));
  const [slots, setSlots] = useState(() => getInitialState("ks_slots", INITIAL_SLOTS));
  const [bookings, setBookings] = useState(() => recalculateQueuePositions(getInitialState("ks_bookings", INITIAL_BOOKINGS)));
  const [notifications, setNotifications] = useState(() => getInitialState("ks_notifications", INITIAL_NOTIFICATIONS));
  
  // Navigation Tabs persistence
  const [activeFarmerTab, setActiveFarmerTab] = useState(() => getInitialState("ks_activeFarmerTab", "dashboard"));
  const [activeOperatorTab, setActiveOperatorTab] = useState(() => getInitialState("ks_activeOperatorTab", "dashboard"));
  const [activeAdminTab, setActiveAdminTab] = useState(() => getInitialState("ks_activeAdminTab", "dashboard"));

  const [activeCentreId, setActiveCentreId] = useState(() => getInitialState("ks_activeCentreId", "c1"));

  // Persist State Changes
  useEffect(() => { localStorage.setItem("ks_language", JSON.stringify(language)); }, [language]);
  useEffect(() => { localStorage.setItem("ks_lowNetworkMode", JSON.stringify(lowNetworkMode)); }, [lowNetworkMode]);
  useEffect(() => { localStorage.setItem("ks_currentRole", JSON.stringify(currentRole)); }, [currentRole]);
  useEffect(() => { localStorage.setItem("ks_isAuthenticated", JSON.stringify(isAuthenticated)); }, [isAuthenticated]);
  useEffect(() => { localStorage.setItem("ks_authenticatedUser", JSON.stringify(authenticatedUser)); }, [authenticatedUser]);
  useEffect(() => { localStorage.setItem("ks_registeredFarmers", JSON.stringify(registeredFarmers)); }, [registeredFarmers]);
  useEffect(() => { localStorage.setItem("ks_centres", JSON.stringify(centres)); }, [centres]);
  useEffect(() => { localStorage.setItem("ks_slots", JSON.stringify(slots)); }, [slots]);
  useEffect(() => { localStorage.setItem("ks_bookings", JSON.stringify(bookings)); }, [bookings]);
  useEffect(() => { localStorage.setItem("ks_notifications", JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem("ks_activeFarmerTab", JSON.stringify(activeFarmerTab)); }, [activeFarmerTab]);
  useEffect(() => { localStorage.setItem("ks_activeOperatorTab", JSON.stringify(activeOperatorTab)); }, [activeOperatorTab]);
  useEffect(() => { localStorage.setItem("ks_activeAdminTab", JSON.stringify(activeAdminTab)); }, [activeAdminTab]);
  useEffect(() => { localStorage.setItem("ks_activeCentreId", JSON.stringify(activeCentreId)); }, [activeCentreId]);

  const t = (key) => {
    return translations[language]?.[key] || translations["en"]?.[key] || key;
  };

  // Farmer Registration - Single Source of Truth
  const registerFarmer = (details) => {
    const newId = `FAR-${1000 + registeredFarmers.length + 1}`;
    const newFarmer = {
      id: newId,
      ...details,
      bankDetails: {
        ...details.bankDetails,
        holderName: details.bankDetails?.accountHolder || details.name
      },
      createdAt: new Date().toISOString()
    };
    setRegisteredFarmers(prev => [...prev, newFarmer]);
    return newFarmer;
  };

  // Farmer Login with Farmer ID and Mobile
  const loginFarmer = (farmerId, mobile) => {
    const farmer = registeredFarmers.find(
      f => f.id.toUpperCase() === farmerId.trim().toUpperCase() && f.mobile.trim() === mobile.trim()
    );
    if (farmer) {
      login("farmer", { ...farmer, type: "farmer" });
      return true;
    }
    return false;
  };

  const login = (role, userDetails) => {
    setIsAuthenticated(true);
    setAuthenticatedUser(userDetails);
    setCurrentRole(role);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAuthenticatedUser(null);
    setCurrentRole("landing");
  };

  // Farmer active booking - strictly follows Active Booking Rule
  // A farmer must never have two active bookings.
  // Active statuses: BOOKED, CONFIRMED, ARRIVED, WAITING, CALLED, WEIGHING, QUALITY_CHECK, APPROVED.
  // Cancelled/completed historical bookings must NOT count as active bookings.
  const getActiveBooking = () => {
    if (currentRole === "farmer" && authenticatedUser) {
      const farmerTokens = bookings.filter(t => t.farmerId === authenticatedUser.id);
      const activeStatuses = [
        "BOOKED",
        "CONFIRMED",
        "ARRIVED",
        "WAITING",
        "CALLED",
        "WEIGHING",
        "QUALITY_CHECK",
        "APPROVED"
      ];
      const active = farmerTokens.filter(t => activeStatuses.includes(t.status));
      if (active.length > 0) {
        return active[active.length - 1];
      }

      // If no active pre-completion booking, check if latest booking was completed (for receipt display on dashboard),
      // but CANCELLED or REJECTED bookings never count as active!
      const lastToken = farmerTokens.length > 0 ? farmerTokens[farmerTokens.length - 1] : null;
      if (lastToken && ["PROCUREMENT_COMPLETE", "PROCUREMENT_COMPLETED", "PAYMENT_PROCESSING", "PAYMENT_COMPLETED"].includes(lastToken.status)) {
        return lastToken;
      }
      return null;
    }
    return null;
  };
  const activeBooking = getActiveBooking();
  const activeCentre = centres.find((c) => c.id === activeCentreId) || centres[0];

  // Calculate remaining slot capacity per SAME CENTRE + SAME DATE + SAME TIME SLOT
  const getSlotAvailability = (centreId, date, slotTime) => {
    const normDate = normalizeDate(date);
    const baseSlot = slots.find((s) => s.time === slotTime);
    const capacity = baseSlot?.capacity || 10;

    const bookedCount = bookings.filter(
      (b) =>
        b.centreId === centreId &&
        normalizeDate(b.date) === normDate &&
        (b.slot === slotTime || b.slotTime === slotTime) &&
        b.status !== "CANCELLED"
    ).length;

    const remaining = Math.max(0, capacity - bookedCount);
    const isFull = remaining <= 0;

    return {
      time: slotTime,
      capacity,
      booked: bookedCount,
      remaining,
      isFull,
      status: isFull ? "FULL" : "AVAILABLE"
    };
  };

  // Helper to check if a booking can be cancelled / rescheduled (before scheduled slot arrival)
  const isBookingCancellable = (booking) => {
    if (!booking) return false;
    // Can only cancel pre-arrival
    if (!["BOOKED", "CONFIRMED"].includes(booking.status)) {
      return false;
    }
    // Cannot cancel past dates
    const norm = normalizeDate(booking.date);
    const todayNorm = normalizeDate("Today");
    if (norm < todayNorm) return false;
    return true;
  };

  // Booking a slot by farmer with Active Booking Rule (never two active bookings)
  const bookSlot = ({ commodity, crop, quantityQtl, quantity, centreId, date, slotTime, slot }) => {
    if (!authenticatedUser) return null;

    const chosenCrop = commodity || crop || "Wheat";
    const chosenQty = Number(quantityQtl || quantity || 40);
    const chosenSlot = slotTime || slot || "10:00 AM – 11:00 AM";
    const chosenDate = date || "Today";
    const chosenCentreId = centreId || activeCentreId || "c1";
    const centre = centres.find((c) => c.id === chosenCentreId) || centres[0];
    const isHi = language === "hi";

    // 1. Validate Advance Booking Window (Today + next 4 days; past dates disallowed)
    const windowCheck = isDateInAdvanceWindow(chosenDate);
    if (!windowCheck.valid) {
      if (windowCheck.reason === "PAST_DATE") {
        addToast({
          type: "error",
          title: isHi ? "अमान्य तिथि" : "Invalid Date",
          message: isHi ? "पिछली तिथियों के लिए स्लॉट बुक नहीं किए जा सकते।" : "Cannot book slots for past dates."
        });
        return { error: "INVALID_DATE", message: "Cannot book slots for past dates." };
      }
      if (windowCheck.reason === "OUTSIDE_WINDOW") {
        addToast({
          type: "error",
          title: isHi ? "अग्रिम सीमा समाप्त" : "Outside Advance Window",
          message: isHi ? "बुकिंग केवल 4-दिवसीय अग्रिम अवधि के भीतर ही मान्य है।" : "Booking is only allowed within the 4-day advance window."
        });
        return { error: "OUTSIDE_ADVANCE_WINDOW", message: "Booking is only allowed within the 4-day advance window." };
      }
    }

    // 2. Validate Slot Capacity (Strict ceiling: SAME CENTRE + SAME DATE + SAME TIME SLOT)
    const availability = getSlotAvailability(chosenCentreId, chosenDate, chosenSlot);
    if (availability.isFull) {
      addToast({
        type: "error",
        title: isHi ? "स्लॉट पूर्ण" : "Slot Full",
        message: isHi ? "चुना गया स्लॉट इस तिथि के लिए पहले से ही भरा हुआ है।" : "Selected slot is already full for this date."
      });
      return { error: "SLOT_FULL", message: "Selected slot is already full for this date." };
    }

    // 3. Active booking rule: A farmer must never have two active bookings.
    // Active statuses: BOOKED, CONFIRMED, ARRIVED, WAITING, CALLED, WEIGHING, QUALITY_CHECK, APPROVED.
    // Cancelled/completed historical bookings must NOT count as active bookings.
    const activeStatuses = ["BOOKED", "CONFIRMED", "ARRIVED", "WAITING", "CALLED", "WEIGHING", "QUALITY_CHECK", "APPROVED"];
    const existingActive = bookings.find((b) => 
      b.farmerId === authenticatedUser.id &&
      activeStatuses.includes(b.status)
    );

    if (existingActive) {
      return {
        error: "DUPLICATE_BOOKING",
        message: "You already have an active booking.",
        existingBooking: existingActive
      };
    }

    const bookingId = `BKG-${Date.now()}`;
    // Dynamic token generation with base 128 (e.g. A129, A130...)
    const maxNum = bookings.reduce((max, b) => {
      const num = parseInt((b.token || "").replace(/\D/g, ""), 10);
      return !isNaN(num) && num > max ? num : max;
    }, 128);
    const nextTokenNum = `A${maxNum + 1}`;

    const msp = chosenCrop === "Wheat" ? 2275 : chosenCrop === "Paddy" ? 2300 : 2090;

    const newBooking = {
      bookingId: bookingId,
      id: bookingId,
      token: nextTokenNum,
      farmerId: authenticatedUser.id,
      farmerName: authenticatedUser.name,
      phone: authenticatedUser.mobile,
      crop: chosenCrop,
      commodity: chosenCrop,
      quantity: chosenQty,
      quantityQtl: chosenQty,
      centreId,
      centreName: centre.name,
      date: chosenDate,
      slot: chosenSlot,
      slotTime: chosenSlot,
      status: "BOOKED",
      queuePosition: 1, // Will be assigned by recalculateQueuePositions
      queuePos: 1,
      estimatedWait: 5,
      estimatedWaitMin: 5,
      actualWeightQtl: null,
      moisturePercent: null,
      grade: null,
      mspPerQtl: msp,
      totalAmount: Math.round(chosenQty * msp),
      paymentStatus: "NOT_INITIATED",
      paymentTxRef: null,
      createdAt: new Date().toISOString(),
      slotBookedAt: new Date().toISOString(),
      bookedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timelineHistory: [
        { status: "BOOKED", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), desc: `Slot booked at ${centre.name} for ${chosenSlot}` }
      ]
    };

    let updatedTokens = [...bookings, newBooking];
    updatedTokens = recalculateQueuePositions(updatedTokens);
    
    setBookings(updatedTokens);

    // Update slot capacity counter
    setSlots((prevSlots) =>
      prevSlots.map((s) => {
        if (s.time === chosenSlot) {
          const newBooked = s.booked + 1;
          return { ...s, booked: newBooked, status: newBooked >= s.capacity ? "FULL" : "AVAILABLE" };
        }
        return s;
      })
    );

    // Recalculate centre metrics
    setCentres((prev) => recalculateCentreMetrics(prev, updatedTokens));

    // Push notification
    addNotification({
      type: "SLOT_CONFIRMED",
      title: isHi ? "स्लॉट बुकिंग सफल" : "Booking Confirmed",
      message: isHi
        ? `टोकन ${nextTokenNum} जारी किया गया: ${chosenCrop} (${chosenQty} क्विंटल) केंद्र: ${centre.name}।`
        : `Token ${nextTokenNum} issued for ${chosenCrop} (${chosenQty} Qtl) at ${centre.name}.`,
      time: isHi ? "अभी" : "Just now"
    });

    return newBooking;
  };

  // Updating status from operator portal
  const updateBookingStatus = (identifier, newStatus, extraData = {}) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const nowIso = new Date().toISOString();
    let notifyMsg = "";
    let targetBooking = null;

    let normalizedStatus = newStatus;
    if (newStatus === "COMPLETED" || newStatus === "PROCUREMENT_COMPLETE") {
      normalizedStatus = "PROCUREMENT_COMPLETED";
    }

    // Weight guard: Reject zero, negative, NaN, or excessive values (> 500 Qtl)
    if (extraData.actualWeightQtl !== undefined) {
      const w = Number(extraData.actualWeightQtl);
      if (isNaN(w) || !isFinite(w) || w <= 0 || w > 500) {
        console.warn("Invalid weight rejected in updateBookingStatus:", extraData.actualWeightQtl);
        return false;
      }
    }

    // Check if target booking exists
    const existingTarget = bookings.find(tok => tok.bookingId === identifier || tok.token === identifier || tok.id === identifier);
    if (!existingTarget) {
      console.warn(`Booking with identifier ${identifier} not found.`);
      return false;
    }

    // Guard: Prevent approval if moisture exceeds 14.0%
    if (normalizedStatus === "APPROVED") {
      const moistureVal = extraData.moisturePercent !== undefined ? Number(extraData.moisturePercent) : existingTarget.moisturePercent;
      if (moistureVal !== null && moistureVal !== undefined && moistureVal > 14.0) {
        console.warn("Cannot approve booking: moisture exceeds 14.0%:", moistureVal);
        return false;
      }
    }

    const updatedTokens = bookings.map((tok) => {
      const isMatch = tok.bookingId === identifier || tok.token === identifier || tok.id === identifier;
      if (!isMatch) return tok;

      const history = Array.isArray(tok.timelineHistory) ? [...tok.timelineHistory] : [];
      let updatedObj = { ...tok, status: normalizedStatus, updatedAt: nowIso };

      const isHi = language === "hi";
      if (normalizedStatus === "ARRIVED") {
        history.push({ status: "ARRIVED", time: nowTime, desc: isHi ? "गेट 1 पर चेक-इन किया गया" : "Checked-in at Gate 1" });
        notifyMsg = isHi ? `टोकन ${updatedObj.token}: किसान गेट पर उपस्थित हुआ।` : `Token ${updatedObj.token}: Farmer checked-in at gate.`;
      } else if (normalizedStatus === "CALLED") {
        history.push({ status: "CALLED", time: nowTime, desc: isHi ? "वजन के लिए बुलाया गया" : "Called for weighing" });
        notifyMsg = isHi ? `टोकन ${updatedObj.token}: कृपया वेईब्रिज पर जाएं।` : `Token ${updatedObj.token}: Proceed to Weighbridge.`;
      } else if (normalizedStatus === "WEIGHING") {
        const rawWeight = extraData.actualWeightQtl !== undefined ? extraData.actualWeightQtl : (tok.actualWeightQtl || tok.quantityQtl || tok.quantity || 42);
        const weight = Math.max(0.1, Number(rawWeight));
        updatedObj.actualWeightQtl = weight;
        updatedObj.totalAmount = Math.max(0, Math.round(weight * (tok.mspPerQtl || 2275)));
        history.push({ status: "WEIGHING", time: nowTime, desc: isHi ? `वाहन वेईब्रिज पर। दर्ज वजन: ${weight} क्विंटल` : `Vehicle on Weighbridge. Recorded: ${weight} Qtl` });
        notifyMsg = isHi ? `टोकन ${updatedObj.token}: वेईब्रिज वजन पूरा हुआ (${weight} क्विंटल)।` : `Token ${updatedObj.token}: Weighbridge weighing completed (${weight} Qtl).`;
      } else if (normalizedStatus === "QUALITY_CHECK") {
        const moisture = extraData.moisturePercent !== undefined ? Number(extraData.moisturePercent) : (tok.moisturePercent || 11.8);
        const grade = extraData.grade || tok.grade || (moisture > 14.0 ? "Failed" : "Grade A");
        updatedObj.moisturePercent = moisture;
        updatedObj.grade = grade;
        updatedObj.remarks = extraData.remarks || tok.remarks || "";
        history.push({ status: "QUALITY_CHECK", time: nowTime, desc: isHi ? `गुणवत्ता जांच (${moisture}% नमी, ${grade})` : `Quality Check (${moisture}% Moisture, ${grade})${extraData.remarks ? ' - ' + extraData.remarks : ''}` });
        notifyMsg = isHi ? `टोकन ${updatedObj.token}: गुणवत्ता निरीक्षण (${moisture}% नमी, ${grade})।` : `Token ${updatedObj.token}: Quality inspection (${moisture}% moisture, ${grade}).`;
      } else if (normalizedStatus === "APPROVED") {
        history.push({ status: "APPROVED", time: nowTime, desc: isHi ? "केंद्र निरीक्षक द्वारा गुणवत्ता और मात्रा स्वीकृत" : "Quality and quantity approved by Centre Inspector" });
        notifyMsg = isHi ? `टोकन ${updatedObj.token}: गुणवत्ता स्वीकृत हुई। पूर्ण करने के लिए तैयार।` : `Token ${updatedObj.token}: Quality approved. Ready for completion.`;
      } else if (normalizedStatus === "PROCUREMENT_COMPLETED") {
        const rawWeight = extraData.actualWeightQtl !== undefined ? extraData.actualWeightQtl : (tok.actualWeightQtl || tok.quantityQtl || tok.quantity || 42);
        const weight = Math.max(0.1, Number(rawWeight));
        updatedObj.actualWeightQtl = weight;
        updatedObj.totalAmount = Math.max(0, Math.round(weight * (tok.mspPerQtl || 2275)));
        updatedObj.paymentStatus = "PROCESSING";
        history.push({ status: "PROCUREMENT_COMPLETED", time: nowTime, desc: isHi ? "खरीद पूर्ण हुई और डिजिटल रसीद जारी की गई" : "Procurement completed & digital receipt generated" });
        notifyMsg = isHi ? `टोकन ${updatedObj.token}: खरीद पूर्ण हुई! भुगतान प्रक्रिया शुरू हुई।` : `Token ${updatedObj.token}: Procurement complete! Payment initiated.`;
      } else if (normalizedStatus === "PAYMENT_INITIATED" || normalizedStatus === "PAYMENT_PROCESSING") {
        updatedObj.paymentStatus = "PROCESSING";
        history.push({ status: "PAYMENT_PROCESSING", time: nowTime, desc: isHi ? "बैंक ट्रांसफर सत्यापन प्रक्रियाधीन" : "PFMS / Bank Transfer Verification in progress" });
        notifyMsg = isHi ? `टोकन ${updatedObj.token}: प्रत्यक्ष भुगतान प्रक्रिया जारी है।` : `Token ${updatedObj.token}: Direct payment processing underway.`;
      } else if (normalizedStatus === "PAYMENT_COMPLETED") {
        const txRef = extraData.paymentTxRef || tok.paymentTxRef || `DEMO-TRX-${Math.floor(10000 + Math.random() * 90000)}`;
        updatedObj.paymentStatus = "COMPLETED";
        updatedObj.paymentTxRef = txRef;
        history.push({ status: "PAYMENT_COMPLETED", time: nowTime, desc: isHi ? `प्रत्यक्ष बैंक हस्तांतरण सफल (संदर्भ: ${txRef})` : `Direct Bank Transfer Successful (Ref: ${txRef})` });
        notifyMsg = isHi ? `टोकन ${updatedObj.token}: ₹${updatedObj.totalAmount.toLocaleString()} बैंक खाते में स्थानांतरित (संदर्भ: ${txRef})।` : `Token ${updatedObj.token}: ₹${updatedObj.totalAmount.toLocaleString()} credited to bank account (Ref: ${txRef}).`;
      } else if (normalizedStatus === "REJECTED") {
        history.push({ status: "REJECTED", time: nowTime, desc: isHi ? "खरीद अस्वीकृत: गुणवत्ता मानक पूरे नहीं हुए" : `Procurement rejected: ${extraData.remarks || 'Failed quality check'}` });
        notifyMsg = isHi ? `टोकन ${updatedObj.token}: खरीद अस्वीकृत की गई।` : `Token ${updatedObj.token}: Procurement rejected.`;
      }

      updatedObj.timelineHistory = history;
      targetBooking = updatedObj;
      return updatedObj;
    });

    const finalizedTokens = recalculateQueuePositions(updatedTokens);

    setBookings(finalizedTokens);
    setCentres((prev) => recalculateCentreMetrics(prev, finalizedTokens));

    if (notifyMsg && targetBooking) {
      const isHi = language === "hi";
      addNotification({
        type: normalizedStatus,
        title: isHi ? `स्थिति अपडेट (${targetBooking.token})` : `Status Update (${targetBooking.token})`,
        message: notifyMsg,
        time: isHi ? "अभी" : "Just now"
      });
    }
    return true;
  };

  const updateCentreCapacity = (centreId, updates) => {
    setCentres((prevCentres) =>
      prevCentres.map((c) => {
        if (c.id !== centreId) return c;
        const updated = { ...c, ...updates };
        const loadPercent = Math.min(100, Math.round((updated.booked / updated.capacity) * 100));
        let status = "NORMAL";
        if (loadPercent >= 95) status = "CRITICAL";
        else if (loadPercent >= 80) status = "HIGH_LOAD";
        return { ...updated, loadPercent, status };
      })
    );
  };

  const updateSlotCapacity = (slotTime, changeAmount) => {
    setSlots((prevSlots) =>
      prevSlots.map((s) => {
        if (s.time === slotTime) {
          const newCap = Math.max(5, s.capacity + changeAmount);
          return {
            ...s,
            capacity: newCap,
            status: s.booked >= newCap ? "FULL" : "AVAILABLE"
          };
        }
        return s;
      })
    );
  };

  // Temporary top-right toasts
  const [toasts, setToasts] = useState([]);

  const addToast = ({ type = "info", title, message, duration = 4000 }) => {
    setToasts((prev) => {
      // Prevent duplicate notifications for the same event
      const isDuplicate = prev.some(
        (t) => t.title === title && t.message === message && t.type === type
      );
      if (isDuplicate) return prev;
      const id = Date.now() + Math.random();
      const newToast = { id, type, title, message, duration };
      if (duration > 0) {
        setTimeout(() => {
          setToasts((current) => current.filter((t) => t.id !== id));
        }, duration);
      }
      return [...prev, newToast];
    });
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addNotification = (notif) => {
    setNotifications((prev) => [{ id: Date.now(), read: false, ...notif }, ...prev]);
    if (notif.title || notif.message) {
      let toastType = "info";
      if (notif.type === "SLOT_CONFIRMED" || notif.type === "PROCUREMENT_APPROVED" || notif.type === "PAYMENT_COMPLETED") {
        toastType = "success";
      } else if (notif.type === "ALERT" || notif.type === "ERROR") {
        toastType = "error";
      } else if (notif.type === "WARNING") {
        toastType = "warning";
      }
      addToast({
        type: toastType,
        title: notif.title,
        message: notif.message
      });
    }
  };

  // Used for updating a farmer's bank details profile
  const updateFarmerBankDetails = (farmerId, newBankDetails) => {
    setRegisteredFarmers(prev => prev.map(f => {
      if (f.id === farmerId) {
        return { ...f, bankDetails: newBankDetails };
      }
      return f;
    }));
    if (authenticatedUser && authenticatedUser.id === farmerId) {
      setAuthenticatedUser(prev => ({ ...prev, bankDetails: newBankDetails }));
    }
    addToast({
      type: "success",
      title: language === "hi" ? "बैंक विवरण अपडेट हुआ" : "Bank Details Updated",
      message: language === "hi" ? "बैंक खाते का विवरण सफलतापूर्वक सहेजा गया।" : "Bank details saved successfully."
    });
  };

  // Cancel a booking
  const cancelBooking = (bookingId) => {
    const target = bookings.find(b => b.bookingId === bookingId || b.id === bookingId);
    if (!target) return { error: "NOT_FOUND" };

    if (!isBookingCancellable(target)) {
      addToast({
        type: "error",
        title: language === "hi" ? "रद्द नहीं किया जा सकता" : "Cannot Cancel",
        message: language === "hi" ? "यह बुकिंग अब रद्द करने योग्य नहीं है।" : "This booking can no longer be cancelled."
      });
      return { error: "CANNOT_CANCEL" };
    }

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const nowIso = new Date().toISOString();
    const isHi = language === "hi";

    // 1. Release slot capacity
    setSlots(prevSlots =>
      prevSlots.map(s => {
        if (s.time === target.slot || s.time === target.slotTime) {
          const newBooked = Math.max(0, s.booked - 1);
          return { ...s, booked: newBooked, status: newBooked >= s.capacity ? "FULL" : "AVAILABLE" };
        }
        return s;
      })
    );

    // 2. Mark booking as CANCELLED, remove queue position
    let updatedBookings = bookings.map(b => {
      if (b.bookingId === bookingId || b.id === bookingId) {
        const history = Array.isArray(b.timelineHistory) ? [...b.timelineHistory] : [];
        history.push({
          status: "CANCELLED",
          time: nowTime,
          desc: isHi ? "किसान द्वारा बुकिंग रद्द की गई। स्लॉट क्षमता जारी।" : "Booking cancelled by farmer. Slot capacity released."
        });
        return {
          ...b,
          status: "CANCELLED",
          queuePosition: 0,
          queuePos: 0,
          estimatedWait: 0,
          estimatedWaitMin: 0,
          updatedAt: nowIso,
          timelineHistory: history
        };
      }
      return b;
    });

    // 3. Recalculate queue positions (shifts other farmers forward)
    updatedBookings = recalculateQueuePositions(updatedBookings);
    setBookings(updatedBookings);

    // 4. Update centre metrics
    setCentres(prev => recalculateCentreMetrics(prev, updatedBookings));

    // 5. Notify & toast
    addNotification({
      type: "WARNING",
      title: isHi ? "बुकिंग रद्द की गई" : "Booking Cancelled",
      message: isHi ? `टोकन ${target.token}: स्लॉट बुकिंग रद्द कर दी गई है।` : `Token ${target.token}: Slot booking cancelled and capacity released.`,
      time: isHi ? "अभी" : "Just now"
    });

    addToast({
      type: "info",
      title: isHi ? "बुकिंग रद्द" : "Booking Cancelled",
      message: isHi ? "आपकी स्लॉट बुकिंग रद्द कर दी गई है और स्लॉट क्षमता जारी की गई है।" : "Your slot booking has been cancelled and capacity released."
    });

    return { success: true };
  };

  // Reschedule a booking to a new available date and/or slot
  const rescheduleBooking = (bookingId, newDateOrSlot, maybeSlot) => {
    const target = bookings.find(b => b.bookingId === bookingId || b.id === bookingId);
    if (!target) return { error: "NOT_FOUND" };

    if (!isBookingCancellable(target)) {
      addToast({
        type: "error",
        title: language === "hi" ? "पुनः निर्धारित नहीं हो सकता" : "Cannot Reschedule",
        message: language === "hi" ? "यह बुकिंग अब पुनः निर्धारित करने योग्य नहीं है।" : "This booking can no longer be rescheduled."
      });
      return { error: "CANNOT_RESCHEDULE" };
    }

    let newDate, newSlotTime;
    if (maybeSlot) {
      newDate = newDateOrSlot;
      newSlotTime = maybeSlot;
    } else {
      if (newDateOrSlot.includes("AM") || newDateOrSlot.includes("PM") || newDateOrSlot.includes("–")) {
        newSlotTime = newDateOrSlot;
        newDate = target.date || "Today";
      } else {
        newDate = newDateOrSlot;
        newSlotTime = target.slot || target.slotTime;
      }
    }

    // 1. Validate Advance Booking Window (Today + next 4 days; past dates disallowed)
    const windowCheck = isDateInAdvanceWindow(newDate);
    if (!windowCheck.valid) {
      const isHi = language === "hi";
      if (windowCheck.reason === "PAST_DATE") {
        addToast({
          type: "error",
          title: isHi ? "अमान्य तिथि" : "Invalid Date",
          message: isHi ? "पिछली तिथियों के लिए स्लॉट बुक नहीं किए जा सकते।" : "Cannot book slots for past dates."
        });
        return { error: "INVALID_DATE" };
      }
      addToast({
        type: "error",
        title: isHi ? "अग्रिम सीमा समाप्त" : "Outside Advance Window",
        message: isHi ? "बुकिंग केवल 4-दिवसीय अग्रिम अवधि के भीतर ही मान्य है।" : "Booking is only allowed within the 4-day advance window."
      });
      return { error: "OUTSIDE_ADVANCE_WINDOW" };
    }

    const oldSlotTime = target.slot || target.slotTime;
    const oldDate = target.date || "Today";
    const isSameDateAndSlot = normalizeDate(oldDate) === normalizeDate(newDate) && oldSlotTime === newSlotTime;

    // 2. Validate Slot Capacity (Strict ceiling: SAME CENTRE + SAME DATE + SAME TIME SLOT)
    const availability = getSlotAvailability(target.centreId, newDate, newSlotTime);
    if (availability.isFull && !isSameDateAndSlot) {
      addToast({
        type: "error",
        title: language === "hi" ? "स्लॉट अनुपलब्ध" : "Slot Unavailable",
        message: language === "hi" ? "चुना गया स्लॉट इस तिथि के लिए पहले से ही भरा हुआ है।" : "Selected slot is already full for this date."
      });
      return { error: "SLOT_FULL" };
    }

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const nowIso = new Date().toISOString();
    const isHi = language === "hi";

    // 3. Update slot capacity counter for slots
    setSlots(prevSlots =>
      prevSlots.map(s => {
        if (s.time === oldSlotTime && s.time === newSlotTime) return s;
        if (s.time === oldSlotTime) {
          const newB = Math.max(0, s.booked - 1);
          return { ...s, booked: newB, status: newB >= s.capacity ? "FULL" : "AVAILABLE" };
        }
        if (s.time === newSlotTime) {
          const newB = s.booked + 1;
          return { ...s, booked: newB, status: newB >= s.capacity ? "FULL" : "AVAILABLE" };
        }
        return s;
      })
    );

    // 4. Update booking slot, date, and timeline
    let updatedBookings = bookings.map(b => {
      if (b.bookingId === bookingId || b.id === bookingId) {
        const history = Array.isArray(b.timelineHistory) ? [...b.timelineHistory] : [];
        history.push({
          status: "BOOKED",
          time: nowTime,
          desc: isHi 
            ? `स्लॉट बदलकर ${formatBookingDate(newDate)}, ${newSlotTime} किया गया (पूर्व: ${formatBookingDate(oldDate)}, ${oldSlotTime})` 
            : `Rescheduled to ${formatBookingDate(newDate)}, ${newSlotTime} (Prev: ${formatBookingDate(oldDate)}, ${oldSlotTime})`
        });
        return {
          ...b,
          date: newDate,
          slot: newSlotTime,
          slotTime: newSlotTime,
          slotBookedAt: nowIso,
          updatedAt: nowIso,
          timelineHistory: history
        };
      }
      return b;
    });

    // 3. Recalculate queue positions (shifts old slot queue forward, assigns new queue position in new slot)
    updatedBookings = recalculateQueuePositions(updatedBookings);
    setBookings(updatedBookings);

    // 4. Update centre metrics
    setCentres(prev => recalculateCentreMetrics(prev, updatedBookings));

    // 5. Notify & toast
    addNotification({
      type: "SLOT_CONFIRMED",
      title: isHi ? "स्लॉट पुनः निर्धारित" : "Booking Rescheduled",
      message: isHi ? `टोकन ${target.token}: नया स्लॉट ${newSlotTime} निर्धारित किया गया।` : `Token ${target.token}: Rescheduled to new slot ${newSlotTime}.`,
      time: isHi ? "अभी" : "Just now"
    });

    addToast({
      type: "success",
      title: isHi ? "स्लॉट पुनः निर्धारित" : "Reschedule Successful",
      message: isHi ? `नया स्लॉट: ${newSlotTime}` : `Booking rescheduled to ${newSlotTime}.`
    });

    return { success: true, updatedBooking: updatedBookings.find(b => b.bookingId === bookingId) };
  };

  return (
    <KisanSetuContext.Provider
      value={{
        language,
        setLanguage,
        t,
        lowNetworkMode,
        setLowNetworkMode,
        currentRole,
        setCurrentRole,
        isAuthenticated,
        authenticatedUser,
        login,
        logout,
        registeredFarmers,
        registerFarmer,
        loginFarmer,
        updateFarmerBankDetails,
        centres,
        slots,
        bookings,
        notifications,
        toasts,
        addToast,
        removeToast,
        activeCentreId,
        setActiveCentreId,
        activeBooking,
        activeCentre,
        bookSlot,
        cancelBooking,
        rescheduleBooking,
        isBookingCancellable,
        getSlotAvailability,
        getAdvanceBookingDates,
        normalizeDate,
        formatBookingDate,
        isDateInAdvanceWindow,
        ADVANCE_BOOKING_DAYS,
        updateBookingStatus,
        updateCentreCapacity,
        updateSlotCapacity,
        addNotification,
        activeFarmerTab,
        setActiveFarmerTab,
        activeOperatorTab,
        setActiveOperatorTab,
        activeAdminTab,
        setActiveAdminTab
      }}
    >
      {children}
    </KisanSetuContext.Provider>
  );
};

export const useKisanSetu = () => {
  const context = useContext(KisanSetuContext);
  if (!context) {
    throw new Error("useKisanSetu must be used within a KisanSetuProvider");
  }
  return context;
};
