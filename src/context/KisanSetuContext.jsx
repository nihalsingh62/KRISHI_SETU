import React, { createContext, useContext, useState, useEffect } from "react";
import { INITIAL_CENTRES, INITIAL_SLOTS, INITIAL_BOOKINGS, INITIAL_NOTIFICATIONS } from "../data/mockData";
import { translations } from "../data/translations";

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
  const [bookings, setBookings] = useState(() => getInitialState("ks_bookings", INITIAL_BOOKINGS));
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

  // Farmer active booking - strictly scoped to authenticatedUser.id
  const getActiveBooking = () => {
    if (currentRole === "farmer" && authenticatedUser) {
      const farmerTokens = bookings.filter(t => t.farmerId === authenticatedUser.id);
      return farmerTokens.length > 0 ? farmerTokens[farmerTokens.length - 1] : null;
    }
    return null;
  };
  const activeBooking = getActiveBooking();
  const activeCentre = centres.find((c) => c.id === activeCentreId) || centres[0];

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

  const recalculateQueuePositions = (tokenList) => {
    const updated = [...tokenList];
    const centresSet = new Set(updated.map(t => t.centreId));
    
    centresSet.forEach(cId => {
      // Clear position for non-queue statuses
      updated.filter(t => t.centreId === cId).forEach(tok => {
        const tIndex = updated.findIndex(t => t.bookingId === tok.bookingId);
        if (!["BOOKED", "CONFIRMED", "ARRIVED", "WAITING"].includes(tok.status)) {
          if (tIndex !== -1) {
            updated[tIndex].queuePosition = 0;
            updated[tIndex].estimatedWait = 0;
          }
        }
      });

      // Find active bookings in queue for this centre
      const inQueueTokens = updated.filter(t => t.centreId === cId && ["BOOKED", "CONFIRMED", "ARRIVED", "WAITING"].includes(t.status));
      
      inQueueTokens.sort((a, b) => a.bookingId.localeCompare(b.bookingId));
      
      inQueueTokens.forEach((tok, index) => {
        const tIndex = updated.findIndex(t => t.bookingId === tok.bookingId);
        if (tIndex !== -1) {
          updated[tIndex].queuePosition = index + 1;
          updated[tIndex].estimatedWait = Math.max(5, Math.round((index + 1) * 6));
        }
      });
    });
    return updated;
  };

  // Booking a slot by farmer with duplicate booking prevention
  const bookSlot = ({ commodity, crop, quantityQtl, quantity, centreId, date, slotTime, slot }) => {
    if (!authenticatedUser) return null;

    const chosenCrop = commodity || crop || "Wheat";
    const chosenQty = Number(quantityQtl || quantity || 40);
    const chosenSlot = slotTime || slot || "10:00 AM – 11:00 AM";
    const chosenDate = date || "Today";

    // Duplicate booking prevention: search active bookings for same farmerId, date, centreId, slot
    const existingActive = bookings.find((b) => 
      b.farmerId === authenticatedUser.id &&
      b.centreId === centreId &&
      (b.slot === chosenSlot || b.slotTime === chosenSlot) &&
      (b.date === chosenDate || b.date === "Today" || chosenDate === "Today") &&
      !["CANCELLED", "REJECTED"].includes(b.status)
    );

    if (existingActive) {
      return {
        error: "DUPLICATE_BOOKING",
        message: "You already have an active booking for this slot.",
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

    const centre = centres.find((c) => c.id === centreId) || centres[0];
    const msp = chosenCrop === "Wheat" ? 2275 : chosenCrop === "Paddy" ? 2300 : 2090;
    const estWait = Math.max(10, Math.round(centre.queueDepth * (centre.avgProcessingMin / centre.activeCounters)));

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
      queuePosition: centre.queueDepth + 1,
      queuePos: centre.queueDepth + 1,
      estimatedWait: estWait,
      estimatedWaitMin: estWait,
      actualWeightQtl: null,
      moisturePercent: null,
      grade: null,
      mspPerQtl: msp,
      totalAmount: Math.round(chosenQty * msp),
      paymentStatus: "NOT_INITIATED",
      paymentTxRef: null,
      createdAt: new Date().toISOString(),
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
      title: "Booking Confirmed",
      message: `Token ${nextTokenNum} issued for ${chosenCrop} (${chosenQty} Qtl) at ${centre.name}.`,
      time: "Just now"
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

      if (normalizedStatus === "ARRIVED") {
        history.push({ status: "ARRIVED", time: nowTime, desc: "Checked-in at Gate 1" });
        notifyMsg = `Token ${updatedObj.token}: Farmer checked-in at gate.`;
      } else if (normalizedStatus === "CALLED") {
        history.push({ status: "CALLED", time: nowTime, desc: "Called for weighing" });
        notifyMsg = `Token ${updatedObj.token}: Proceed to Weighbridge.`;
      } else if (normalizedStatus === "WEIGHING") {
        const rawWeight = extraData.actualWeightQtl !== undefined ? extraData.actualWeightQtl : (tok.actualWeightQtl || tok.quantityQtl || tok.quantity || 42);
        const weight = Math.max(0.1, Number(rawWeight));
        updatedObj.actualWeightQtl = weight;
        updatedObj.totalAmount = Math.max(0, Math.round(weight * (tok.mspPerQtl || 2275)));
        history.push({ status: "WEIGHING", time: nowTime, desc: `Vehicle on Weighbridge. Recorded: ${weight} Qtl` });
        notifyMsg = `Token ${updatedObj.token}: Weighbridge weighing completed (${weight} Qtl).`;
      } else if (normalizedStatus === "QUALITY_CHECK") {
        const moisture = extraData.moisturePercent !== undefined ? Number(extraData.moisturePercent) : (tok.moisturePercent || 11.8);
        const grade = extraData.grade || tok.grade || (moisture > 14.0 ? "Failed" : "Grade A");
        updatedObj.moisturePercent = moisture;
        updatedObj.grade = grade;
        updatedObj.remarks = extraData.remarks || tok.remarks || "";
        history.push({ status: "QUALITY_CHECK", time: nowTime, desc: `Quality Check (${moisture}% Moisture, ${grade})${extraData.remarks ? ' - ' + extraData.remarks : ''}` });
        notifyMsg = `Token ${updatedObj.token}: Quality inspection (${moisture}% moisture, ${grade}).`;
      } else if (normalizedStatus === "APPROVED") {
        history.push({ status: "APPROVED", time: nowTime, desc: "Quality and quantity approved by Centre Inspector" });
        notifyMsg = `Token ${updatedObj.token}: Quality approved. Ready for completion.`;
      } else if (normalizedStatus === "PROCUREMENT_COMPLETED") {
        const rawWeight = extraData.actualWeightQtl !== undefined ? extraData.actualWeightQtl : (tok.actualWeightQtl || tok.quantityQtl || tok.quantity || 42);
        const weight = Math.max(0.1, Number(rawWeight));
        updatedObj.actualWeightQtl = weight;
        updatedObj.totalAmount = Math.max(0, Math.round(weight * (tok.mspPerQtl || 2275)));
        updatedObj.paymentStatus = "PROCESSING";
        history.push({ status: "PROCUREMENT_COMPLETED", time: nowTime, desc: "Procurement completed & digital receipt generated" });
        notifyMsg = `Token ${updatedObj.token}: Procurement complete! Payment initiated.`;
      } else if (normalizedStatus === "PAYMENT_INITIATED" || normalizedStatus === "PAYMENT_PROCESSING") {
        updatedObj.paymentStatus = "PROCESSING";
        history.push({ status: "PAYMENT_PROCESSING", time: nowTime, desc: "PFMS / Bank Transfer Verification in progress" });
        notifyMsg = `Token ${updatedObj.token}: Direct payment processing underway.`;
      } else if (normalizedStatus === "PAYMENT_COMPLETED") {
        const txRef = extraData.paymentTxRef || tok.paymentTxRef || `DEMO-TRX-${Math.floor(10000 + Math.random() * 90000)}`;
        updatedObj.paymentStatus = "COMPLETED";
        updatedObj.paymentTxRef = txRef;
        history.push({ status: "PAYMENT_COMPLETED", time: nowTime, desc: `Direct Bank Transfer Successful (Ref: ${txRef})` });
        notifyMsg = `Token ${updatedObj.token}: ₹${updatedObj.totalAmount.toLocaleString()} credited to bank account (Ref: ${txRef}).`;
      } else if (normalizedStatus === "REJECTED") {
        history.push({ status: "REJECTED", time: nowTime, desc: `Procurement rejected: ${extraData.remarks || 'Failed quality check'}` });
        notifyMsg = `Token ${updatedObj.token}: Procurement rejected.`;
      }

      updatedObj.timelineHistory = history;
      targetBooking = updatedObj;
      return updatedObj;
    });

    const finalizedTokens = recalculateQueuePositions(updatedTokens);

    setBookings(finalizedTokens);
    setCentres((prev) => recalculateCentreMetrics(prev, finalizedTokens));

    if (notifyMsg && targetBooking) {
      addNotification({
        type: normalizedStatus,
        title: `Status Update (${targetBooking.token})`,
        message: notifyMsg,
        time: "Just now"
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

  const addNotification = (notif) => {
    setNotifications((prev) => [{ id: Date.now(), read: false, ...notif }, ...prev]);
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
        activeCentreId,
        setActiveCentreId,
        activeBooking,
        activeCentre,
        bookSlot,
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
